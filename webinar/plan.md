# Webinar plan — "12 networks, 4 accounts, 1 recovery phrase"

<!-- markdownlint-disable MD029 -- continuous numbering by design -->

A complete, ready-to-run plan for a live 90-minute webinar that teaches how MetaMask
multichain accounts derive EVM, Bitcoin, Solana, and TRON accounts from a single BIP-39
phrase — and how to verify every step with the open-source demo in this repository.

***

## 1. Overview

| Item             | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Title            | 12 networks, 4 accounts, 1 recovery phrase — how MetaMask multichain accounts really work |
| Format           | Live webinar, 90 minutes (60 minutes teaching + demo, 22 minutes Q&A, buffer) |
| Audience         | Software developers with ~2 years of experience; no cryptography background required |
| Prerequisites    | Comfort with a terminal and `npm`; a MetaMask install is helpful but not required |
| Platform         | Zoom / Google Meet / Teams — anything with chat, screen share, and recording |
| Deliverables     | Recording, slide deck, demo repository, Q&A digest, feedback form     |
| Presenter        | 1 presenter + 1 chat moderator (moderator can be optional at small sizes) |

**Thesis to repeat verbatim at least four times:**

> Twelve networks → four accounts → four keys ← one recovery phrase.

## 2. Learning objectives

By the end of the session, attendees can:

1. Explain what a BIP-39 phrase actually encodes, and what the optional passphrase changes.
2. Describe why secp256k1 (BIP-32) and ed25519 (SLIP-0010) need different derivation schemes.
3. Read a derivation path — purpose / coin type / account / change / index — and say which
   account it produces.
4. Explain why nine EVM networks share one address while their balances stay separate.
5. Distinguish the three secrets: MetaMask password, recovery phrase, and private key.
6. Run the demo, derive all four accounts from the public test phrase, and verify the same
   phrase against their own wallet.

## 3. Audience and positioning

- **Start from zero, end at SLIP-0010.** The first ten minutes assume nothing; the last
  third assumes the audience has followed along. Every concept gets a plain-language
  definition before its technical name.
- **Two years of experience is the calibration point.** Attendees know what a hash and a
  public key are, but not what a hardened child key is. Never say "obviously" or "as you
  know".
- **Real wallet, real observations.** The hook is a screen recording of an actual MetaMask
  account list — not a diagram. The confusion is the audience's confusion.
- **No financial advice, no price talk.** This is an engineering session. State this in the
  housekeeping slide.

## 4. Run of show (90 minutes)

| # | Segment                                  | Start | Length | Slides    |
| - | ---------------------------------------- | ----- | ------ | --------- |
| 1 | Welcome, housekeeping, poll               | 0:00  | 4 min  | 1–4       |
| 2 | The hook: 12 networks, 4 addresses        | 0:04  | 4 min  | 5–8       |
| 3 | From phrase to seed (BIP-39)              | 0:08  | 8 min  | 9–14      |
| 4 | One seed, two trees (BIP-32 vs SLIP-0010) | 0:16  | 10 min | 15–21     |
| 5 | Four paths, four keys                     | 0:26  | 7 min  | 22–27     |
| 6 | Four ways to write an address             | 0:33  | 5 min  | 28–31     |
| 7 | One key, nine ledgers                     | 0:38  | 6 min  | 32–35     |
| 8 | Three secrets, three blast radii          | 0:44  | 5 min  | 36–39     |
| 9 | Live demo                                 | 0:49  | 15 min | 40–42     |
| 10 | Trade-offs and limitations               | 1:04  | 4 min  | 43–44     |
| 11 | Q&A                                       | 1:08  | 22 min | 45        |

Buffer: the plan lands at ~1:30; anything overruns into the buffer, and Q&A can stretch to
1:35 if the room is active. **Never cut Q&A to stay on time** — cut slide 43's examples
instead.

## 5. Slide-by-slide outline

Design rule: **simple but maximum content.** One idea per slide, dark background, large
monospace for anything code-shaped, no animation, no stock photos. Dense is fine; busy is not.

### Segment 1 — Welcome (slides 1–4)

