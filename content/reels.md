# Reels / Shorts scripts

Three vertical scripts, 30–45 seconds each, ordered from broadest hook to most technical. Each
works for Instagram Reels, YouTube Shorts, and Facebook Reels. Post them a few days apart, not
in one batch.

***

## Script 1 — "Twelve networks, four accounts" (35s)

**Hook (0:00–04):** Wallet UI scrolling through twelve network names.

- VO: "MetaMask gave me twelve networks from one account — and then showed me only four
  addresses."
- Text: "12 networks → 4 addresses"

**Body (0:04–28):**

- VO: "Here's why. Your recovery phrase becomes a 64-byte seed. That seed grows two key trees —
  one for secp256k1, which covers Ethereum, Bitcoin and TRON; one for ed25519, which is Solana.
  Four paths, four keys."
- Visual: seed → two trunks → four path labels → four address snippets.
- Text (in sequence): "1 phrase → 1 seed" / "2 curves" / "4 paths → 4 keys"

**Payoff (0:28–35):**

- VO: "The nine EVM networks share one key, because address derivation never asks which chain
  it's on. Verify it yourself — link in bio."
- Text: "9 EVM networks = 1 key"

***

## Script 2 — "Why Solana needs its own key" (45s, technical)

**Hook (0:00–05):**

- VO: "Why does Solana get a different key from the same phrase? The answer is one missing
  operation."
- Text: "Why SOL ≠ ETH key"

**Body (0:05–35):**

- VO: "Bitcoin, Ethereum and TRON live on the secp256k1 curve. BIP-32 derives child keys by
  adding points on that curve. Solana lives on ed25519 — its keys are hash seeds, not curve
  points, so that addition doesn't exist."
- Visual: curve diagram; the addition formula highlighted, then crossed out on ed25519.
- VO: "SLIP-0010 fixes it by using only HMAC — but that removes public derivation entirely.
  That's why every Solana path segment is hardened. Those apostrophes aren't style."
- Visual: `m/44'/501'/0'/0'` typing in, apostrophes pulsing.
- Text: "ed25519 → hardened only"

**Payoff (0:35–45):**

- VO: "One seed, two trees. Full derivation with official test vectors — repo in bio."
- Text: "github.com/baneeishaque-ompventure/metamask-multichain-accounts"

***

## Script 3 — "Password vs phrase vs private key" (30s)

**Hook (0:00–04):**

- VO: "Three secrets, three completely different jobs. Mixing them up is how people lose
  funds."
- Text: "3 secrets, 3 jobs"

**Body (0:04–24):**

- VO: "Your MetaMask password decrypts the local vault. It never touches key derivation — same
  phrase with a different password restores the same accounts."
- Visual: lock opening a file, keys not involved.
- VO: "Your recovery phrase restores all four branches. It's the single point of failure for
  everything."
- Visual: paper backup glowing red.
- VO: "A private key controls exactly one branch — nine EVM networks, or Bitcoin, or Solana, or
  TRON."
- Visual: four keys, one lit at a time.

**Payoff (0:24–30):**

- VO: "Leak one key, lose one branch. Leak the phrase, lose everything. Link in bio."
- Text: "phrase = everything"

***

## Captions (shared)

- Script 1: `12 networks → 4 addresses. The wallet design decision nobody explains. Full demo
  in bio. #web3 #metamask #crypto #blockchain #techtok`
- Script 2: `Solana's key comes from a different tree — and the apostrophes in m/44'/501'/0'/0'
  are the clue. #solana #ethereum #crypto #devtok #blockchain`
- Script 3: `Password ≠ recovery phrase ≠ private key. Three jobs, one very expensive mix-up.
  #crypto #metamask #web3 #security #techtok`

***

## Production notes

- Record the terminal at 2× zoom; the four-address output is the money shot in all three
  scripts.
- Keep the same intro card style across the three so they read as a series.
- Burn captions; most Reels views are muted.
- Script 2 can be cut to 30s by dropping the "xpubs" sentence if retention drops in the first
  week.
