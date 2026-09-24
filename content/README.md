# Content kit

Everything needed to present **metamask-multichain-accounts** across platforms: one canonical
long-form piece, one syndicated adaptation, a social funnel that routes attention to it, and a
37-locale video pipeline.

## Asset map

| File                        | Platform                  | Length / format                    | Call to action                    |
| --------------------------- | ------------------------- | ---------------------------------- | --------------------------------- |
| `blog-post.md`              | Community website (canonical) | ~1,800 words                   | Clone and verify the repo         |
| `medium.md`                 | Medium                    | ~1,500 words + metadata            | Canonical back to the blog post   |
| `linkedin.md`               | LinkedIn                  | 2 posts, 130–220 words each        | Blog post / repository            |
| `x-thread.md`               | X (Twitter)               | 12 posts, ≤280 chars each          | Repository                        |
| `facebook.md`               | Facebook                  | ~180 words, link in first comment  | Blog post                         |
| `whatsapp.md`               | WhatsApp groups + Status  | 60–120 words (+ reply snippets)    | Blog post                         |
| `instagram.md`              | Instagram                 | 10-slide carousel + Reel caption   | Link in bio                       |
| `snapchat.md`               | Snapchat Spotlight        | 35-second vertical script          | Link in bio                       |
| `reels.md`                  | Reels / Shorts            | 3 scripts, 30–45 seconds each      | Repository                        |
| `youtube/`                  | YouTube                   | ~3-minute video, 37 locales        | Repository + webinar              |
| `youtube/README.md`         | —                         | Video pipeline documentation       | —                                 |

The canonical long-form piece is [`blog-post.md`](blog-post.md). Everything else either
summarizes it, routes to it, or adapts it — the Medium version restructures it and points its
canonical link back, the social posts funnel toward it, and the video compresses it.

## Publishing order

1. **Repository** — everything links to it; publish first so no post points at a 404.
2. **Blog post** — canonical URL, then add that URL to `medium.md`'s canonical field.
3. **Medium** — publish the adaptation with the canonical link set.
4. **YouTube** — the 37-locale video (see [`youtube/README.md`](youtube/README.md)).
5. **LinkedIn + X** — the professional funnel, 1–2 days apart.
6. **Facebook + WhatsApp** — the community funnel, same week.
7. **Instagram + Snapchat + Reels** — the visual funnel, following week.
8. **Webinar** — promote with the strongest-performing social post; see
   [`../webinar/plan.md`](../webinar/plan.md).

## Voice and accuracy rules

- **Audience:** developers, roughly two years of experience. Explain terms on first use; never
  assume wallet internals.
- **No personal keys or addresses anywhere.** Every address in every asset comes from the
  public BIP-39 test phrase, which has never held funds. This is non-negotiable.
- **Standards have names.** BIP-39, BIP-32, BIP-84, SLIP-0010, EIP-55 — naming them is the
  point of the piece.
- **Hedge the wallet UI claims.** "At the time of writing" for export-button behavior; feature
  availability varies by build and region.
- **The one-sentence thesis, verbatim across assets:** *Twelve networks → four accounts → four
  keys ← one recovery phrase.*
- **Never advise moving funds to a test phrase** — say the opposite explicitly wherever the
  test phrase appears.

## Reuse rules

- The blog post's four-branch table and terminal output are the two most-quoted assets; keep
  them identical wherever they appear.
- The X thread and the Reels scripts share the same beats; do not publish them the same day.
- The video's narration script is generated from `youtube/translations/en.json` — if the facts
  change, update the translations and re-run the pipeline; never hand-edit `scenes.json`.