1. **Title slide** — title, presenter name, repo URL, date.
2. **Housekeeping** — recording notice, chat rules, Q&A at the end (questions can be dropped
   in chat any time), no financial advice.
3. **Agenda** — the four acts: phrase → seed; seed → keys; keys → addresses; verify it
   yourself.
4. **Poll** — "How many networks does your MetaMask show?" (options: 1–3, 4–6, 7–9, 10+).
   Results become the hook's punchline.

### Segment 2 — The hook (slides 5–8)

5. **Screen recording** — adding an account, scrolling the network list: Ethereum, Linea,
   Base, Arbitrum, BNB Chain, OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana, TRON.
6. **The observation** — account details: only the EVM account has a visible private key.
   Bitcoin, Solana, and TRON show an address and nothing else.
7. **The question** — "Is something missing, or is this the design?" Show the poll split.
8. **The thesis** — *12 networks → 4 accounts → 4 keys ← 1 phrase.* Promise: by minute 49
   they will have verified this on their own machines.

### Segment 3 — From phrase to seed (slides 9–14)

9. **What the phrase is** — 12 words = 128 bits of entropy + checksum; wordlist of 2048
   words; 24 words = 256 bits.
10. **The one formula** — `seed = PBKDF2-HMAC-SHA512(phrase, "mnemonic" + passphrase, 2048,
    64 bytes)`. Read it aloud, term by term.
11. **Phrase ≠ seed ≠ key** — three boxes, arrows between them. The seed is what the wallet
    stores/derives from; the phrase is its portable encoding.
12. **The passphrase (25th word)** — same phrase + different passphrase = a completely
    different wallet. Show both seeds for the test phrase side by side.
13. **Real-life example #1** — "I restored my wallet with the right 12 words and it's
    empty." The passphrase is the first suspect.
14. **Checkpoint question** — "If I change my MetaMask password, do my accounts change?"
    (No — the password is not in this formula. Tease segment 8.)

### Segment 4 — One seed, two trees (slides 15–21)

15. **The two curves** — secp256k1: Bitcoin, Ethereum, TRON. ed25519: Solana. One line each.
16. **BIP-32 in one slide** — HMAC-SHA512("Bitcoin seed", seed) → master key + chain code;
    child = parent + hash(parent, index) *on the curve*.
17. **The problem** — ed25519 private keys are hash seeds, not curve scalars. The addition
    does not exist. BIP-32 cannot apply.
18. **SLIP-0010 in one slide** — child = HMAC-SHA512(parent chain code, parent key || index).
    No curve arithmetic at all.
19. **The trade** — works on every curve, but hardened-only: no public derivation, no xpub,
    every segment gets an apostrophe. Show `m/44'/501'/0'/0'` vs `m/44'/60'/0'/0/0`.
20. **Why the apostrophes matter** — `0'` means "hardened"; dropping one on Solana produces
    a path no wallet will derive.
21. **Checkpoint** — "Which curve can share one tree across three chains?" (secp256k1.)

### Segment 5 — Four paths, four keys (slides 22–27)

22. **Anatomy of a path** — `m / purpose' / coin_type' / account' / change / index`.
23. **The four paths table** — EVM `m/44'/60'/0'/0/0`; Bitcoin `m/84'/0'/0'/0/0`; Solana
    `m/44'/501'/0'/0'`; TRON `m/44'/195'/0'/0/0`.
24. **Coin types are registered** — 60 Ethereum, 501 Solana, 195 TRON; 84 is a *purpose*
    (native SegWit), not a coin type. Mention SLIP-0044.
