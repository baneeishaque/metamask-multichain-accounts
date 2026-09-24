# Medium adaptation

Medium-specific metadata first, then the article body. The body is a genuine adaptation of the
canonical [blog post](blog-post.md) — different structure, tighter sections, same facts — so
the two can coexist without duplicate-content penalties. Publish the blog post first and point
Medium's canonical link at it.

***

## Metadata

- **Title:** One recovery phrase, twelve networks, four accounts
- **Subtitle:** How MetaMask multichain accounts actually work — and why your Bitcoin, Solana,
  and TRON keys have no export button
- **Tags:** Web3, MetaMask, Cryptocurrency, Software Engineering, Blockchain
- **Canonical link:** `https://<community-blog>/metamask-multichain-accounts` (replace with the
  published blog-post URL)
- **Cover image:** a screenshot of `npm run derive` output (the four-account table) on a dark
  terminal background. Alt text: "Terminal output showing four accounts — EVM, Bitcoin, Solana,
  TRON — derived from one recovery phrase."

***

## Body

Your wallet is hiding something from you. Not maliciously, and not even a secret — an
implementation detail it never found a good place to display.

Here it is: **one MetaMask recovery phrase produces four keys, not twelve.** The wallet shows
you twelve networks, so the arithmetic feels wrong. Ethereum, Linea, Base, Arbitrum, BNB Chain,
OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana, TRON — that is twelve names and four
addresses. The nine EVM names share one address, and the reason is more interesting than the
count.

### The four branches

| Account          | Curve     | Path                | Address starts with |
| ---------------- | --------- | ------------------- | ------------------- |
| EVM              | secp256k1 | `m/44'/60'/0'/0/0`  | `0x`                |
| Bitcoin (SegWit) | secp256k1 | `m/84'/0'/0'/0/0`   | `bc1q`              |
| Solana           | ed25519   | `m/44'/501'/0'/0'`  | (base58)            |
| TRON             | secp256k1 | `m/44'/195'/0'/0/0` | `T`                 |

Each row is a branch of one derivation tree grown from one seed. The seed comes from the
twelve words on your backup via BIP-39 — PBKDF2-HMAC-SHA512, 2048 rounds, with an optional
passphrase mixed into the salt. If you have ever lost access to funds while holding the correct
phrase, the passphrase is the first suspect: same words without it derive a completely
different wallet.

### Why Solana gets its own tree

The four branches split into two trees because of a property of curves that rarely makes it
into wallet documentation.

BIP-32 derives child keys by adding a hash of the parent to the parent key — an operation on
the secp256k1 curve. Bitcoin, Ethereum, and TRON keys all live on secp256k1, so one tree serves
them all. Solana keys live on ed25519, whose private keys are hash seeds rather than curve
scalars. The addition simply does not exist there.

SLIP-0010 is the standard that patches this by removing the offending half of BIP-32. A child
key becomes an HMAC of the parent's chain code and **private** key. That works everywhere — but
it means there is no public-key derivation on ed25519. No xpubs, no watch-only accounts, and a
visible fingerprint in every Solana path: `m/44'/501'/0'/0'`. Those apostrophes are hardened
derivation markers, and on Solana they are not optional. `m/44'/501'/0'/0/0` is not a path any
wallet will accept.

### The same twenty bytes, twice

Addresses add one more layer of difference. Each branch encodes its key its own way:

- **EVM** — keccak-256 of the uncompressed public key, last 20 bytes, hex with the EIP-55
  mixed-case checksum.
- **Bitcoin** — HASH160 of the *compressed* key inside a bech32 witness program.
- **Solana** — the raw 32-byte public key in base58. No hash, no checksum.
- **TRON** — the same 20 keccak bytes as EVM, prefixed with `0x41`, base58check-encoded.

That last row means an EVM address and a TRON address are the same account wearing different
clothes. `TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH` and
`0xC8599111F29c1e1E061265b4AF93eA1F274aD78A` are two renderings of one key. The `0x41` version
byte is the entire reason every TRON address starts with `T`.

### One key, nine ledgers

The EVM branch serves nine networks because address derivation never asks which chain it is on.
No chain ID, no network name, no RPC endpoint participates in turning a key into an address.
Same key, same `0x…` string, on all nine networks, forever.

What does not collapse is the state above the key. Nine networks, nine ledgers, nine gas
tokens. ETH pays fees on Ethereum, Linea, Base, Arbitrum, and OP Mainnet; BNB on BNB Chain; POL
on Polygon; MON on Monad. A balance on one chain is invisible on the next. The wallet groups
them under one account because the key is one; the balances stay stubbornly separate.

### The three secrets

Most wallet confusion dissolves once you keep three things apart:

1. **The password** decrypts the local vault. It never leaves the device, never touches
   derivation, and cannot restore anything.
2. **The recovery phrase** restores all four branches. It is the single point of failure for
   everything you own.
3. **A private key** controls exactly one branch — nine EVM networks, or Bitcoin, or Solana, or
   TRON. Leaking one key exposes one branch; leaking the phrase exposes all four.

So when MetaMask shows an address for Bitcoin, Solana, and TRON but no export button, nothing
is missing. The key is derived on demand from the phrase you already hold. The limitation is
about interoperability — moving a single key into another wallet — not about backup. The
standards-based backup is, and remains, the phrase.

### Verify it yourself

The derivation is fully specified by public standards: BIP-39, BIP-32, BIP-84, SLIP-0010, and
ERC-55. I rebuilt it as a small TypeScript demo — about 300 lines, audited cryptographic
primitives only, every result pinned against the official specification vectors:

```bash
git clone https://github.com/baneeishaque-ompventure/metamask-multichain-accounts
cd metamask-multichain-accounts && npm install && npm run derive
```

The default run uses the public `abandon abandon … about` test phrase (never funded — do not
send anything to it) and prints all four accounts. Then run it against your own phrase with
`npm run derive -- --mnemonic "your words"` and compare with your wallet. When the four
addresses match, you have verified end to end that your backup controls exactly what you think
it controls.

Twelve networks. Four accounts. Four keys. One phrase — and now, one explanation you can check
yourself.

***

*Repo, derivation guide, and line-by-line explainers:
[github.com/baneeishaque-ompventure/metamask-multichain-accounts](https://github.com/baneeishaque-ompventure/metamask-multichain-accounts).*
