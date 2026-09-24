# metamask-multichain-accounts

One recovery phrase. Twelve networks. Four accounts. This repository is the runnable demo,
the documentation, and the complete content kit behind that sentence.

```bash
npm install
npm run derive
```

```text
  EVM account             m/44'/60'/0'/0/0    0x9858EfFD232B4033E47d90003D41EC34EcaEda94
    secp256k1 · Ethereum, Linea, Base, Arbitrum One, BNB Chain, OP Mainnet, Polygon, Monad, Arc

  Bitcoin (native SegWit) m/84'/0'/0'/0/0     bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu
    secp256k1 · Bitcoin

  Solana                  m/44'/501'/0'/0'    HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk
    ed25519 · Solana

  TRON                    m/44'/195'/0'/0/0   TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH
    secp256k1 · TRON

12 networks → 4 accounts → 4 keys from 1 recovery phrase.
```

## Why this exists

MetaMask's multichain accounts put Ethereum, Linea, Base, Arbitrum, BNB Chain, OP Mainnet,
Polygon, Monad, Arc, Bitcoin, Solana, and TRON behind a single recovery phrase. That raises an
obvious question the wallet UI does not answer: *are these twelve accounts, or one account on
twelve networks?*

The answer is neither. One BIP-39 phrase produces one 64-byte seed, and that seed is walked
down four independent derivation branches — one per key family — yielding four private keys and
four addresses. The nine EVM networks share a single secp256k1 key because EVM address
derivation never involves a chain ID; Bitcoin, Solana, and TRON each get their own branch, two
of them still on secp256k1 but at different BIP-44 paths, and one on ed25519.

This repository derives those four accounts from a public BIP-39 test phrase, in about 300
lines of TypeScript, against the official BIP-39 / BIP-84 / SLIP-0010 / EIP-55 test vectors —
and documents every step, decision, and caveat.

## Features

- **Four chains, one phrase** — EVM (9 networks), Bitcoin native SegWit, Solana, and TRON
  derived in a single deterministic pass.
- **Official test vectors, pinned** — BIP-39 seed vectors, the BIP-84 Bitcoin vector, the
  SLIP-0010 ed25519 vectors, and the EIP-55 checksum vectors, all enforced by the test suite.
