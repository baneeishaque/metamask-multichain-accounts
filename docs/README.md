# Documentation

This directory explains how the demo works, why it is built the way it is, and how to verify
that its output is correct.

| Document                                   | Answers                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| [`architecture.md`](architecture.md)       | What the system models, its modules, and the derivation pipeline.      |
| [`derivation-guide.md`](derivation-guide.md) | Step-by-step: phrase → seed → paths → keys → addresses, with pitfalls. |
| [`testing.md`](testing.md)                 | Which official vectors are pinned, and the differential cross-checks.  |
| [`trade-offs.md`](trade-offs.md)           | Every design decision, the alternatives, and why.                      |
| [`explainers/`](explainers/)               | Line-by-line walkthroughs of the source files.                         |

The line-by-line explainers:

| Explainer                                              | Covers                                        |
| ------------------------------------------------------ | --------------------------------------------- |
| [`explainers/slip10.md`](explainers/slip10.md)         | `src/slip10.ts` — ed25519 HD derivation.      |
| [`explainers/address-encodings.md`](explainers/address-encodings.md) | `src/address.ts` — four address encodings. |
| [`explainers/derivation-core.md`](explainers/derivation-core.md) | `src/derive.ts`, `src/report.ts`, `src/cli.ts`. |

***

For the project overview, start at the [root README](../README.md). For the content-marketing
kit built on top of this project, see [`content/`](../content/).
