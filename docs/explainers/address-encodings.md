# `src/address.ts` — four encodings, line by line

A private key is 32 bytes on both curves, but an *address* is a presentation choice made per
chain. This module owns all four presentations, plus the two digests they share.

## The shared constants

`BITCOIN_HRP` (`src/address.ts:26`) is `"bc"`, the human-readable part of mainnet bech32
addresses. `TRON_PREFIX` (`src/address.ts:29`) is the single byte `0x41` — the reason every
TRON address begins with `T`. `BECH32_LIMIT` (`src/address.ts:32`) is BIP-173's 90-character
ceiling, passed explicitly so an over-long witness program fails loudly instead of silently
truncating.

## HASH160

`hash160` (`src/address.ts:35`) is the Bitcoin workhorse digest:

```ts
export function hash160(data: Uint8Array): Uint8Array {
  return ripemd160(sha256(data));
}
```

Twenty bytes, and no checksum of its own — bech32 supplies the checksum around it.

## EIP-55 mixed-case checksum

`toEip55Checksum` (`src/address.ts:45`) is the entire security model of an EVM address string:
40 hex characters carry ~15 embedded check bits, free of charge.

```ts
const hash = keccak_256(utf8ToBytes(lower));
let checksummed = "";
for (let index = 0; index < lower.length; index += 1) {
  const byte = hash[index >> 1] ?? 0;
  const nibble = index % 2 === 0 ? byte >> 4 : byte & 0x0f;
  const character = lower[index] ?? "";
  checksummed += nibble >= 8 ? character.toUpperCase() : character;
}
```

The rules, in order:

1. Hash the **lowercase ASCII** of the address (not the raw bytes) with keccak-256.
2. For each character position `i`, read nibble `i` of the hash — high nibble for even
   positions, low nibble for odd ones (`index >> 1` selects the byte, the parity picks the
   half).
3. Uppercase the character when that nibble is 8 or higher; leave it otherwise. Digits are
   unaffected because `.toUpperCase()` on a digit is a no-op.

The official ERC-55 vectors — all-caps, all-lowercase, and mixed — are pinned in
`test/addresses.test.ts`, so an off-by-one in the nibble parity cannot survive the suite.

## Public-key serializations

`uncompressedPublicKey` (`src/address.ts:59`) and `compressedPublicKey` (`src/address.ts:64`)
wrap `secp256k1.getPublicKey` and strip or keep the serialization tag:

- Uncompressed: 65 bytes (`0x04 ‖ x ‖ y`); the module slices off the `0x04` to leave the raw
  64-byte point.
- Compressed: 33 bytes (`0x02/0x03 ‖ x`), where the first byte encodes the parity of `y`.

The choice is not cosmetic — it is baked into each chain's address algorithm, and swapping
them yields a well-formed but wrong address.

## The EVM/TRON shared body

`keccakAddressBody` (`src/address.ts:69`) produces the 20 bytes both EVM and TRON treat as the
account:

```ts
function keccakAddressBody(privateKey: Uint8Array): Uint8Array {
  return keccak_256(uncompressedPublicKey(privateKey)).slice(-20);
}
```

`keccak256(uncompressed_pubkey)[12:]` — the last 20 bytes of the 32-byte hash. EVM renders
those bytes as checksummed hex; TRON renders them as base58check with a version byte.

## The four encoders

`toEvmAddress` (`src/address.ts:79`) — checksummed hex:

```ts
return `0x${toEip55Checksum(bytesToHex(keccakAddressBody(privateKey)))}`;
```

`toBitcoinNativeSegwitAddress` (`src/address.ts:89`) — a P2WPKH witness program in bech32:

```ts
const digest = hash160(compressedPublicKey(privateKey));
return bech32.encode(BITCOIN_HRP, [0, ...bech32.toWords(digest)], BECH32_LIMIT);
```

`[0, ...]` is the witness version (0 = SegWit v0); `bech32.toWords` regroups the 20 digest
bytes from 8-bit to 5-bit symbols, which is what bech32's alphabet needs.

`toSolanaAddress` (`src/address.ts:100`) — the shortest encoder in the file:

```ts
return base58.encode(ed25519.getPublicKey(privateKey));
```

No hash, no checksum, no version byte. An ed25519 public key is 32 bytes, and Solana's address
*is* that key in base58.

`toTronAddress` (`src/address.ts:110`) — version byte plus base58check:

```ts
const body = concatBytes(new Uint8Array([TRON_PREFIX]), keccakAddressBody(privateKey));
return base58check(sha256).encode(body);
```

`base58check(sha256)` is the coder factory from `@scure/base`; it appends the first four bytes
of `SHA-256(SHA-256(payload))` before base58-encoding, which is the same checksum scheme legacy
Bitcoin addresses use.

## The encoding table

| Encoder                       | Input digest                    | Alphabet + checksum               | Example prefix |
| ----------------------------- | ------------------------------- | --------------------------------- | -------------- |
| `toEvmAddress`                | keccak body (20 B)              | hex + EIP-55 mixed case           | `0x`           |
| `toBitcoinNativeSegwitAddress`| HASH160 (20 B)                  | bech32 (BCH checksum)             | `bc1q`         |
| `toSolanaAddress`             | raw ed25519 key (32 B)          | base58, **no checksum**           | (varies)       |
| `toTronAddress`               | `0x41` + keccak body (21 B)     | base58check (double-SHA-256)      | `T`            |

Two traps live in this table. First, the EVM and TRON encoders hash the *uncompressed* key
while Bitcoin hashes the *compressed* one. Second, Solana is the only address here with no
checksum at all — a single mistyped character usually yields a non-existent account rather
than an error, so Solana transfers deserve extra care.
