# WhatsApp messages

For React / web-developer community groups. Two lengths: a group broadcast (fits the 60–120
word norm for community shares) and a Status update. Never forward the same message to a group
twice, and ask an admin before posting in moderated groups.

***

## Community group broadcast (≈110 words)

Hi everyone — sharing a wallet rabbit hole I went down, since a few of you use MetaMask.

I added one account and got 12 networks (Ethereum, Linea, Base, Arbitrum, BNB Chain, OP,
Polygon, Monad, Arc, Bitcoin, Solana, TRON). But only 4 distinct addresses — the 9 EVM
networks share one key, and Solana runs on a whole different curve. Wrote it up with a small
TypeScript demo that derives all four accounts from one public test phrase, pinned to the
official BIP-39/BIP-84/SLIP-0010 vectors.

Blog + repo: [link]

Happy to explain derivation paths if anyone's curious — the Solana `0'/0'` thing is the fun
part.

***

## Status update (≈45 words)

12 networks, 4 addresses, 1 recovery phrase. Wrote up why your BTC/SOL/TRON accounts have no
export button — with a runnable demo pinned to the official wallet test vectors. [link]

***

## Reply snippets (for group Q&A)

- **"So where's my BTC private key?"** — It's derived from your phrase on demand; MetaMask
  just doesn't show an export button for the newer keyrings yet. The phrase is the backup.
- **"Is my password the same as my private key?"** — No. The password only decrypts the local
  vault; it never touches key derivation. Same phrase + different password = same accounts.
- **"Why do my 9 EVM networks share one address?"** — Address derivation is a function of the
  key alone. No chain ID goes into it. Balances, however, stay per-network.

***

## Notes for posting

- Keep the link as a bare URL in one message; previews render cleaner.
- Do not paste the four-address table into the message — it reads as noise in chat; the blog
  post carries it.
- If the group bans links, post the story and offer the repo on request.
