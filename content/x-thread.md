# X (Twitter) thread

Twelve posts, each within the 280-character limit. Post 1 is the hook; posts 11–12 carry the
call to action. Character counts are approximate and safe under the limit.

***

## 1/

One MetaMask account. Twelve networks. Four addresses.

Here's the part the wallet UI doesn't explain: why your BTC, SOL, and TRON accounts have no
private key to export.

Thread 🧵

***

## 2/

The twelve words on your backup are not a key.

BIP-39 stretches them into a 64-byte seed:

PBKDF2-HMAC-SHA512, 2048 rounds, salt = "mnemonic" + optional passphrase

Everything in your wallet is derived from that seed.

***

## 3/

The seed grows two independent trees.

secp256k1 (Bitcoin, Ethereum, TRON) → BIP-32
ed25519 (Solana) → SLIP-0010

Two trees because ed25519 has no curve arithmetic for BIP-32's child-key formula.

***

## 4/

That's also why Solana paths end in 0'/0' — the apostrophes are mandatory.

SLIP-0010 is hardened-only: a child key is an HMAC of the parent's *private* key.

No public derivation. No xpubs. Hardened all the way down.

***

## 5/

Four paths. Four keys:

EVM        m/44'/60'/0'/0/0
Bitcoin    m/84'/0'/0'/0/0
Solana     m/44'/501'/0'/0'
TRON       m/44'/195'/0'/0/0

Different path → different key. Same seed.

***

## 6/

Why does one key serve 9 EVM networks?

Because address derivation never asks which chain it is on. No chain ID, no network name.

Same key → same 0x… address on Ethereum, Linea, Base, Arbitrum, BNB Chain, OP, Polygon, Monad,
and Arc.

***

## 7/

But balances do NOT collapse.

Nine networks, nine ledgers, nine gas tokens. ETH doesn't pay fees on BNB Chain (BNB) or
Polygon (POL).

One address, nine separate financial states.

***

## 8/

TRON is the fun one.

Its address = the same 20 keccak bytes an EVM address uses, prefixed with 0x41, base58check'd.

TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH and 0xC8599111F29c1e1E061265b4AF93eA1F274aD78A are the
same account.

***

## 9/

Three secrets people confuse:

• Password → decrypts the local vault only
• Recovery phrase → restores every branch
• Private key → controls exactly one branch

Lose the phrase, lose all four. Leak one key, lose one branch.

***

## 10/

So where's your BTC private key?

You already have it — it's in the phrase. MetaMask's newer keyrings derive it on demand but
don't show an export button yet.

For backup, the phrase is complete. For moving keys between wallets, it's a real gap.

***

## 11/

I built a ~300-line TypeScript demo that reproduces all four accounts from a public BIP-39
test phrase.

No hand-rolled crypto. Pinned to official BIP-39/BIP-84/SLIP-0010/ERC-55 vectors.

npm run derive

***

## 12/

Twelve networks → four accounts → four keys ← one phrase.

Full write-up, line-by-line explainers, and the runnable demo:
github.com/baneeishaque-ompventure/metamask-multichain-accounts

If you verify it with your own phrase, you'll never wonder about your backup again.
