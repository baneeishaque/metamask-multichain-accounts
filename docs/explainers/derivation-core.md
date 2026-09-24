# `src/derive.ts`, `src/report.ts`, `src/cli.ts` — the derivation core and its surface

The cryptographic primitives live in `slip10.ts` and `address.ts`; everything else is
orchestration, presentation, and argument handling. This explainer walks the three remaining
modules in dependency order.

## `src/derive.ts` — the branch table and the one public function

### Types

`Curve` (`src/derive.ts:33`) is a two-member union, not a string, so a typo in a chain
specification fails at compile time. `ChainAccount` (`src/derive.ts:36`) is the public shape
returned to callers — chain id, display name, network list, curve, path, address, and the
private key as hex.

`ChainSpec` (`src/derive.ts:54`) is the internal shape: the same fields, except `address` is a
*factory* taking a private key. Keeping the factory in the table is what makes `deriveAccounts`
a two-line loop over otherwise-identical branches.

### The tables

`EVM_NETWORKS` (`src/derive.ts:71`) lists the nine EVM chains a MetaMask multichain account
exposes — Ethereum, Linea, Base, Arbitrum One, BNB Chain, OP Mainnet, Polygon, Monad, Arc.
They are listed on the EVM account because they share its single key.

`CHAINS` (`src/derive.ts:84`) is the single source of truth for the four branches:

```ts
{ chain: "evm",     curve: "secp256k1", path: "m/44'/60'/0'/0/0",  address: toEvmAddress },
{ chain: "bitcoin", curve: "secp256k1", path: "m/84'/0'/0'/0/0",   address: toBitcoinNativeSegwitAddress },
{ chain: "solana",  curve: "ed25519",   path: "m/44'/501'/0'/0'",  address: toSolanaAddress },
{ chain: "tron",    curve: "secp256k1", path: "m/44'/195'/0'/0/0", address: toTronAddress },
```

Every value in that table is asserted in `test/derive.test.ts`; changing a path here without
changing the test is impossible to do silently.

`NETWORK_COUNT` (`src/derive.ts:120`) computes `9 + 3` from the table itself rather than
hardcoding 12, so adding a network updates the footer everywhere at once.

### The derivation function

`normalizeMnemonic` (`src/derive.ts:123`) collapses arbitrary whitespace to single spaces
before validation — users paste phrases with line breaks and double spaces, and BIP-39 is
defined over the word sequence, not the exact spacing.

`deriveAccounts` (`src/derive.ts:135`) is the whole pipeline:

```ts
const phrase = normalizeMnemonic(mnemonic);
if (!validateMnemonic(phrase, wordlist)) {
  throw new Error("invalid BIP-39 mnemonic (expected English words and a valid checksum)");
}
const seed = mnemonicToSeedSync(phrase, passphrase);
const secpRoot = HDKey.fromMasterSeed(seed);
```

Then one `map` over `CHAINS` picks the branch's derivation strategy by curve: ed25519 goes
through `derivePath(seed, spec.path)` (SLIP-0010), secp256k1 through
`secpRoot.derive(spec.path)` (BIP-32). A null private key — impossible in practice, but the
`@scure` types allow it — throws rather than propagating a `null`.

`seedFromMnemonic` (`src/derive.ts:171`) is exported separately so the test suite can pin the
official BIP-39 seed vectors without touching the chain table.

## `src/report.ts` — two renderings, no business logic

`ReportOptions` (`src/report.ts:11`) has one field: `showPrivateKeys`. Everything about *what*
an account is lives in `derive.ts`; this module only decides how it looks.

`renderAccount` (`src/report.ts:23`) builds the aligned block. `NAME_WIDTH` and `PATH_WIDTH`
(`src/report.ts:17`, `:20`) are constants because pad widths are presentation policy, and the
private-key line is appended only when the caller opted in.

`renderAccounts` (`src/report.ts:41`) flattens the blocks with a blank line between accounts
and closes with the project's one-sentence thesis:

```ts
lines.push(
  `${NETWORK_COUNT} networks → ${accounts.length} accounts → ${accounts.length} keys ` +
    "from 1 recovery phrase.",
);
```

`renderAccountsJson` (`src/report.ts:60`) re-maps the accounts instead of serializing them
directly, because the private key must be *omitted*, not blanked, when not requested:

```ts
...(options.showPrivateKeys ? { privateKey: account.privateKey } : {}),
```

A conditional spread keeps the JSON key absent by default — a consumer can treat the presence
of `privateKey` as an explicit signal.

## `src/cli.ts` — argument handling with safe defaults

`CliOptions` (`src/cli.ts:15`) extends `ReportOptions` with the mnemonic, passphrase, JSON
flag, and one subtle field: `explicitMnemonic`, which distinguishes "user supplied a phrase"
from "we defaulted to the public test phrase". That flag drives the note printed to stderr, so
a user who forgot to pass their phrase is told which phrase was used.

`USAGE` (`src/cli.ts:22`) is a template literal, so help text and code live together.
`messageOf` (`src/cli.ts:39`) narrows `unknown` catch values to a message.

`parseArgs` (`src/cli.ts:50`) is a small hand-written parser (the surface is five flags; a
dependency would be larger than the code it replaces). It reads `METAMASK_MNEMONIC` first —
the environment variable is preferred over `--mnemonic` so phrases stay out of shell history
and process listings. The `takeValue` closure (`src/cli.ts:66`) supports both
`--mnemonic value` and `--mnemonic=value` with one code path and throws on a missing value.

`main` (`src/cli.ts:102`) sequences the four behaviors:

1. Parse, or print usage and return `1` on bad input.
2. Derive, catching invalid-mnemonic errors and returning `1` without a stack trace.
3. JSON mode prints and returns; human mode prints the note/warning to **stderr** and the
   table to **stdout**, so piping stdout into another tool never mixes in warnings.
4. `process.exitCode = main()` at the bottom keeps the exit path testable and explicit.

The separation matters for the content kit: the same `deriveAccounts` function that powers the
CLI also powers the screenshots, the video's "results" scene, and any reader's own
verification, so the demo and the documentation cannot disagree.

## The full call graph

```text
npm run derive
      │
      ▼
  src/cli.ts  parseArgs ──▶ deriveAccounts ──▶ CHAINS.map
                                                   │
                        ┌──────────────────────────┴────────────────────┐
                        ▼                                               ▼
             slip10.derivePath (ed25519)                   @scure/bip32 (secp256k1)
                        │                                               │
                        └──────────────────┬────────────────────────────┘
                                           ▼
                                  address.ts encoders
                                           │
                                           ▼
                                    report.ts rendering
```