- **Differential verification** — during construction, every address was cross-checked against
  independent implementations (`ethers`, `tronweb`, `ed25519-hd-key`, Node's native ed25519).
- **Safe by default** — the demo runs on a public test phrase, never sends anything over the
  network, and hides private keys unless explicitly asked.
- **Zero hand-rolled cryptography** — audited `@noble` / `@scure` primitives only; the one
  in-repo algorithm (SLIP-0010 ed25519) is ~100 lines pinned to the specification's vectors.

## Quickstart

Requires Node.js 20 or newer.

```bash
git clone https://github.com/baneeishaque-ompventure/metamask-multichain-accounts
cd metamask-multichain-accounts
npm install
npm run derive
```

A bare `npm run derive` uses the public BIP-39 test phrase (`abandon … about`), which has
never held funds. To derive your own phrase, pass it explicitly:

```bash
npm run derive -- --mnemonic "your twelve or twenty-four words"
METAMASK_MNEMONIC="your words" npm run derive        # same thing, out of shell history
npm run derive -- --passphrase "25th word"           # BIP-39 passphrase
npm run derive -- --show-private-keys                # include private keys (with a warning)
npm run derive -- --json                             # machine-readable output
```

The phrase never leaves the process: no network calls, no logs, no telemetry.

## How it works

```text
recovery phrase ──▶ BIP-39 (PBKDF2-SHA512) ──▶ 64-byte seed
                                                   │
                    ┌──────────────────────────────┴──────────────────────────────┐
                    │                                                             │
        BIP-32 secp256k1 root                                   SLIP-0010 ed25519 root
                    │                                                             │
      ┌─────────────┼─────────────┐                                               │
   m/44'/60'    m/84'/0'     m/44'/195'                                        m/44'/501'
      │             │             │                                               │
   EVM address  bc1q address  T… address                                    base58 address
```

1. **Phrase → seed** — BIP-39: PBKDF2-HMAC-SHA512 over the NFKD-normalized phrase, 2048
   iterations, salt `"mnemonic"` plus the optional passphrase.
2. **Seed → roots** — two master keys from the same seed: BIP-32 (`HMAC-SHA512("Bitcoin
   seed")`) for secp256k1, SLIP-0010 (`HMAC-SHA512("ed25519 seed")`) for ed25519.
3. **Roots → four keys** — one path per branch, exactly as MetaMask derives them.
4. **Keys → addresses** — four encodings: EIP-55 hex, bech32 (native SegWit), base58, and
   base58check with TRON's `0x41` prefix.

Every step is documented line by line under [`docs/explainers/`](docs/explainers/).

## The four branches

| Account             | Curve     | Path                | Address encoding                    | Networks                     |
| ------------------- | --------- | ------------------- | ----------------------------------- | ---------------------------- |
| EVM                 | secp256k1 | `m/44'/60'/0'/0/0`  | `keccak256(pubkey)[12:]` + EIP-55   | Ethereum, Linea, Base, … (9) |
| Bitcoin (SegWit)    | secp256k1 | `m/84'/0'/0'/0/0`   | bech32 over `HASH160(pubkey)`       | Bitcoin                      |
| Solana              | ed25519   | `m/44'/501'/0'/0'`  | base58 of the 32-byte public key    | Solana                       |
| TRON                | secp256k1 | `m/44'/195'/0'/0/0` | base58check over `0x41 \|\| body`   | TRON                         |

The nine EVM networks collapse to one account because the address is a function of the key
alone — same key, same address, everywhere. Balances and state do **not** collapse: each chain
keeps its own ledger, and each needs its own gas token.

## Verifying against MetaMask

MetaMask's multichain accounts derive from the same standards this demo implements. Import the
public test phrase into a fresh MetaMask profile and it will show the same four addresses
(feature availability varies by build). Do not send funds to it: the phrase is public, so
anything sent there is spendable by anyone. For your own phrase, the safe check is the reverse
one — compare this demo's output for your phrase against what your wallet shows.

## Tests

```bash
npm run test        # 36 unit tests: official vectors, structure, error paths
npm run typecheck   # strict TypeScript, no emit
npm run verify      # typecheck + tests + Prettier check + Markdown lint
```

The suite pins itself to primary sources — the BIP-39, BIP-84, and SLIP-0010 specifications
and ERC-55 — rather than to this implementation's own output. See
[`docs/testing.md`](docs/testing.md) for the vector table and the differential cross-checks.

## Repository layout

| Path                      | Contents                                                            |
| ------------------------- | ------------------------------------------------------------------- |
| `src/slip10.ts`           | SLIP-0010 ed25519 derivation (the one in-repo algorithm).           |
| `src/address.ts`          | The four address encodings (EIP-55, bech32, base58, base58check).   |
| `src/derive.ts`           | Branch table + `deriveAccounts` orchestration.                      |
| `src/report.ts`           | Human table and JSON rendering.                                     |
| `src/cli.ts`              | The `npm run derive` entry point.                                   |
| `src/vectors.ts`          | Public test vectors shared by the demo and the tests.               |
| `docs/`                   | Architecture, derivation guide, testing, trade-offs, explainers.    |
| `content/`                | The complete content-marketing kit for this project.                |
| `content/youtube/`        | Video pipeline: 37 subtitle languages, 20 narration tracks.         |
| `webinar/`                | The detailed webinar plan (slides, demo script, Q&A bank).          |

## Content kit

The [`content/`](content/) directory ships everything used to present this project: the
canonical blog post, the Medium adaptation, LinkedIn / X / Facebook / WhatsApp / Instagram /
Snapchat / Reels copy, and a YouTube pipeline that renders, narrates, and subtitles the
walkthrough in 37 locales. See [`content/README.md`](content/README.md) for the asset map and
[`content/youtube/README.md`](content/youtube/README.md) for the video pipeline.

## Security notes

- A recovery phrase (SRP) is the single point of failure for **every** account and network
  derived from it. A single leaked phrase drains all four branches at once; a leaked private
  key drains only its own branch.
- The MetaMask password protects the local vault only. It is not part of key derivation, it
  never leaves the device, and it cannot restore anything — only the phrase can.
- This demo is read-only: it derives and prints. It cannot sign transactions, connect to RPC
  endpoints, or move funds.
- Never paste a funded recovery phrase into any online tool, including this one. Run it
  locally, or use the public test phrase.

## Requirements

- Node.js 20 or newer (CI runs Node 24)
- No accounts, no API keys, no network access at runtime

## License

[MIT](LICENSE) © 2026 Banee Ishaque K
