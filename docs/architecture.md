# Architecture

## What this system models

MetaMask's multichain accounts expose twelve networks — nine EVM chains plus Bitcoin, Solana,
and TRON — behind one BIP-39 recovery phrase. This repository models exactly one slice of that
system: **the derivation layer**. Given a phrase, it produces the four private keys and four
addresses the wallet would produce, using the same published standards.

What it deliberately does not model: signing, transaction construction, RPC communication,
balance queries, the encrypted vault, or the wallet UI. The demo is a pure function from
phrase to accounts — no network I/O, no state, no side effects beyond stdout.

## The pipeline

```text
                        ┌───────────────────────────────┐
  recovery phrase  ───▶ │ BIP-39  PBKDF2-HMAC-SHA512    │ ───▶ 64-byte seed
  (+ passphrase)        │ NFKD · 2048 rounds · "mnemonic"│
                        └───────────────────────────────┘
                                       │
              ┌────────────────────────┴────────────────────────┐
              │                                                 │
   ┌──────────▼───────────┐                         ┌───────────▼──────────┐
   │ BIP-32 master        │                         │ SLIP-0010 master     │
   │ HMAC-SHA512          │                         │ HMAC-SHA512          │
   │ key = "Bitcoin seed" │                         │ key = "ed25519 seed" │
   │ curve = secp256k1    │                         │ curve = ed25519      │
   └──────────┬───────────┘                         └───────────┬──────────┘
              │                                                 │
   ┌──────────┼──────────────┐                                  │
   │          │              │                                  │
 m/44'/60'  m/84'/0'    m/44'/195'                        m/44'/501'/0'/0'
   │          │              │                                  │
   ▼          ▼              ▼                                  ▼
 keccak+    HASH160+       keccak+                           base58
 EIP-55     bech32         base58check                       (raw pubkey)
   │          │              │                                  │
   ▼          ▼              ▼                                  ▼
 0x9858…    bc1qcr8…       TUEZSdK…                        HAgk14…
```

Two roots are generated from the same seed because secp256k1 and ed25519 cannot share a
derivation tree: BIP-32's child derivation uses elliptic-curve point addition, which has no
ed25519 equivalent. SLIP-0010 resolves this by dropping public derivation entirely, leaving a
hardened-only tree.

## Module map

| Module            | Responsibility                                                          | Depends on                     |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------ |
| `src/slip10.ts`   | SLIP-0010 ed25519 derivation: master node, hardened children, path parse. | `@noble/hashes`                |
| `src/address.ts`  | Four address encodings + EIP-55 checksum + HASH160.                      | `@noble/curves`, `@noble/hashes`, `@scure/base` |
| `src/derive.ts`   | The branch table (`CHAINS`), `deriveAccounts`, `seedFromMnemonic`.       | `@scure/bip32`, `@scure/bip39`, the two modules above |
| `src/report.ts`   | Human table and JSON rendering of accounts.                              | `src/derive.ts` (types)        |
| `src/cli.ts`      | Argument parsing, environment variable handling, warnings, exit codes.   | `src/derive.ts`, `src/report.ts` |
| `src/vectors.ts`  | Public test vectors (phrase, seeds, addresses) for demo + tests.         | —                              |

Dependencies point downward only; `src/derive.ts` is the only module that knows the branch
table, and every module below it is a pure function.

## Why twelve networks collapse to four accounts

An address is derived from a public key, and a public key from a private key. No chain ID,
network name, or RPC endpoint participates in that computation. Every EVM network therefore
computes the *same* address for the same key — the wallet displays it under nine names, but
there is one account there.

The non-EVM networks do not share that account because they do not share the key: MetaMask
follows the BIP-44 registered coin types (Bitcoin `0'`, Solana `501'`, TRON `195'`) and, for
Bitcoin, the BIP-84 purpose (`84'`) that selects native SegWit. Different path, different key,
different address.

The count therefore works out as: 9 EVM networks → 1 account; Bitcoin, Solana, TRON → 3
accounts. Twelve networks, four accounts, four keys, one phrase.

## The MetaMask keyring model (context)

Understanding the demo's output requires one piece of wallet context. MetaMask stores the
recovery phrase in an encrypted vault (encrypted with the local password) and hands it to
*keyrings* — one per curve family. Each keyring derives its branch:

- The EVM keyring is the original secp256k1 keyring; its private key is exportable in the UI.
- The Bitcoin, Solana, and TRON keyrings derive their own branches; as of the 2026 multichain
  release, their private keys are **not** exportable through the UI. The recovery phrase
  remains the universal backup, which is precisely why "where is my BTC private key?" has the
  answer "you already have it — it is the phrase".

The password plays no role in any of this: it decrypts the local vault and nothing else. Two
different passwords on two devices restore the same accounts from the same phrase.

## Invariants

- **Determinism** — same phrase, same passphrase, same accounts, on any platform, forever.
- **No network I/O** — nothing leaves the process; the demo works offline.
- **Purity** — `deriveAccounts` has no side effects; rendering is separated from derivation.
- **Vectors before output** — the test suite asserts against specification vectors, not
  against this implementation's own recorded output.

## Related reading

- [Derivation guide](derivation-guide.md) — the same pipeline, step by step with pitfalls.
- [Trade-offs](trade-offs.md) — why the dependency set, paths, and defaults look like this.
- [Explainers](explainers/) — the implementation, line by line.
