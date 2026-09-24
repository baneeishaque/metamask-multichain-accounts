# Instagram

A 10-slide carousel (the primary asset) and a Reel caption. Slide text is written for a
1080×1350 canvas — short lines, one idea per slide. Visual direction notes are for the
designer.

***

## Carousel — "One phrase. Twelve networks. Four accounts."

| # | On-slide text                                                                 | Visual direction                                              |
| - | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1 | One recovery phrase. Twelve networks. Four accounts.                           | Dark gradient, a single seed icon splitting into four branches |
| 2 | Ethereum · Linea · Base · Arbitrum · BNB Chain · OP · Polygon · Monad · Arc · Bitcoin · Solana · TRON | The twelve names in a tight grid, wallet-app style   |
| 3 | …but only **4 addresses** exist.                                               | The same grid collapsing into four glowing dots               |
| 4 | One seed → two curves: secp256k1 (BTC, ETH, TRON) and ed25519 (SOL)            | A seed splitting into two labelled tree trunks                |
| 5 | `m/44'/60'/0'/0/0` `m/84'/0'/0'/0/0` `m/44'/501'/0'/0'` `m/44'/195'/0'/0/0`   | Monospace paths as terminal lines, one per branch             |
| 6 | The 9 EVM networks share **one key** — address derivation never asks which chain | One key icon with nine chain badges orbiting it             |
| 7 | Same address ≠ same balance. Nine networks, nine ledgers, nine gas tokens.     | Nine separate balance cards under one address                 |
| 8 | Password ≠ phrase ≠ private key                                                | Three panels: vault lock / paper backup / single key          |
| 9 | "Where's my BTC private key?" → It's in the phrase.                           | A wallet with a greyed-out "Export" button                    |
| 10 | Verify it yourself — repo + full write-up in bio                              | Terminal screenshot of `npm run derive` output                |

**Caption:**

One MetaMask account. Twelve networks. Four addresses. 🧵

I kept staring at the account list: Ethereum, Linea, Base, Arbitrum, BNB Chain, OP, Polygon,
Monad, Arc, Bitcoin, Solana, TRON — and only one private key I could copy. Turns out those
twelve networks collapse into four accounts, because a wallet derives one key per curve and
path — not one per network. The nine EVM networks share a single key (address derivation never
asks which chain it's on), Solana runs on ed25519 with its own hardened-only path, and Bitcoin
and TRON each get their own branch.

The part that finally made it click: your password only decrypts the local vault; the phrase is
the backup for all four branches; a private key controls exactly one.

I wrote a small open-source demo that reproduces all four accounts from a public test phrase —
pinned to the official BIP-39 / BIP-84 / SLIP-0010 vectors. Link in bio. 🔗

`#web3 #metamask #crypto #blockchain #softwareengineering #typescript #bitcoin #solana #ethereum`
`#tron #devcommunity #learncoding`

***

## Reel caption (for the 30–45s edit in [reels.md](reels.md))

12 networks. 4 addresses. 1 phrase. 🧠 Your wallet's biggest design decision, explained in 40
seconds — and you can verify every step yourself with the demo in my bio.

`#web3 #metamask #crypto #blockchain #devtok`

***

## Notes for posting

- Post the carousel first; follow with the Reel 24–48 hours later to catch a second reach wave.
- Slide 5's paths are the screenshot people share — keep them monospace and legible on mobile.
- Never include a real address or key in any visual; the demo output uses the public test
  phrase.
