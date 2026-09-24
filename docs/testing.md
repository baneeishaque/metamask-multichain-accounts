# Testing

## Strategy

The test suite exists to answer one question: **does this implementation reproduce the
published standards?** It answers it by pinning itself to primary sources — the BIP-39,
BIP-84, and SLIP-0010 specifications and ERC-55 — rather than to recorded output of this
code. If a refactor changed a derivation result, every affected test would fail against a
specification document, not against a golden file.

Three layers:

1. **Specification vectors** — seeds, chain codes, private keys, addresses, and checksums
   copied from the standards themselves.
2. **Structural assertions** — the branch table (chain, path, curve), the 9-EVM/12-network
   counts, key lengths, JSON shape.
3. **Error paths** — invalid mnemonics, broken checksums, non-hardened SLIP-0010 segments,
   malformed paths.

## What each file pins

| Test file                  | Pins                                                                       | Source of truth                     |
| -------------------------- | -------------------------------------------------------------------------- | ----------------------------------- |
| `test/slip10.test.ts`      | 8 ed25519 derivation vectors (chain code + private key), path parsing rules | SLIP-0010 specification             |
| `test/addresses.test.ts`   | 4 EIP-55 checksum vectors; the 4 address encodings for the test phrase      | ERC-55; BIP-84; canonical fixtures  |
| `test/derive.test.ts`      | BIP-39 seeds (with and without passphrase), branch table, counts, errors    | BIP-39 specification                |
| `test/report.test.ts`      | Human table contents, private-key default-off, JSON shape                   | This repository's contract          |

Highlights:

- `test/slip10.test.ts` covers both official SLIP-0010 ed25519 seed sets, including the
  six-level `m/0'/1'/2'/2'/1000000000'` walk.
- `test/addresses.test.ts` uses the official BIP-84 vector
  (`bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu`) and the canonical EIP-55 mixed-case cases.
- `test/derive.test.ts` checks that adding a passphrase changes *every* account — the property
  that makes the "25th word" a real second factor.

## Differential cross-checks (construction time)

Before the vectors were pinned, each result was reproduced with at least one independent
implementation, so the suite does not merely agree with itself:

| Result                | Independent check                                                      |
| --------------------- | ---------------------------------------------------------------------- |
| BIP-39 seed           | Node.js `crypto.pbkdf2Sync` (raw PBKDF2, no library)                   |
| EVM address           | `ethers` `HDNodeWallet.fromPhrase(…, "m/44'/60'/0'/0/0")`               |
| Solana address        | `ed25519-hd-key` derivation + Node.js native ed25519 public-key export |
| TRON address          | `tronweb` `TronWeb.fromMnemonic(…, "m/44'/195'/0'/0/0")`                |
| Bitcoin address       | BIP-84 specification test vector (no library needed)                   |

All five agreed. The cross-check tooling was intentionally **not** committed: adding `ethers`,
`tronweb`, and `ed25519-hd-key` as dev-dependencies to re-verify constants that are already
specification-pinned would triple the dependency surface for no additional guarantee.

## Running the suite

```bash
npm install
npm run test         # vitest run — 36 tests across 4 files
npm run typecheck    # tsc --noEmit (strict, noUncheckedIndexedAccess)
npm run verify       # typecheck + tests + prettier --check + markdownlint
```

## CI

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs `npm run verify` on
`ubuntu-latest` with Node 24 on every push to `main`, every pull request, and on demand. The
demo is platform-independent by construction (pure JavaScript crypto, no native modules), so a
single Linux runner is a complete matrix.

## What is intentionally not tested

- **Live wallet equivalence** — asserting that MetaMask shows the same addresses would require
  driving a browser and a wallet build; the standards are the contract instead.
- **Network behavior** — there is no network code to test.
- **Randomness quality** — the demo never generates entropy; it consumes a phrase.
- **Property-based fuzzing** — the input space that matters (specification vectors) is
  enumerated exactly; fuzzing would test `@scure` libraries, not this repository.
