# CLAUDE.md — The Republic of Veritas

Project instructions for Claude Code. Read this file and `spec.md` before every task. `spec.md` is the source of truth for behaviour, content and design; this file governs how you work.

## What this is
A 30-minute, whole-class, projected simulation for high-school students with no prior knowledge. The class plays Parliament, then the Minister, then a business hunting for a loophole, then the Supreme Court, voting on one decision per screen. It teaches that **Parliament, the government and the courts all make law, and the constitution decides who has the last word.**

**Simplicity is the governing design value.** If a change adds a screen, a vote, a mechanic or a number that the spec does not call for, do not make it.

## Repository layout
```
index.html          ← the deliverable: one self-contained file
spec.md             ← design specification (do not edit unless asked)
CLAUDE.md           ← this file
build-plan.md       ← phased build plan
tests/
  load-model.mjs    ← extracts CONTENT and MODEL blocks from index.html into a node:vm context
  model.test.mjs    ← unit tests (node:test, no dependencies)
  enumerate.test.mjs← every choice combination × constitution A/B against spec §11
```

## Hard constraints
- **Single file, no build step, no network requests.** No CDNs, web fonts, images or analytics. Must run from `file://` and GitHub Pages, offline.
- **Vanilla JS.** Tests use Node's built-in `node:test` and `node:assert` only.
- **Event delegation only.** One document-level listener per event type, dispatching on `data-action` / `data-*`. Never write inline `on*=` handlers in markup or `innerHTML` — they fail in sandboxed iframe contexts.
- **Storage:** `localStorage` only for Resume, always inside try/catch; the app must work if it throws.
- **No scores, indicators or invented statistics.** Outcomes are shown as law (stamps on the Law Book), not numbers. Vote tallies are the only counts on screen.

## Code organisation inside index.html
Five banner-delimited blocks, in this order:
1. `<style>` — tokens on `:root`; dark theme under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`; explicit `body` background.
2. `<svg>` defs — stamp ink filter, hatching patterns, emblem symbols.
3. `/* CONTENT:START */ … /* CONTENT:END */` — every student- and facilitator-facing string. No logic.
4. `/* MODEL:START */ … /* MODEL:END */` — pure functions from spec §6. No DOM, `window`, `Date.now()` or `Math.random()`; randomness only via the seeded PRNG.
5. `/* APP:START */ … /* APP:END */` — state, `dispatch`, history (Back), `render` per screen, input, clock, persistence.

State rules: one `state` object; `dispatch(action)` returns a new state; previous state pushed to history; `render()` is idempotent.

## Accuracy rules (high priority)
- Every legal statement must match `spec.md` §1.3, §5 and §12. Do not add real-world legal claims, case names, dates or figures not in the spec. If you think the spec is wrong, stop and say so instead of changing it.
- Real countries are only ever described as having *loosely inspired* a Veritas constitution.
- Never present a contested question (e.g. whether judges or elected representatives should have the last word) as settled.

## Copy rules
- Reading age about 13. Sentences ≤ 20 words where possible. Use the spec's exact copy where it is given.
- Glossary-link each glossary term on its first use per screen.
- British spelling.
- Anything you write that the spec does not supply verbatim (glossary definitions, facilitator script lines, likely-question answers) must be marked `authored: true` in CONTENT and listed in your end-of-phase summary.

## Design rules
- Follow `spec.md` §9 ("Chancery & Seal") exactly.
- No gradients, drop shadows, rounded pills, emoji or dashboard styling.
- Status never by colour alone: every stamp carries its word; voting cards carry letter and shape.
- Projection first: body ≥ 20 px at 1280×720; option-card text ≥ 26 px at 1920×1080; light-mode body contrast ≥ 7:1.
- Respect `prefers-reduced-motion`.

## Verification before declaring a phase done
1. `node --test` passes (run from the repo root; `node --test tests/` fails on Node 22).
2. If a headless browser (e.g. Playwright) is available, load `index.html`, confirm no console errors, and check the screens you built at 1280×720 and 1920×1080. If it is not available, say so — do not claim visual checks you did not run.
3. Add tests for every model branch you add or change.

## Working style
- Follow `build-plan.md`; one phase per session unless told otherwise.
- Smallest change that satisfies the phase; no unrelated refactors.
- Where the spec is ambiguous, choose the simpler reading that serves the learning outcome, implement it, and list it as a decision.
- End every phase with: files changed · tests run and results · checks not run · decisions · `authored: true` items · open questions.
