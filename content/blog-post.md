# One recovery phrase, twelve networks, four accounts

**How MetaMask multichain accounts actually work — and why your Bitcoin, Solana, and TRON keys
have no export button.**

I created a fresh MetaMask account and the wallet handed me twelve networks: Ethereum, Linea,
Base, Arbitrum, BNB Chain, OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana, and TRON. One
recovery phrase. One backup. But when I opened the account details, only the EVM account had a
private key I could copy. Bitcoin, Solana, and TRON showed an address and nothing else.

That looked like a gap. It is not. It is the most interesting design decision in the wallet,
and understanding it takes one sentence and about ten minutes of derivation.

**Twelve networks collapse into four accounts because a wallet derives four keys from one
seed — one key family per curve and path, not one key per network.** The nine EVM networks
share a single key because EVM address derivation never asks which chain it is on.

Here is the whole pipeline, and how to verify every step of it yourself.

## A phrase is not a key

The twelve words on the paper backup are not a private key. They are an encoding of 128 bits
of entropy with a checksum, and the first thing a wallet does with them is stretch them into a
64-byte seed using BIP-39:

```text
seed = PBKDF2-HMAC-SHA512(phrase, salt = "mnemonic" + passphrase, 2048 rounds, 64 bytes)
```

Two things about this step deserve attention. First, the seed is what every account in the
wallet is derived from; the phrase is just the portable form of it. Second, there is an
optional passphrase — the "25th word" — that changes the salt. The same phrase with and
without it produces two completely different wallets. Lose the passphrase and the phrase alone
restores empty accounts. It is the most common way people lose funds they technically still
have.

## Two trees from one seed

The seed is not used directly as a key either. Each curve family grows its own tree from it,
and the trees are independent by construction.

For secp256k1 — the curve behind Bitcoin, Ethereum, and TRON — the wallet uses BIP-32: an
HMAC-SHA512 with the string `"Bitcoin seed"` produces a master key and a chain code, and child
keys are derived by walking a path, adding a hash of the parent to the parent key using the
curve's group operation.

For ed25519 — the curve behind Solana — that operation does not exist. ed25519 private keys
are seeds for a hash, not scalars on a curve, so BIP-32's arithmetic simply does not apply.
SLIP-0010 solves this by removing the half of BIP-32 that needs arithmetic: a child key is an
HMAC of the parent's chain code and private key, with no public-key equivalent. The cost is
that ed25519 supports *hardened derivation only*, which is why Solana paths end in `0'/0'` —
the apostrophes are mandatory, not stylistic.

So one 64-byte seed becomes two roots: a secp256k1 root and an ed25519 root. Everything after
this is just path selection.

## Four paths, four keys

A derivation path is a set of instructions: which account, which coin type, which index. MetaMask's
four branches follow the BIP-44 convention (plus BIP-84 for Bitcoin):

| Account          | Curve     | Path                |
| ---------------- | --------- | ------------------- |
| EVM              | secp256k1 | `m/44'/60'/0'/0/0`  |
| Bitcoin (SegWit) | secp256k1 | `m/84'/0'/0'/0/0`   |
| Solana           | ed25519   | `m/44'/501'/0'/0'`  |
| TRON             | secp256k1 | `m/44'/195'/0'/0/0` |

Read the segments and the design explains itself. `44'` is the BIP-44 purpose; `60'` is
Ethereum's registered coin type, `501'` is Solana's, `195'` is TRON's. Bitcoin uses `84'`
because that purpose value is what marks native SegWit addresses — the same seed at `44'`
would produce an old-style `1…` address, and at `86'` a Taproot `bc1p…` address.

Different path, different key. Same seed, same wallet, four keys.

## Four ways to write an address

A key becomes an address through one more transformation per chain, and the four
transformations are genuinely different:

- **EVM:** hash the uncompressed public key with keccak-256, keep the last 20 bytes, render as
  hex with a mixed-case checksum (EIP-55).
- **Bitcoin:** hash the *compressed* public key with HASH160, wrap it in a bech32 witness
  program — that is what the `bc1q…` prefix is.
- **Solana:** base58-encode the 32-byte ed25519 public key. No hash, no checksum — the public
  key *is* the address.
- **TRON:** take the same 20 keccak bytes the EVM address uses, prefix them with the single
  byte `0x41`, and base58check-encode the result. That version byte is why every TRON address
  starts with `T`.

