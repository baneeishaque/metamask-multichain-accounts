# Derivation guide

This is the practical companion to [architecture.md](architecture.md): the same pipeline, step
by step, with the vocabulary, the pitfalls, and a way to verify every claim yourself.

## 1. Recovery phrase → seed

A BIP-39 recovery phrase encodes 128–256 bits of entropy as 12–24 words, with a checksum baked
into the last word. The phrase itself is not a key. It becomes one through PBKDF2:

```text
seed = PBKDF2-HMAC-SHA512(
    password = NFKD(phrase),
    salt     = "mnemonic" + NFKD(passphrase),
    rounds   = 2048,
    length   = 64 bytes,
)
```

Two consequences worth internalizing:

- The **passphrase** (the optional "25th word") is not stored in the phrase. The same phrase
  with different passphrases produces completely different wallets. Lose the passphrase and
  the accounts are gone even with the phrase intact.
- The seed is **64 bytes**, not 32, and it is the only input the derivation trees ever see.

In code: `seedFromMnemonic` in [`src/derive.ts`](../src/derive.ts) (delegating to
`@scure/bip39`).

## 2. Seed → two master keys

The seed is not itself a private key. Each curve family derives a *master* key from it:

| Curve     | Standard  | HMAC key          | Result                                      |
| --------- | --------- | ----------------- | ------------------------------------------- |
| secp256k1 | BIP-32    | `"Bitcoin seed"`  | 32-byte private key + 32-byte chain code    |
| ed25519   | SLIP-0010 | `"ed25519 seed"`  | 32-byte key seed + 32-byte chain code       |

Different HMAC keys are what keep the two trees cryptographically independent: the same seed
never yields the same key material on two curves.

## 3. Master keys → four child keys

Child derivation walks a path. The apostrophe means *hardened*: the child key is derived from
the parent **private** key, so it cannot be recomputed from a parent public key (an xpub).
Non-hardened steps allow public derivation — useful for watch-only wallets, but it means a
leaked xpub plus one child private key can expose sibling keys. Wallets harden the account
levels for exactly that reason.

MetaMask's four branches:

| Branch  | Path                | Segment meanings                                              |
| ------- | ------------------- | ------------------------------------------------------------- |
| EVM     | `m/44'/60'/0'/0/0`  | BIP-44 · coin type 60 (Ethereum) · account 0 · external · #0  |
| Bitcoin | `m/84'/0'/0'/0/0`   | BIP-84 (native SegWit) · coin type 0 · account 0 · external · #0 |
| Solana  | `m/44'/501'/0'/0'`  | BIP-44 · coin type 501 (Solana) · account 0 · change · #0     |
| TRON    | `m/44'/195'/0'/0/0` | BIP-44 · coin type 195 (TRON) · account 0 · external · #0     |

Note what differs and what does not:

- Bitcoin uses purpose `84'`, not `44'` — that is the marker for native SegWit addresses. The
  same seed at `m/44'/0'/0'/0/0` would produce a legacy `1…` address instead, and at
  `m/86'/0'/0'/0/0` a Taproot `bc1p…` address.
- Solana's path is hardened **all the way down** (`0'/0'` at the end). SLIP-0010 ed25519
  supports only hardened derivation, so a path like `m/44'/501'/0'/0/0` is not even defined.
- The trailing `/0/0` is the "first receiving address" convention: account index 0, external
  chain, address index 0. Address index 1 is the second receive address of the same account.

In code: `CHAINS` in [`src/derive.ts`](../src/derive.ts) is the single source of truth for this
table; `src/slip10.ts` implements the ed25519 walk.

## 4. Child keys → four addresses

Each branch encodes its key differently, and the differences are not cosmetic:

| Branch  | Encoding                                                             | Address looks like              |
| ------- | -------------------------------------------------------------------- | ------------------------------- |
| EVM     | `keccak256(uncompressed_pubkey[1:])[12:]`, then EIP-55 mixed-case     | `0x9858EfFD…`                   |
| Bitcoin | `bech32("bc", 0 ‖ HASH160(compressed_pubkey))`                        | `bc1qcr8te4kr6…`                |
| Solana  | `base58(ed25519_pubkey)` — the public key *is* the address            | `HAgk14JpMQL…`                  |
| TRON    | `base58check(0x41 ‖ keccak256(uncompressed_pubkey[1:])[12:])`         | `TUEZSdKsoDHQ…`                 |

Three details that surprise people:

- **EVM and TRON share the same 20-byte body.** TRON's `TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH` is
  the base58check rendering of `0x41` + the same keccak body an EVM address would use. The
  version byte `0x41` is what makes every TRON address start with `T`.
- **Bitcoin hashes a compressed key; EVM hashes an uncompressed one.** Mixing them up produces
  a valid-looking but wrong address, which is why the vectors are pinned.
- **Solana never hashes the key at all.** There is no checksum in a base58 Solana address; a
  typo is caught only if the resulting bytes are not a valid point, or by the recipient's
  tooling.

## 5. Verify it yourself

```bash
npm run derive
```

The output is reproducible on any machine. To see the derivation end to end for your own
phrase:

```bash
npm run derive -- --mnemonic "your words" --show-private-keys
```

Then compare against a fresh MetaMask profile imported with the same phrase: the addresses
match because both follow the same standards. Two cautions: never use a funded phrase in a
demo context, and remember that the public test phrase's addresses are spendable by anyone.

## Pitfalls checklist

- **Passphrase mismatch** — the #1 cause of "my funds are gone": a restored wallet without the
  passphrase derives a different, empty account set.
- **Path mismatch** — Bitcoin at `44'` vs `84'` vs `86'`, or TRON at `60'` vs `195'`, all
  produce different addresses from the same seed.
- **Network mismatch** — testnet addresses use different prefixes (`tb1q…` vs `bc1q…`). Coins
  sent to a mainnet address from a testnet wallet (or vice versa) are unrecoverable.
- **One address, many balances** — the EVM address holds separate balances on each of the nine
  networks; a token on Linea is not visible on Base.
- **Gas tokens are per-chain** — holding ETH does not pay fees on BNB Chain (BNB) or Polygon
  (POL).
- **Export ≠ backup** — for BTC/SOL/TRON, MetaMask may not show a private key at all. The
  recovery phrase is the backup; treat any "no private key" message as normal, not as loss.

## Glossary

| Term          | Meaning                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| SRP           | Secret Recovery Phrase — MetaMask's name for the BIP-39 mnemonic.            |
| Entropy       | The random bits a mnemonic encodes (128–256).                                |
| Seed          | 64-byte PBKDF2 output; the root input to all derivation.                     |
| HD wallet     | Hierarchical deterministic wallet: one seed, a tree of keys.                 |
| Chain code    | 32-byte value mixed into every child derivation; part of an extended key.    |
| Hardened      | Child derived from the parent private key (`44'`); blocks public derivation. |
| secp256k1     | The elliptic curve behind Bitcoin, Ethereum, and TRON keys.                  |
| ed25519       | The Edwards-curve signature scheme behind Solana keys.                       |
| HASH160       | `RIPEMD-160(SHA-256(x))` — Bitcoin's 20-byte digest.                         |
| bech32        | The `bc1q…` address format (BIP-173) with a BCH checksum.                    |
| EIP-55        | Mixed-case checksum inside an EVM hex address.                               |
| base58check   | base58 with a 4-byte double-SHA-256 checksum (TRON, legacy Bitcoin).         |
| xpub          | Extended public key: a node's public key + chain code, for watch-only use.   |