25. **Bitcoin's purpose values** — `44'` legacy `1…`, `84'` native SegWit `bc1q…`, `86'`
    Taproot `bc1p…`. Same seed, three address families.
26. **Worked example** — the public test phrase at each of the four paths; show the four
    addresses on one slide.
27. **Checkpoint** — "Same phrase, five different wallets, same four accounts?" (Yes — the
    paths are standards, not MetaMask inventions.)

### Segment 6 — Four ways to write an address (slides 28–31)

28. **EVM** — keccak-256 of the uncompressed public key → last 20 bytes → hex + EIP-55
    mixed-case checksum.
29. **Bitcoin** — HASH160 of the compressed key → bech32 witness program → `bc1q…`.
30. **Solana** — the raw 32-byte public key in base58; no hash, no checksum.
31. **TRON and the twin trick** — same 20 keccak bytes as EVM + `0x41` prefix +
    base58check. `TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH` and
    `0xC8599111F29c1e1E061265b4AF93eA1F274aD78A` are one account in two alphabets.

### Segment 7 — One key, nine ledgers (slides 32–35)

32. **Chain-agnostic derivation** — no chain ID, no network name participates in key →
    address. Same key → same address on all nine EVM networks, forever.
33. **What does not collapse** — nine ledgers, nine gas tokens: ETH on Ethereum/Linea/Base/
    Arbitrum/OP, BNB on BNB Chain, POL on Polygon, MON on Monad. (Arc: confirm the gas token
    before presenting.)
34. **Real-life example #2** — "I have USDC on Base but can't send it" — gas is a separate
    balance on a separate chain, even though the address is identical.
35. **Real-life example #3** — exchange deposits: picking the wrong network sends funds to a
    chain you may not have gas on. The address being identical makes this *more* dangerous,
    not less.

### Segment 8 — Three secrets, three blast radii (slides 36–39)

36. **The password** — decrypts the local vault file only. Not in any derivation formula.
    Two devices, two passwords, same accounts.
37. **The recovery phrase** — restores all four branches. The single point of failure for
    everything.
38. **The private key** — controls exactly one branch. Blast-radius diagram: one key → nine
    EVM networks, or Bitcoin, or Solana, or TRON. Phrase → everything.
39. **Why there is no BTC export button (yet)** — newer keyrings derive on demand; the phrase
    is the backup. Say explicitly: *never paste a real phrase into any website, including
    this demo.*

### Segment 9 — Live demo (slides 40–42)

40. **Setup** — clone, install, run. Show `npm run derive` on the public test phrase.
41. **The reveal** — the four addresses, matching the slides. Then run the test suite:
    `npm run test` (36 tests against official vectors).
42. **Do it yourself** — the two commands to compare against their own wallet, and the
    safety warning. Full script in section 6.

### Segment 10 — Trade-offs (slides 43–44)

43. **What this demo is not** — read-only (no signing, no RPC), no UI, no hardware-wallet
    support, test vectors only, MIT-licensed for reuse.
44. **What the wallet still hides** — export gaps, Snaps-era keyrings, regional feature
    differences; and the honest note that wallet behavior changes — check the repo and the
    standards, not a blog post.

### Segment 11 — Q&A (slide 45)

45. **Q&A slide** — repo URL, blog URL, video URL, feedback form QR code. Keep the Q&A bank
    (section 7) open on a second screen.

## 6. Live demo script

**Environment pre-flight (10 minutes before going live):**

- Fresh clone in a clean directory, `npm install` already completed (do not install live).
- Terminal font size ≥ 18pt; window at 16:9; notifications off; no personal paths visible.
- `npm run derive` and `npm run test` each executed once to warm caches.

**Commands, in order:**

```bash
# 1. The claim, verified on the public test phrase
git clone https://github.com/baneeishaque-ompventure/metamask-multichain-accounts
cd metamask-multichain-accounts
npm run derive

# Expected: four accounts, in this order —
#   EVM             m/44'/60'/0'/0/0    0x9858EfFD232B4033E47d90003D41EC34EcaEda94
#   Bitcoin         m/84'/0'/0'/0/0     bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu
#   Solana          m/44'/501'/0'/0'    HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk
#   TRON            m/44'/195'/0'/0/0   TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH

# 2. The proof it is not just hardcoded
npm run test          # 36 tests: SLIP-0010, BIP-39, BIP-84, EIP-55 vectors

