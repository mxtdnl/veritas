# Build Plan — The Republic of Veritas (v2)

Eight phases plus a review. Run one phase per Claude Code session and paste each prompt as written. Before Phase 0, commit `spec.md`, `CLAUDE.md` and this file to the repository root. Switch models with `/model` at the start of each session.

| Phase | Output | Recommended model | Why |
|---|---|---|---|
| 0 | Scaffold + test harness | Sonnet 5.5 | Routine setup |
| 1 | Design system, seals, stamps, chrome | Opus 5.5 | Procedural SVG and aesthetic judgement |
| 2 | CONTENT, MODEL, state machine + tests | Opus 5.5 | Every later phase depends on this being right |
| 3 | Opening, Act I, Act II | Sonnet 5.5 | UI wiring to a tested model |
| 4 | Act III, Act IV | Opus 5.5 | Constitution locks, conditional Case 2, precedent |
| 5 | Monday Morning, three countries, close | Opus 5.5 | Counterfactual mapping and Gazette design |
| 6 | Support features: print cards, script panel, glossary, teacher notes, persistence | Sonnet 5.5 | Many small, well-specified features |
| 7 | Independent review (fresh session) | Fable 5.1 if available, otherwise Opus 5.5 | Strongest reasoning; ideally different from the builder |
| 7b | Fix session | Opus 5.5 | Cross-cutting fixes |
| 8 | Timed rehearsal + deploy prep | Sonnet 5.5 | Checks and README |

Model availability depends on your plan; if a recommended model is unavailable, step up rather than down. Haiku 5.5 is not recommended: errors in a single-file build are costly to unpick.

Checkpoints: after Phases 1, 4 and 6, open the file yourself in a 1280×720 window or on a projector before continuing.

---

## Phase 0 — Scaffold and test harness · Sonnet 5.5

```
Read CLAUDE.md and spec.md in full before doing anything.

Task: Phase 0 — scaffold.

1. Create index.html with the five banner-delimited blocks from CLAUDE.md (style, SVG defs, CONTENT, MODEL, APP). The MODEL block must contain a working mulberry32 PRNG and a stable string-hash function, exposed on a MODEL object.
2. Create tests/load-model.mjs: extract the CONTENT and MODEL blocks from index.html by their markers, evaluate them in a node:vm context, and return { CONTENT, MODEL }. Throw a clear error if a marker is missing.
3. Create tests/model.test.mjs: PRNG determinism for a fixed seed; hash stability; a static check that the MODEL block contains no `document`, `window`, `Date.now` or `Math.random`.
4. Minimal APP block: render the title and register one document-level click listener dispatching on data-action. No inline handlers anywhere.
5. Run `node --test tests/` and report.

End with the summary format in CLAUDE.md.
```

---

## Phase 1 — Design system and chrome · Opus 5.5

```
Read CLAUDE.md and spec.md (§8 chrome, §9 in full) before starting. No game logic in this phase.

Task: Phase 1 — build the "Chancery & Seal" design system.

1. Tokens: every colour in spec §9.1 for light and dark, wired as CLAUDE.md describes. Type stacks and sizes from §9.2.
2. seal(author, size): returns an SVG string — a procedurally generated guilloché rosette (hypotrochoid curves) with a distinct parameter set for PARL, MIN, COURT, GLIMMER and CLERK, ring text in small caps, and a central line-engraved emblem per §9.3 item 1. Cross-hatch pattern fills only; no gradients.
3. stamp(word): SVG stamp with the feTurbulence + feDisplacementMap ink filter, random-looking but seeded rotation between −4° and −9°, and the landing animation with a reduced-motion fallback. Implement every stamp word in §9.3 item 2.
4. Chrome: procedure ribbon (Bill → Rules → Gap → Court → Monday) with the red-tape tie and an untie transition; "You are now: …" role plate with seal; elapsed-time clock (brass at 25:00, oxblood at 30:00); glossary drawer shell (G / Esc).
5. Components: option card (square corners; selected = stamped tick + heavier rule), vote tally strip (number box with +/- per option), the Law Book raised document with marginal seal gutter, case folder with typed tab and "Held:" line, wax-sealed envelope with an SVG crack path.
6. A review-only gallery at ?gallery=1 showing every seal, stamp, component and both themes.
7. Verify (headless if available): no console errors; body ≥ 20 px at 1280×720; no horizontal scroll at 1024 px; report computed light-mode body contrast.

End with the summary format in CLAUDE.md.
```

---

## Phase 2 — Content, model and state machine · Opus 5.5

