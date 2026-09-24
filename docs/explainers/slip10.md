# `src/slip10.ts` — ed25519 HD derivation, line by line

This is the repository's only in-repo cryptographic algorithm, and the one that answers the
question behind the whole project: *why does Solana get a different key from the same phrase?*

## Why SLIP-0010 exists

BIP-32 derives a child key by adding the parent key to a hash, using secp256k1's group
operation. ed25519 has no compatible operation: its private keys are seeds for a hash, not
scalars on a curve. SLIP-0010 works around this by removing the half of BIP-32 that needs the
group operation. A child key becomes:

```text
I  = HMAC-SHA512(key = parent_chain_code, data = 0x00 ‖ parent_key ‖ ser32(index))
kᵢ = I[0:32]      (the child private key)
cᵢ = I[32:64]     (the child chain code)
```

Because the parent's **private** key is in the data, only hardened derivation (`index ≥ 2³¹`)
exists — there is no public-key equivalent of this computation, so an ed25519 xpub cannot
produce children. That single fact is why Solana paths are hardened all the way down, and why
`m/44'/501'/0'/0'` is valid while `m/44'/501'/0'/0/0` is not even defined.

## The types and constants

`Slip10Node` (`src/slip10.ts:23`) is the whole state of a derivation step — the 32-byte key and
its chain code:

```ts
export interface Slip10Node {
  readonly privateKey: Uint8Array;
  readonly chainCode: Uint8Array;
}
```

`HARDENED_OFFSET` (`src/slip10.ts:29`) is `0x80000000`: adding it to an index is how BIP-32
and SLIP-0010 encode the apostrophe. `CURVE_SEED` (`src/slip10.ts:32`) is the HMAC key
`"ed25519 seed"` — the string that keeps the ed25519 tree cryptographically independent from
the secp256k1 tree derived from the same 64-byte seed.

`ser32` (`src/slip10.ts:35`) serializes an index as four big-endian bytes, per the
specification's `ser₃₂`:

```ts
function ser32(index: number): Uint8Array {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, index, false);
  return bytes;
}
```

## The master node

`masterNode` (`src/slip10.ts:47`) is step 1 of the specification — one HMAC over the seed:

```ts
export function masterNode(seed: Uint8Array): Slip10Node {
  const digest = hmac(sha512, CURVE_SEED, seed);
  return { privateKey: digest.slice(0, 32), chainCode: digest.slice(32) };
}
```

Note what is *not* here: BIP-32's validity retry loop. For ed25519 every 32-byte string is a
valid private key, so the specification's "retry if invalid" branch is dead code and is
deliberately omitted.

## The child node

`childNode` (`src/slip10.ts:59`) implements the hardened CKD function:

```ts
function childNode(parent: Slip10Node, index: number): Slip10Node {
  const data = concatBytes(new Uint8Array([0]), parent.privateKey, ser32(index));
  const digest = hmac(sha512, parent.chainCode, data);
  return { privateKey: digest.slice(0, 32), chainCode: digest.slice(32) };
}
```

Three things carry the specification's meaning:

- `new Uint8Array([0])` is the `0x00` pad that makes the serialized parent key 33 bytes, so a
  private key can never be confused with a public key in a derivation input.
- The **chain code is the HMAC key**, not the data — the same pattern as BIP-32.
- The function takes an already-offset index; the `+ 0x80000000` happens in `parsePath`.

## Path parsing

`parsePath` (`src/slip10.ts:75`) turns `"m/44'/501'/0'/0'"` into raw indices, and is the
enforcement point for ed25519's hardened-only rule:

```ts
const hardened = segment.endsWith("'");
const digits = hardened ? segment.slice(0, -1) : segment;
const value = Number(digits);
if (!hardened || !Number.isInteger(value) || value < 0 || value >= HARDENED_OFFSET) {
  throw new Error(/* … */);
}
return value + HARDENED_OFFSET;
```

Rejecting a non-hardened segment instead of silently hardening it is a deliberate contract:
`m/44/501'` and `m/44'/501'` mean different things in BIP-32, and in SLIP-0010 the former is
undefined. A caller that writes it has a bug worth hearing about. The same guard rejects
negative, fractional, and out-of-range indices. Bare `"m"` is special-cased to `[]` so the
specification's master-node vectors can be tested directly.

## The walk

`derivePath` (`src/slip10.ts:106`) is four lines of composition:

```ts
export function derivePath(seed: Uint8Array, path: string): Slip10Node {
  let node = masterNode(seed);
  for (const index of parsePath(path)) {
    node = childNode(node, index);
  }
  return node;
}
```

Everything above is pure and synchronous — no randomness, no I/O, no curve arithmetic. The
test suite pins all eight official ed25519 vectors from the specification, including the
six-level `m/0'/1'/2'/2'/1000000000'` walk, so correctness is checked against the standard
rather than against this code's own output.

## Porting notes

If you lift this code into another project, the pieces that must not change are the HMAC key
(`"ed25519 seed"`), the `0x00` pad, the chain-code-as-key direction, and big-endian `ser32`.
The pieces that are style are the error messages and the `parsePath` strictness — though
keeping the strictness is recommended.
