# Trade-offs

Every non-obvious decision in this repository, the alternatives that were considered, and the
cost each choice carries.

## 1. Default to the public test phrase, not a generated one

**Chosen:** `npm run derive` with no arguments derives from the canonical BIP-39 test phrase
(`abandon … about`).

**Alternatives:** generate a fresh random phrase per run; require `--mnemonic`; read from
stdin only.

**Why:** a demo that prints a fresh *real* phrase trains exactly the wrong habit — users paste
it somewhere, or worse, fund it. A public phrase with published addresses makes the default
run safe, reproducible, and comparable against every other wallet's test suite. Personal
phrases arrive through `--mnemonic` or `METAMASK_MNEMONIC`, with the environment variable
preferred so the phrase stays out of shell history and process listings.

**Cost:** the default output is "boring" test addresses; the interesting personal case needs
one flag. Worth it.

## 2. `@noble`/`@scure` primitives instead of a wallet framework

**Chosen:** `@noble/hashes`, `@noble/curves`, `@scure/base`, `@scure/bip32`, `@scure/bip39`.

**Alternatives:** `ethers` (EVM-native, heavyweight for this); `bitcoinjs-lib` (Bitcoin-only);
`tronweb` (huge, network-oriented); hand-rolled crypto.

**Why:** the demo needs five primitives — PBKDF2, HMAC-SHA512, keccak, HASH160, secp256k1,
ed25519, base58/bech32 — and no framework. The noble/scure set is audited, zero-dependency,
tree-shakeable, and provides exactly those primitives with no network or wallet semantics
attached. Hand-rolling is disqualified on principle: cryptographic code without an audit trail
is a liability, not a learning aid.

**Cost:** the demo assembles address encodings itself (four small functions) instead of calling
`wallet.address`. That assembly is precisely the part worth showing.

## 3. Implement SLIP-0010 in-repo

**Chosen:** ~100 lines in `src/slip10.ts`, pinned to the specification's eight ed25519 vectors.

**Alternatives:** `ed25519-hd-key` (older, CJS-era); `micro-key-producer` (same author as
noble); restricting the demo to secp256k1 chains only.

**Why:** SLIP-0010's ed25519 path is a single HMAC-SHA512 loop with one restriction (hardened
only) — small enough to read in one sitting, and the specification ships vectors, so
correctness is provable rather than trusted. It is also the single best teaching artifact in
the repository: it explains *why* Solana paths end in `0'/0'`. A dependency would hide the
one algorithm the audience most needs to see.

**Cost:** one more thing to maintain; mitigated by the vectors and the differential
cross-check against `ed25519-hd-key`.

## 4. Run TypeScript directly with `tsx`, no build step

**Chosen:** `npm run derive` → `tsx src/cli.ts`; `tsc --noEmit` for checking.

**Alternatives:** compile to `dist/` and ship a Node binary; use plain JavaScript; use Bun/Deno.

**Why:** the repository is a teaching artifact and a content source; a build step adds output
directories, source maps, and "did you rebuild?" failure modes without adding a single
capability. `tsx` executes the same files readers open, so code and docs can never drift.
`tsc --noEmit` still enforces full strictness in CI.

**Cost:** consumers cannot `import` a compiled artifact. If this were a library, the trade-off
would flip.

## 5. One EVM account for nine networks

**Chosen:** derive a single secp256k1 account at `m/44'/60'/0'/0/0` and label it with all nine
EVM networks.

**Alternatives:** derive one account per EVM chain (e.g. `m/44'/60'/0'/0/0` for Ethereum,
`m/44'/137'/0'/0/0` for Polygon, …).

**Why:** MetaMask itself uses one account across EVM networks, and that is the whole point of
the "12 networks, 4 accounts" story. Deriving per-chain accounts would also be *wrong* for how
users actually hold EVM assets: the same address on every chain is the norm.

**Cost:** the demo must explain that identical addresses do not mean shared balances; the docs
and content do exactly that.

## 6. Bitcoin native SegWit (BIP-84), not legacy or Taproot

**Chosen:** `m/84'/0'/0'/0/0` → `bc1q…`.

**Alternatives:** legacy `m/44'/0'/0'/0/0` → `1…`; Taproot `m/86'/0'/0'/0/0` → `bc1p…`.

**Why:** BIP-84 matches what modern wallets, including MetaMask's Bitcoin accounts, present by
default, and it is the path with an official test vector that ties this repository to the
specification. Legacy is deprecated for new accounts; Taproot adoption in wallets is still
uneven.

**Cost:** a user whose Bitcoin sits on a legacy address derives a different (empty-looking)
address. The guide's pitfalls section calls this out explicitly.

## 7. TRON at coin type `195'`

**Chosen:** `m/44'/195'/0'/0/0`.

**Alternatives:** `m/44'/60'/0'/0/0` (some TRON wallets reused Ethereum's coin type).

**Why:** `195'` is TRON's registered SLIP-44 coin type and the convention followed by
TronLink-era wallets and MetaMask's native TRON accounts. The `60'` reuse exists in the wild
and is a compatibility trap worth documenting rather than adopting.

**Cost:** older TRON wallets using `60'` show different addresses for the same seed; this is a
property of those wallets, not a defect here.

## 8. Private keys hidden by default

**Chosen:** `npm run derive` prints addresses only; `--show-private-keys` adds them with a
warning on stderr.

**Alternatives:** always print; never print; print only in JSON.

**Why:** the CLI is run in terminals that record scrollback, in CI logs, and on screen shares.
Private keys are the highest-value secret the tool can emit; making them opt-in keeps the
default safe while preserving the educational value (and the ability to compare against a
wallet's export).

**Cost:** one extra flag for the full picture.

## 9. Vectors, not personal addresses, in the repository

**Chosen:** every address in code, tests, docs, and content comes from the public test phrase.

**Alternatives:** use the author's real addresses as the running example (more "authentic").

**Why:** publishing a personal wallet's addresses in a public repository links an on-chain
identity to a content persona forever. The test phrase is reproducible by every reader, which
is more useful for verification anyway.

**Cost:** the narrative loses a little specificity; the derivation story is identical.

## 10. Read-only by design

**Chosen:** the demo derives and prints; it cannot sign, broadcast, or query balances.

**Alternatives:** add a balance check (needs RPC), a signing example (needs transaction
construction), a MetaMask-import file (needs wallet-specific formats).

**Why:** every added capability widens the security surface and the dependency set while
diluting the one lesson. Derivation is the part of a wallet that is standards-defined and
portable; everything above it is product-specific.

**Cost:** "show me the funds" demos are out of scope; the content explains balances with a
diagram instead.