```
Read CLAUDE.md and spec.md in full before starting.

Task: Phase 2 — all content, the model and the state machine. Minimal UI only (a debug view is fine).

1. CONTENT: every string the spec supplies, verbatim — Bills (§4.1), list and age-check options with consequences (§4.2), Glimmer moves (§4.3), constitutions (§5), cases, arguments, reinterpret texts, ruling labels and the lock text (§4.4), the no-case card, headlines (§4.5.1), three-countries rows (§4.5), discussion questions (§4.6), hook question and options (§4.0), the disclaimer footer. Write the 12 glossary definitions (§8) and a facilitator script entry for every screen (§7.4: what to say ≤ 40 words, timing, one likely question and answer). Mark everything you wrote yourself `authored: true`.
2. MODEL (pure): all functions in spec §6 — moveResult, case1For, rulingOptions, lawBook, authorship, glimmerStatus, headline, threeCountries, autoDecide, toData, parseData — plus constitutionDraw(seed) returning 'A' or 'B'.
3. APP: state machine for the full screen sequence in §8, including the conditional screens (Act II list only for b_trust; Case 2 only when ARGUABLE; no-case card only for a clear LOOPHOLE). Back restores the previous state. Tie handling ("Speaker's casting vote") per §7.1. A `skipAct` action per spec §7.5: auto-decides the remaining votes in the current act via autoDecide, flags them byClerk, records the act in `skipped`, and routes to the Clerk result card; Back from the result card restores the pre-skip state.
4. Tests:
   - model.test.mjs: every row of the §4.3 table; case1For both branches; rulingOptions for A and B (Strike down locked under A with the exact lock text; Declare incompatible absent under B); lawBook statuses for each ruling; threeCountries mapping; headline priority order; DATA round-trip.
   - model.test.mjs (Skip Act): autoDecide returns exactly the §7.5 table for every act and every prior state, including part-way skips (e.g. Act II after the list vote) and the m_lite/m_chat fallback rule.
   - enumerate.test.mjs: every combination of bill × list (where applicable) × check × move × case1 ruling (available options only) × case2 ruling (where applicable) × constitution A/B, crossed with all 16 skip patterns (skipped acts take their autoDecide values). Assert spec §11 criteria 1–7 and 10 for every path and report the number of paths.
5. Run `node --test tests/` and report.

End with the summary format in CLAUDE.md, including the full list of authored items.
```

---

## Phase 3 — Opening, Act I and Act II · Sonnet 5.5

```
Read CLAUDE.md and spec.md (§2, §4.0–§4.2, §7, §8) before starting.

Task: Phase 3 — build the Setup, Title, Hook vote, Three branches, Act I and Act II screens on the Phase 1 components and Phase 2 model.

1. Setup per §8 (constitution mode, class label, Start, stubs for Print voting cards and Teacher notes).
2. Hook vote: four options, tally strip, no answer revealed; tally stored.
3. Three branches: three seals with the exact one-line descriptions and the closing line.
4. Act I: three Bill cards set as short statutes with "What this means" lines; vote with tally strip; on result the Bill moves into the Law Book, the hemicycle fills and ENACTED lands. The minority-voice prompt appears after the result (§7.3).
5. Act II: header line from §4.2; List vote (only for b_trust) then Age-check vote; each result is added to the Law Book with the Ministry seal and the REGULATION — IN FORCE stamp.
6. Ribbon and role plate update per screen. Keyboard: 1–4 selects a card; → / Space advances.
7. Skip Act (spec §7.5) for Acts I and II: footer button "Skip act — the Clerk decides" and key K, one-step confirmation, Clerk result card with seal, decisions, reason and the DECIDED BY THE CLERK stamp; the stamp persists on those Law Book lines. Build the result card as a reusable component — Phase 4 uses it for Acts III and IV.
7. Verify at 1280×720 and 1920×1080 (headless if available): the Law Book and option cards are fully legible without scrolling at 1920×1080.

End with the summary format in CLAUDE.md.
```

---

## Phase 4 — Act III and Act IV · Opus 5.5

```
Read CLAUDE.md and spec.md (§4.3, §4.4, §5) before starting.

Task: Phase 4 — build Act III (Find the gap) and Act IV (Judge the law).

1. Act III: Law Book on the left at reading size; Glimmer boardroom on the right with the four move cards and the prompt. On result, land the correct stamp (LOOPHOLE / ARGUABLE — SEE YOU IN COURT / CAUGHT / COMPLIED). For CAUGHT, highlight the exact words in the Law Book that caught Glimmer.
2. Unseal screen: wax envelope cracks and reveals the constitution card with its summary (§5); for an open constitution, show the card without the envelope. Facilitator line in the script panel.
3. Case 1: case folder with facts, both arguments (party-labelled) and the ruling options from rulingOptions(). Under A, Strike down is visible, padlocked and shows the lock text in full. On result: stamp the affected section in the Law Book (IN FORCE / REINTERPRETED with replacement text / INCOMPATIBLE — STILL IN FORCE / VOID), write the precedent on the folder's "Held:" line in typewriter type, and add it to the Law Book with the Court seal. If the vote was split, show "Decided n to m" and the dissent prompt.
4. Case 2 (only if ARGUABLE): Read the words / Read the purpose, with the consequences in §4.4. Otherwise show the no-case card for a clear LOOPHOLE, or skip.
5. Skip Act for Acts III and IV using the Phase 3 result card. Act IV's confirmation carries the "Not recommended" warning; the unseal screen is still shown before the Clerk rules; auto-rulings show "Decided by the Clerk" instead of a vote count.
6. Verify a full run through Act IV under both A and B (headless if available), including a split vote, a tie, a skip of each act, and a part-way skip of Act IV after Case 1.

End with the summary format in CLAUDE.md.
```