# 3. The audience's turn (never a real phrase on stream)
npm run derive -- --mnemonic "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
```

**Talking points while the terminal runs:**

- The default phrase is public and has never held funds — say this twice.
- Point at the paths column: "these are the four paths from slide 23".
- After the tests pass: "the vectors are the official ones from the specs, not ours".

**Fallbacks:**

- **`npm` fails on stage** → switch to the pre-recorded 3-minute screen capture of the same
  commands (record it during rehearsal).
- **Audience asks to use their own phrase** → refuse politely: paste a phrase only into a
  wallet you control; the demo is for the public test phrase.
- **No network** → the demo is fully offline; if the clone is pre-staged, nothing breaks.

## 7. Q&A bank

Keep this open during the session; answers are written to be said, not read.

### Fundamentals

1. *Where is my Bitcoin private key?* — It is derived from your phrase on demand. MetaMask's
   newer keyrings don't show an export button yet; the phrase is the complete backup.
2. *Is the MetaMask password the same as my private key?* — No. It only decrypts the local
   vault; it never enters derivation. Same phrase with a new password = same accounts.
3. *What is the 25th word / passphrase?* — An optional extra word mixed into the BIP-39 salt.
   Same phrase with and without it are two different wallets.
4. *I restored 12 words and my accounts are empty. Why?* — Usually the passphrase. Second
   suspect: a different derivation path in the restoring wallet.
5. *Can I use the same phrase in two wallets at once?* — Yes, standards-compliant wallets
   derive the same accounts; there is no "registration". Never do it with a phrase you don't
   fully control.

### Derivation

6. *Why do the nine EVM networks share one address?* — Address derivation is a function of
   the key alone; no chain ID is involved.
7. *Why does Solana use a different path shape?* — ed25519 needs SLIP-0010, which is
   hardened-only, so every segment ends in an apostrophe.
8. *What does hardened mean?* — The child key depends on the parent's *private* key, so no
   public derivation (no xpubs) and no sibling leakage.
9. *Who assigns coin types — 60, 501, 195?* — SLIP-0044 registry; 84 is a BIP purpose for
   native SegWit, not a coin type.
10. *Why `bc1q…` and not `1…` or `bc1p…`?* — Purpose `84'` = native SegWit. `44'` gives
    legacy, `86'` gives Taproot.
11. *Can I change the derivation path in MetaMask?* — Not for the native accounts; importing
    a specific private key is the usual workaround.
12. *Do Ledger/Trezor derive the same accounts?* — For the same phrase and path, yes; both
    implement the same standards. Passphrase handling differs in the UI.

### Security and blast radius

13. *Is it safe to paste my phrase into this demo?* — No. Never paste a real phrase into any
    website or CLI you did not build/audit. Use the public test phrase.
14. *What if I leak one private key?* — One branch is compromised: nine EVM networks, or
    Bitcoin, or Solana, or TRON. Move the other branches and generate a fresh phrase.
15. *What if I leak the phrase?* — Everything, on every network, at once. Treat as total
    compromise.
16. *Does MetaMask store my phrase on a server?* — No; it is encrypted in the local vault.
    The password never leaves the device.
17. *Is the password enough to restore?* — No. The password protects the vault file; the
    phrase (or a vault backup) is the restore material.

### Practical

18. *Why does my TRON address start with T?* — The `0x41` version byte before base58check.
19. *Are EVM and TRON addresses the same account?* — The same key produces both; the 20-byte
    body is identical. They are one account in two encodings.
20. *What happens when I add account 2 in MetaMask?* — The index segment increments
    (`…/0/1`), producing a new set of four accounts from the same phrase.
21. *Can two chains share an address but show different balances?* — Always: one key, nine
    ledgers, nine gas tokens.
22. *How do I verify addresses without running code?* — Compare against a second
    standards-compliant wallet restored from the same phrase; or check the official test
    vectors linked in the repo.
23. *Is this audited code?* — The demo uses audited primitives (noble/scure) and is pinned
    to official vectors; the repository itself is educational and read-only.
24. *Where do I learn more?* — BIP-39, BIP-32, BIP-84, SLIP-0010, SLIP-0044, EIP-55; the
    repo's `docs/` folder has line-by-line explainers.
