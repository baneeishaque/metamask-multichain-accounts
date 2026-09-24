# LinkedIn posts

Two standalone posts. Post 1 is the primary story; post 2 is the developer angle for a more
technical week. Both link to the canonical blog post (or the repository, depending on which
audience the week targets).

***

## Post 1 — The story (primary)

I added one account in MetaMask and got twelve networks.

Ethereum, Linea, Base, Arbitrum, BNB Chain, OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana,
TRON. One recovery phrase. One backup.

Then I noticed something: only the EVM account had a private key I could copy. Bitcoin, Solana,
and TRON showed an address and nothing else. My first thought was "where is the rest of my
wallet?"

It turns out twelve networks collapse into four accounts — and four keys — because a wallet
derives one key per curve and derivation path, not one key per network. The nine EVM networks
share a single key: EVM address derivation never asks which chain it is on.

The interesting part is *why* the newer keyrings behave differently — and what it means for
your backup strategy. I wrote it up with a runnable demo that reproduces all four accounts from
a public test phrase, pinned to the official BIP-39/BIP-84/SLIP-0010 test vectors.

Twelve networks → four accounts → four keys ← one phrase. Full breakdown in the comments.

`#Web3 #MetaMask #Blockchain #SoftwareEngineering #Cryptography`

***

## Post 2 — The developer angle

Your wallet does not have twelve accounts. It has four derivation branches.

If you have ever wondered why Solana paths end in `0'/0'` while Ethereum's end in `/0/0`, the
answer is a one-line difference between BIP-32 and SLIP-0010: ed25519 has no public-key
derivation, so every segment must be hardened. That single fact explains a dozen wallet
behaviors, from xpub support to why your Bitcoin key has no export button.

I built a small TypeScript demo that derives EVM, Bitcoin (native SegWit), Solana, and TRON
accounts from one BIP-39 phrase — about 300 lines, no hand-rolled crypto, and every result
pinned against the published specification vectors (BIP-39, BIP-84, SLIP-0010, ERC-55).

It is a good weekend read if you want to understand the layer of your wallet you never see:

`npm run derive`

Twelve networks, four accounts, one phrase — explained end to end, line by line.

`#SoftwareEngineering #TypeScript #Cryptography #Web3 #OpenSource`