---

## Phase 5 — Monday Morning and Close · Opus 5.5

```
Read CLAUDE.md and spec.md (§4.5, §4.6, §9.3 item 7) before starting.

Task: Phase 5 — build the Gazette, the three-countries panel, the re-vote, the discussion screen and the End screen.

1. Gazette: masthead, headline from headline(), engraved Parliament-building illustration, and the full Law Book below the fold — every line with author seal and status stamp, VOID lines crossed through but visible. Authorship line rendered as a row of seals from authorship(). Glimmer's final status as a marginal note.
2. Three countries: the §4.5 table from threeCountries(), live constitution column highlighted (rule box plus marginal ✱, not colour alone), footer disclaimer. Text ≥ 22 px at 1920×1080.
3. Re-vote: the hook question again; show the opening and closing tallies side by side as two rows of counters.
4. Discussion: the facilitator picks one of the three questions; it fills the screen.
5. End: DATA line in small typewriter type with a Copy button (Clipboard API in try/catch, falling back to text selection) and Restart (with confirmation).
6. Verify (headless if available): every headline branch renders; the Gazette fits at 1920×1080.

End with the summary format in CLAUDE.md.
```

---

## Phase 6 — Support features · Sonnet 5.5

```
Read CLAUDE.md and spec.md (§7, §8, §12) before starting.

Task: Phase 6 — finish the facilitator and classroom features.

1. Print voting cards: a print stylesheet producing one A4 sheet of four cut-out cards (A square, B circle, C triangle, D diamond), letter and shape on each, high contrast, prints well in black and white.
2. Script panel (S): per-screen script, timing and likely question from CONTENT.
3. Glossary drawer: all 12 terms; every first use per screen linked. Add a test that scans CONTENT strings for glossary terms and checks the link markup.
4. Teacher notes screen and print view: spec §12 verbatim plus §1.3.
5. Persistence: save after every dispatch inside try/catch; Resume offer on load; app works with storage disabled (test by stubbing localStorage to throw).
6. Keyboard map complete per §8; R asks for confirmation.
7. Verify a full run with no console errors (headless if available) and a print preview of the voting cards.

End with the summary format in CLAUDE.md.
```

---

## Phase 7 — Independent review · Fable 5.1 (or Opus 5.5) · fresh session

```
You have not seen this project before. Read CLAUDE.md, spec.md and index.html in full. Do not fix anything in this session.

Act as three reviewers and write REVIEW.md, ranking findings blocker / major / minor with location, evidence and a suggested fix:

1. Learning designer: walk every screen as a 14-year-old with no prior knowledge. For each learning moment (spec §1.2), judge whether it would be noticed and understood, and identify any path where it fails or could be misread (e.g. concluding that courts can always cancel laws). Estimate read-aloud time for every screen's text and flag any screen that cannot fit its slot in §2.
2. Accuracy auditor: list every legal or factual claim in CONTENT and the teacher notes; mark each "matches spec", "not in spec" or "possibly inaccurate" with reason and confidence. Flag anything presenting a contested question as settled. Review every `authored: true` item.
3. Classroom tester: run full sessions under A and B in a headless browser if available — split votes, ties, Back at every screen, every Skip Act combination including Back after a skip, keyboard only, storage disabled, reduced motion, 1280×720. Report console errors, dead ends and legibility failures.
```

### Phase 7b — Fix session · Opus 5.5

```
Read CLAUDE.md, spec.md and REVIEW.md. Fix every blocker and major finding. For each fix, cite the finding, describe the change, and add a test where the finding was behavioural. Do not edit spec.md; list any finding that implies a spec change under "Spec changes proposed". Run the full test suite. End with the summary format in CLAUDE.md plus findings resolved and findings deferred (with reasons).
```

---

## Phase 8 — Timed rehearsal and deploy prep · Sonnet 5.5

```
Read CLAUDE.md and spec.md (§2, §11) before starting.

Task: Phase 8 — rehearsal and deployment readiness.

1. Rehearsal estimate: for every screen, count the words a facilitator reads aloud (screen text + script) and estimate time at 130 words per minute, then add the vote rhythm from spec §2 for each vote screen. Produce REHEARSAL.md with a per-screen table, the longest path's total, and any screen over its slot. Do not change copy; flag only.
2. Confirm zero network requests (browser request log, if a headless browser is available) and that the file opens from file://.
3. Set <title>The Republic of Veritas</title> and a short meta description.
4. Write README.md: what it is, how to run it in class (printing voting cards, setup choices, the vote rhythm), the constitutions, URL parameters (?seed=, ?gallery=1), and how to read the DATA line.
5. Do not push or enable GitHub Pages. List the exact commands you would run.

End with the summary format in CLAUDE.md.
```

After Phase 8, run one live rehearsal with colleagues before the first class: the 30-minute budget is an estimate, and REHEARSAL.md can only approximate discussion time.