25. *What should I do right now?* — Run `npm run derive` against the public phrase, then
    verify your own backup by restoring your phrase into a second wallet.

## 8. Real-life examples bank

1. **The empty restore** — a user restores 12 correct words on a new laptop and sees empty
   accounts; the 25th word was set years earlier and forgotten. Lesson: the passphrase is
   part of the backup or it is not a backup.
2. **The wrong-network deposit** — funds sent to an exchange's Base deposit address from a
   wallet that only had gas on Ethereum. Same address, different ledger. Lesson: identical
   addresses make network selection *more* dangerous.
3. **The shared EVM key** — a leaked EVM private key drains nine networks, not one. Lesson:
   blast radius is per branch, not per network.
4. **The phishing export** — a fake site offers to "export your BTC private key" and asks for
   the phrase. Lesson: the phrase is the key; no legitimate site needs it.
5. **The dev fixture** — a team derives deterministic test accounts from a public phrase for
   local-chain fixtures, never for funds. Lesson: deterministic accounts are a feature, and
   test phrases must be visibly test phrases.

## 9. Post-webinar funnel

1. **Within 2 hours:** send the recording link, slide deck, and repository link to all
   registrants; thank attendees in the community channels.
2. **Within 48 hours:** publish the Q&A digest (the 8–10 most-asked questions with short
   answers) as a blog addendum; link it from the repo.
3. **Within 1 week:** publish the full video on YouTube (the 37-locale kit in
   `content/youtube/`); link the blog post as the canonical write-up.
4. **Feedback form:** 5 questions — pace, level, most useful segment, what was missing,
   would you attend a follow-up? Use it to tune the next session.
5. **Next session teaser:** "From phrase to signature — what actually happens when you sign
   a transaction" (the natural sequel to this material).

## 10. Logistics checklist

### One week before

- [ ] Deck drafted from section 5; demo environment pinned to a tagged commit.
- [ ] Registration page live with the title, abstract, and audience line.
- [ ] Recording consent notice added to the invite.
- [ ] Rehearsal scheduled (section 11).

### One day before

- [ ] Deck final; speaker notes reviewed; Q&A bank printed/open.
- [ ] Fresh clone + `npm install` verified on the presenting machine.
- [ ] Pre-recorded demo fallback exported.
- [ ] Poll created (slide 4); chat welcome message drafted.

### 30 minutes before

- [ ] Recording started; screen share at 16:9; notifications off; terminal cleaned.
- [ ] Moderator online; Q&A bank shared with moderator.
- [ ] Timer visible to the presenter only.

### After

- [ ] Recording trimmed and uploaded; captions generated.
- [ ] Q&A digest drafted from chat.
- [ ] Feedback form sent; metrics logged (attendance, completion, questions, form score).

## 11. Rehearsal plan

1. **Full run-through (60 min)** — presenter alone, timer on, slides + demo + Q&A bank skim.
   Record it; watch at 2× and cut anything that drags.
2. **Demo-only rehearsal (20 min)** — run the three commands from a cold clone on the
   presenting machine, then once with the network disabled.
3. **Q&A drill (15 min)** — moderator asks the 10 hardest questions from section 7 in random
   order; answers must stay under 60 seconds each.
4. **Final tech check (10 min)** — platform audio, screen-share resolution, recording, poll,
   and the fallback video playback.

## 12. Risks and fallbacks

| Risk                          | Mitigation                                                        |
| ----------------------------- | ----------------------------------------------------------------- |
| Live demo fails               | Pre-recorded demo (recorded in rehearsal) plays; keep talking     |
| Network unavailable           | Demo is offline; clone pre-staged before the session              |
| Attendee pastes a real phrase | Moderator watches chat; presenter repeats the warning at demo start |
| Session runs long             | Cut slide 43 examples; never cut Q&A                              |
| Hostile/price questions       | Moderator parks them; presenter restates "engineering session, no financial advice" |
| Low attendance                | Treat the recording as the primary artifact; funnel to it          |
| Translation-heavy audience    | Point to the 37-locale video kit and localized subtitles           |
