# Facebook post

One post, community-friendly tone, link in the first comment (Facebook's reach penalty for
outbound links is real; the post itself should stand alone).

***

## Post

I added one account in MetaMask and the wallet gave me twelve networks: Ethereum, Linea, Base,
Arbitrum, BNB Chain, OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana, and TRON.

One recovery phrase. One backup.

Then I noticed only the EVM account had a private key I could copy — Bitcoin, Solana, and TRON
showed an address and nothing else. My first reaction was "wait, where's the rest of my
wallet?"

Turns out those twelve networks are really just four accounts, because a wallet derives one key
per curve and derivation path — not one key per network. The nine EVM networks share a single
key: address derivation never asks which chain it's on. Bitcoin, Solana, and TRON each get
their own branch, and Solana's runs on a completely different curve.

I wrote the whole thing up and built a small open-source demo that reproduces all four accounts
from a public test phrase — so you can check every step instead of trusting a blog post.
Twelve networks → four accounts → four keys ← one phrase.

Link in the comments. Curious how many people knew their nine EVM networks share one key?

***

## First comment (link)

Full write-up + the runnable demo (pinned to the official BIP-39 / BIP-84 / SLIP-0010 test
vectors): [link]

***

## Notes for posting

- Post the link in the first comment, not the body.
- Best windows for a developer-heavy audience: weekday mornings (IST) or early US morning.
- Reply to questions with the derivation-path table rather than re-explaining the whole story.
- If someone asks "so where is my BTC private key?", the answer is: it is derived from the
  phrase on demand — the phrase is the backup.