That third bullet hides a fun detail: an EVM address and a TRON address for the same key are
the same twenty bytes wearing different clothes. The TRON account `TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH`
is the base58check rendering of the same body you would see as `0xC8599111F29c1e1E061265b4AF93eA1F274aD78A`
in hex.

## Why nine networks share one account

Here is the part that surprises people most: the EVM branch is not "the Ethereum account". It
is the account for Ethereum, Linea, Base, Arbitrum, BNB Chain, OP Mainnet, Polygon, Monad, and
Arc at once, because address derivation is a function of the key alone. No chain ID, no network
name, no RPC endpoint participates. Same key, same address, on every EVM chain, forever.

What does *not* collapse is everything above the key. Each chain keeps its own ledger, its own
balances, and its own gas token. Holding ETH on Ethereum does not pay fees on BNB Chain, where
you need BNB, or on Polygon, where you need POL. A token on Linea is invisible on Base. One
address, nine separate financial states — which is why the wallet groups them under one account
but still shows a per-network balance.

## The three secrets people confuse

Most confusion around wallets comes from treating three different things as one:

1. **The MetaMask password** protects the local vault file. It never leaves the device, it is
   not part of any derivation, and it cannot restore anything. Two devices, two passwords, same
   accounts.
2. **The recovery phrase** is the seed's portable form. It restores every account on every
   network, which makes it the single point of failure for everything.
3. **A private key** controls exactly one branch. Leak the EVM key and the attacker gets your
   nine EVM networks — but not your Bitcoin, Solana, or TRON, which live on different keys.
   Leak the phrase and all four branches fall at once.

This is also why the "where is my BTC private key?" question has a slightly Zen answer: you
already have it — it is the phrase. The wallet derives the key when it needs it. What the UI
does not offer, at the time of writing, is an export button for it.

## Why there is no export button

MetaMask stores the phrase in an encrypted vault and hands it to keyrings, one per key family.
The original EVM keyring predates the multichain era and exposes its private key in the UI.
The Bitcoin, Solana, and TRON keyrings arrived later, alongside native support that moved these
networks out of community Snaps and into the wallet itself — Solana and Bitcoin first, TRON in
January 2026, in an integration with the TRON DAO. Those newer keyrings do not expose their
private keys through the UI yet.

Is that a problem? For backup purposes, no: the phrase reconstructs every branch, so the
backup story is complete. For interoperability — moving a Bitcoin key into another wallet —
it is a real limitation, and it is why "export your keys" is not the universal escape hatch it
is often described as. The standards-based answer is that any wallet implementing BIP-39 and
the same paths will show the same four accounts. That is the property worth testing.

## Verify it yourself

You do not have to take any of this on faith, and you should not. The derivation is fully
specified by public standards — BIP-39, BIP-32, BIP-84, SLIP-0010, EIP-55 — and a few hundred
lines of TypeScript can reproduce it. I wrote that reproduction as a small open-source demo,
using only audited cryptographic primitives and pinned against the official specification
vectors:

```bash
git clone https://github.com/baneeishaque-ompventure/metamask-multichain-accounts
cd metamask-multichain-accounts
npm install
npm run derive
```

It runs on a public BIP-39 test phrase by default — the famous `abandon abandon … about`,
which has never held funds — and prints all four accounts:

```text
  EVM account             m/44'/60'/0'/0/0    0x9858EfFD232B4033E47d90003D41EC34EcaEda94
  Bitcoin (native SegWit) m/84'/0'/0'/0/0     bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu
  Solana                  m/44'/501'/0'/0'    HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk
  TRON                    m/44'/195'/0'/0/0   TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH

12 networks → 4 accounts → 4 keys from 1 recovery phrase.
```

Import the same public phrase into a fresh wallet and the addresses match — because both
sides implement the same standards. (Do not fund it: the phrase is public, so anyone can spend
anything sent there.)

Then run it with your own phrase — `npm run derive -- --mnemonic "your words"` — and compare
against your wallet. If the four addresses line up, you have verified, end to end, that your
backup is the only secret that matters and that you understand exactly what it controls.

## What to take away

One seed. Two curves. Four paths. Twelve networks. The wallet is not keeping secrets from you
when it declines to show a Bitcoin private key; it is hiding an implementation detail that the
phrase already contains. What deserves your attention instead is the blast radius: the phrase
is the single key to all of it, the password is a local convenience, and the four branches fail
independently only until someone gets the words on your paper.

*The demo, the full derivation guide, and the line-by-line explainers live at
[github.com/baneeishaque-ompventure/metamask-multichain-accounts](https://github.com/baneeishaque-ompventure/metamask-multichain-accounts).*
