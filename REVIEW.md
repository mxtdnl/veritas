# REVIEW — The Republic of Veritas (Phase 7, independent review)

Reviewed: `index.html` at commit `f6a0a74`, against `spec.md` v2.0 and `CLAUDE.md`. No code was changed in this session.

Three reviewers' findings are merged into one ranked list (§1). The detail behind each reviewer's work follows: learning walk-through and read-aloud timings (§2), accuracy audit (§3), classroom test log (§4).

**Severity.** *Blocker*: must be fixed (or the spec changed) before use with a class. *Major*: will visibly harm the lesson, the facilitator or legibility in a normal run. *Minor*: polish, edge cases, or low-probability confusion.

**Spec-level.** Many findings come from copy or behaviour that the spec itself prescribes. These are marked **[spec]**. Under `CLAUDE.md` ("If you think the spec is wrong, stop and say so"), Phase 7b should not fix these silently; each needs a spec decision first.

---

## 0. Method and what was (and was not) checked

| Check | Result |
|---|---|
| `node --test` (Node 22.22.0, repo root) | 93/93 pass |
| Headless browser | Chromium (Playwright 1.56.1) from `file://` |
| Full sessions, each to End | A and B: 5 scripted paths × 2 viewports (1280×720, 1920×1080), plus keyboard-only, Back-everywhere, tie/split and storage runs |
| Skip Act | 168 browser sessions: all 16 skip patterns × A/B × 3 choice sets, start-of-act and part-way skips (Act II after the list, Act IV after Case 1). Back was pressed after **every** skip and the pre-skip screen and Law Book checked, then the skip was repeated |
| Console errors / page errors | **None** in any run |
| Network requests | **None** in any run (all `file://`) |
| Storage | `localStorage` getter throwing, and `setItem` throwing (quota): both reach End with no errors. Resume tested after reload |
| Reduced motion | `prefers-reduced-motion: reduce` emulated: only `stamp-fade` runs; hemicycle, envelope, typewriter, slide-in and tape transitions are off |
| Dark theme, 1024 px width | No horizontal scroll at 1024 px; dark theme renders |
| Print voting cards | Emulated print to A4 PDF: one sheet, four cards, letter and shape on each, black on white |

**Not checked** (do not treat as passed): a real projector or room-distance legibility; screen readers; Firefox, Safari or Edge; real printers; touch devices; GitHub Pages hosting; a timed rehearsal with people. Read-aloud times in §2.3 are **estimates** (130 words per minute plus the §2 vote rhythm), not measurements.

---

## 1. Findings, ranked

### Blockers

#### B1 — Under Constitution A, "Reinterpret" in *Kim* wipes the ban out of the Law Book. It looks exactly like a cancellation. [spec]
- **Reviewers:** learning designer, accuracy auditor.
- **Location:** `index.html:757` (`cases.kim.reinterpret`); `index.html:1351` (`lawBook`: `p.text = CONTENT.cases[c1.id].reinterpret`); spec §4.4 ("Reinterpret replaces … that section only").
- **Evidence:** On path A · `b_narrow` · `m_lite` · Reinterpret, the Law Book's §1 becomes *"Under-16s may still have accounts that only post to approved school or club groups."* It is stamped REINTERPRETED (screenshot: the No-case screen at 1280×720). That sentence is a permission, not a ban. Nothing in the Law Book now forbids under-16s from having accounts, and the original words are not shown (`p.original` is stored but never rendered, `index.html:2776–2784`). §2, "Apps that break this rule are fined", now points at no rule. The Gazette headline is "JUDGES REWRITE THE RULES". On the same screen, the No-case card says *"Judges apply the words — only Parliament can close this gap"*, and its script says *"Judges cannot rewrite clear words."*
- **Why it matters:** Under the very constitution meant to show that judges cannot cancel an Act, a 14-year-old sees the judges remove Parliament's ban. That is the misreading the review brief names ("courts can always cancel laws"). It also contradicts spec §1.3 item 4 on screen. Reinterpret is the middle, compromise card, so classes are likely to pick it.
- **Suggested fix (needs a spec decision):** Keep §1's original words and add the reading beneath them as a court note, e.g. *"Read by the Court (Kim): accounts that only post to approved school or club groups are allowed."* Alternatively, reword the Kim text as a narrowed ban: *"Under-16s may not have an account on [… as before], except accounts that only post to approved school or club groups."* Either way, show the original text struck lightly or kept, so the change is visibly a *narrowing*. Add a model test asserting that §1 still contains a prohibition after Reinterpret.

#### B2 — Under B, Strike down of §1 still leads to Case 2, and the Gazette fines Glimmer under a void law. [spec]
- **Reviewers:** learning designer, accuracy auditor.
- **Location:** `index.html:2288` (`nextScreen` case1 → case2 whenever ARGUABLE); `index.html:1436` (`autoDecide` IV: strike, then purposive); `index.html:890` (`glimmerStatus.CLOSED_BY_COURT`); spec §4.4 ("Case 2 — only if Act III was ARGUABLE"), §7.5 Act IV row.
- **Evidence:** Path B · `b_narrow` · `m_chat` · Strike down · Read the purpose (screenshots `void-case2`, `void-gazette`): §1 is crossed through and stamped VOID. The class is then asked *"Is [Glimmer Chat] covered by the law?"* The Gazette reads "COURT CANCELS PARLIAMENT'S LAW", while Glimmer's note says *"The court closed the gap. Glimmer is covered by the law and fined."* §2 "Apps that break this rule are fined" stays ENACTED with no rule to break. Under `b_trust`, the Minister's list regulation stays REGULATION — IN FORCE and counts towards the Minister's tally, even though the section it serves is void. **The Clerk's own Act IV auto-decision under B (strike + purposive) produces this state automatically** whenever Act III was ARGUABLE.
- **Why it matters:** The outcome is legally incoherent, and students will notice. It undermines LM2, because the strike-down apparently changed nothing for Glimmer. It also breaks the spec's "outcomes are shown as law" promise.
- **Suggested fix (needs a spec decision):** If Case 1 voids §1 (the section Case 2 depends on), skip Case 2. Show a one-line card instead, e.g. *"No case: §1 is void, so there is no rule for Glimmer to break."*, and set Glimmer's status to a new "NO RULE TO BREAK" (or reuse LOOPHOLE with different copy). Mark dependent lines (§2 under Kim, and the list regulation) as having no effect, or exclude them from `authorship`. Adjust the Clerk's Act IV rule so it never generates the contradiction. Extend `enumerate.test.mjs` to assert that no path has both `case1.ruling === 'strike'` on §1 and a Case 2 ruling.

### Major

#### M1 — The status stamps in the Law Book are too small to read on a projector, including "STILL IN FORCE".
- **Reviewer:** classroom tester.
- **Location:** `index.html:1705` (stamp text sizes), `index.html:1843` (Law Book stamp scale 0.52 compact / 0.62), `index.html:2784` (Gazette 0.44).
- **Evidence:** Text height measured in Chromium (see §4.3). At 1280×720, the second line "STILL IN FORCE" is **7.8 px** in the Law Book and **6.6 px** in the Gazette; "IN FORCE" under REGULATION is 7.5–8.9 px; first lines are 11–15 px. At 1920×1080 the second lines are 8.9–12 px. The ink filter's speckle holes reduce contrast further (stamps look faded in every screenshot).
- **Why it matters:** `CLAUDE.md` says outcomes are shown "as stamps on the Law Book", and "every stamp carries its word". In practice the decisive words (INCOMPATIBLE — **STILL IN FORCE**, the LM2 contrast) cannot be read from a classroom seat, so the stamp becomes a coloured smudge: status by colour alone.
- **Suggested fix:** Give Law Book stamps a minimum rendered text height (≈ 18 px for the second line at 1280×720). Set two-line stamps' second line at the same size as the first (or as plain small-caps text beside the stamp). Raise the Gazette stamp scale. Add a design test asserting minimum computed stamp text size.

#### M2 — Many screens overflow at 1280×720, and the longest path overflows at 1920×1080.
- **Reviewer:** classroom tester. Spec §9.4 ("fully legible at 1280×720"), §11 criterion 9; build plan Phase 3 ("legible without scrolling at 1920×1080").
- **Evidence (vertical overflow in px, 1280×720):** Bills 90 · Bills result 11–57 · Age-check result 27–56 · Gap 67 · Gap result 41–105 · Unseal (open) 46–79 · Case 1 28–93 · Case 1 result 51–108 · Case 2 82 · **Case 2 result 201** · **Gazette 27–168** · Three countries 76 · Clerk card 32. **At 1920×1080: Case 2 result overflows 46 px** on `b_trust`·`l_feeds`·`k_id`·`m_chat`.
- **What is lost:** the footer (Next, Skip act, Script) on most of these screens. The tally strip on Bills and Case 1 needs scrolling to reach. On the Gazette, the last Law Book lines, which are the Court precedents and therefore the LM1 evidence, fall below the fold.
- **Suggested fix:** Fit to the viewport rather than flowing: make `.game` exactly `100vh` with the stage scrolling internally only as a last resort. Collapse the Law Book to the lines relevant to the current act on Act III/IV (or shrink the Law Book column on court screens). Test with the longest Law Book: 8 lines, `b_trust` + `k_id` + Case 2. Add a Playwright-free check if possible (e.g. a documented manual checklist), since there is no browser in CI.

#### M3 — "Decided 9 to 14": a plurality ruling is shown as if it lost; a tie shows "Decided 7 to 7".
- **Reviewers:** classroom tester, learning designer.
- **Location:** `index.html:2274` (`split = [st.max, st.total - st.max]`), `index.html:2797` (`splitLine`).
- **Evidence:** Case 1 under A with counts Uphold 6 · Reinterpret 8 · Declare 9 → *"Decided 9 to 14. In real courts, judges who disagree can publish a dissent."* After a 7–7 tie and the casting vote → *"Decided 7 to 7."*
- **Why it matters:** Students will read "9 to 14" as the ruling having lost. With 3–4 options, pluralities are common.
- **Suggested fix:** For more than two options, show the per-option count ("Declare incompatible 9 · Reinterpret 8 · Uphold 6"), or "Decided by 9 of 23 judges". For a tie, append "— on the Speaker's casting vote". DATA can keep `for-against`. Add a test.

#### M4 — Enter on "No, go back" carries out the restart (or skip). A restart wipes the session with no undo.
- **Reviewer:** classroom tester (keyboard only).
- **Location:** `index.html:2489–2490` (`KEYS.resolve`: while a confirmation is open, Enter always confirms).
- **Evidence:** R → Tab (focus on "No, go back") → Enter ⇒ Setup; the session is gone. `restart` skips history (`index.html:2397`) and clears the saved session (`index.html:2594`), so neither Back nor Resume recovers it. The same sequence on a Skip confirmation skips the act (recoverable with Back).
- **Suggested fix:** Only treat Enter as "confirm" when focus is not on another button (let a focused button's native Enter activate it), or map Enter to the focused control. Add a KEYS test with `ctx.focus`.

#### M5 — The facilitator script is only available projected: it covers the vote cards and shows the answers to the class.
- **Reviewers:** classroom tester, learning designer.
- **Location:** `.script` overlay `index.html:479–485`; `scriptHtml` `index.html:3004`; teacher notes `index.html:2041` (no per-screen script).
- **Evidence:** At 1280×720 on Case 1, the open panel hides the four ruling cards and the lock text (screenshot `script-case1-1280`). On the same panel, *"Ask: Why can't you press that?"* sits directly above its answer. On the Re-vote screen, the panel's answer is *"Parliament, the government and the courts all make law…"*, which projects the intended answer while the class is voting. The printed teacher notes contain only §12 and §1.3, so there is no off-screen copy of the per-screen script.
- **Suggested fix:** Add the full per-screen script (say / timing / question / answer) to the teacher-notes print view, so facilitators can work from paper. Optionally hide the "Answer" row on the Hook and Re-vote screens. Anchor the panel so it never covers the option cards (e.g. replace the footer area rather than overlaying the stage).

#### M6 — Under Constitution B, or on Uphold/Reinterpret paths, the only on-screen evidence that courts cannot cancel Acts everywhere is one table row. [spec]
- **Reviewer:** learning designer (LM2, LM3; brief's example misreading).
- **Location:** `countriesHtml` `index.html:2960–2972`; spec §4.5 table.
- **Evidence:** Under B, the class never sees a locked card. The B charter says judges can cancel "any law that breaks it, even an Act of Parliament". If they Strike down, the headline is "COURT CANCELS PARLIAMENT'S LAW". The A/B contrast then rests on the Three-countries row "What the court could do with Case 1". When the class Upholds or Reinterprets, the row "What the class's choice becomes" reads **identically** in all three columns (e.g. "Uphold · Uphold · Uphold"), so the panel shows no consequence of the constitution. Discussion question 2, which names the contrast, appears only if the facilitator picks it.
- **Why it matters:** In about half of classes (random draw → B), a plausible takeaway is "judges can cancel laws they think are wrong". Spec §1.3 item 1 says this qualification is "taught, not hidden".
- **Suggested fix (needs a spec decision):** In the Three-countries panel, add one plain consequence line per column for the "rights broken" ruling, whatever the class chose. For example: A *"Judges could only say it breaks rights; the law would stay"*; B/C *"Judges could cancel the section."* Alternatively, under B, show a faint note on the Strike-down card: *"Under Constitution A, this card would be locked."*

#### M7 — Skipping Act IV removes the No-case card, so the default "skip everything" path never teaches §1.3 item 4.
- **Reviewer:** learning designer.
- **Location:** `afterAct` `index.html:2300` (`IV: "gazette"`).
- **Evidence:** Browser all-skip run: Unseal → Clerk → Gazette. The Clerk's Act III choice (`m_lite` → LOOPHOLE) is exactly the case for the No-case card, yet it is never shown. The same happens on any LOOPHOLE path when only Act IV is skipped.
- **Suggested fix:** The No-case card is not a vote, so route the Act IV Clerk card to `nocase` when `moveResult === 'LOOPHOLE'` (≈ 30 s, per spec §4.4). Add the screen sequence to the enumeration test.

#### M8 — The learning outcome is never shown on screen; it exists only in the facilitator's script answer. [spec]
- **Reviewer:** learning designer.
- **Location:** Re-vote (`index.html:2981–2983`), Discussion, End (`index.html:2992–2998`); the only occurrence is `script.revote.a` (`index.html:1078–1080`).
- **Evidence:** The Re-vote shows Before/After counters with no reveal. The End screen shows title, subtitle and the DATA line. A class that runs short leaves with no explicit statement of "Parliament, the government and the courts all make law; the constitution decides who has the last word".
- **Suggested fix (needs a spec decision):** After the re-vote counts are entered, show one line: the §1.1 outcome sentence (it is the spec's own wording, so it is not new copy). Alternatively, put it on the End screen above the DATA line.

#### M9 — Timing: the `b_trust` path's Act II overruns its 4-minute slot, and the longest path leaves no slack in 30 minutes.
- **Reviewer:** learning designer. Details in §2.3. These are estimates.
- **Evidence:** With the full §2 rhythm, Act II with both votes ≈ 5:30 (slot 4:00). Act I's reading alone is ≈ 83 s (154 words of statute plus the script), against the rhythm's "read ≤ 60 s". The Title is ≈ 38 s against its 0:20 script timing. Act IV with Case 2 ≈ 8:10 (slot 8:00). Longest path ≈ 29–31 min before any off-script discussion.
- **Suggested fix:** Do not change copy in 7b. Make the spec's existing mitigation explicit in the script: on the `list` and `check` screens, change timing to "2:00 — skip partner talk if behind". Phase 8 rehearsal should time Act II on `b_trust` specifically.

#### M10 — The Three-branches script says "Every country has three branches." That is not in the spec and is not true as stated.
- **Reviewer:** accuracy auditor.
- **Location:** `index.html:1040` (`script.branches.say`, `authored: true`).
- **Evidence:** This is a real-world generalisation that `CLAUDE.md` forbids adding. Many states do not separate powers in this way, and in the UK the government sits inside Parliament.
- **Suggested fix:** "Veritas has three branches." or "Most countries share power between three branches."

#### M11 — The facilitator's answer to the lock question, and the spec §7.4 text it copies, say UK judges "can only say it breaks rights". Reinterpret is on screen at that moment. [spec]
- **Reviewer:** accuracy auditor.
- **Location:** `index.html:1060` (`script.case1.a`); spec §7.4.
- **Evidence:** Under A, the Case 1 screen offers Reinterpret, and spec §1.3 item 1 cites HRA s.3 (reading compatibly "so far as it is possible"). "Only" is therefore inaccurate (high confidence) and contradicts the option the class can see. "In this country … In the UK" also blurs Veritas and the UK.
- **Suggested fix (spec change):** *"In this constitution, Parliament is the highest law-maker. In the UK, judges can't cancel an Act. They can read it in a way that respects rights, or say publicly that it breaks them."* (≤ 40 words.)

#### M12 — Keyboard tally entry loses focus after every number, and → does nothing while a box has focus.
- **Reviewer:** classroom tester (keyboard only).
- **Location:** `change` handler `index.html:3266–3273` → `dispatch` → `patch` rebuilds the stage while the Tab is in flight.
- **Evidence:** Type a count in box A, then press Tab: focus goes to `BODY`, not to the next control. Pressing → while still in the box is ignored, because `typing` is true. Entering four counts by keyboard means tabbing from the top of the page each time (4+ presses per count).
- **Suggested fix:** Re-focus the next focusable control after the patch, or handle Tab by moving focus after the re-render. Alternatively, commit on `input` without re-rendering the strip. Let Enter in a tally box commit the value and blur, so that → works next.

#### M13 — LM4 (a business exploits a gap) fails silently when the class chooses "Follow the law".
- **Reviewer:** learning designer.
- **Location:** Act III result (`index.html:2896–2903`); `script.gap` (`index.html:1051–1053`).
- **Evidence:** `m_comply` → COMPLIED → Gazette "NEW ONLINE LAW STARTS TODAY". Nothing on any later screen shows that a gap existed (e.g. Glimmer Lite under `b_narrow`/`b_trust`). LM4 is lost, and Discussion question 3 ("Glimmer found a gap…") then becomes false.
- **Suggested fix:** Add a script line for the COMPLIED result: *"Was there a gap you could have used? Look at §1's exact words."* Hide Discussion question 3 (or reword it) when `moveResult === 'COMPLIED'`.

### Minor

| ID | Finding | Location | Evidence | Suggested fix |
|---|---|---|---|---|
| m1 | Gap-screen answer "Using a gap in the words is not breaking the law" is contradicted when Case 2 (purposive) finds Glimmer covered and fined | `index.html:1053` | Path `m_chat` → ARGUABLE → Read the purpose → "CAUGHT and fined" | "If the words really leave a gap, using it isn't breaking the law. But a court may decide the words cover you after all." |
| m2 | "The court closed the gap" (CLOSED_BY_COURT) conflicts with "only Parliament can close this gap" (No-case card, §1.3 item 4) | `index.html:890` | Purposive reading interprets unclear words; it does not close a gap | "The court read the law by its purpose. Glimmer is covered and fined." |
| m3 | Branches answer "Parliament is everyone we elect" (we also elect councils, mayors, and so on). "No" understates the overlap: UK ministers sit in Parliament | `index.html:1041` | Authored real-world claim | "No. Parliament debates and passes laws. The government is the ministers who run the country. In the UK, most ministers are also MPs." |
| m4 | Glossary "Act" ("becomes an Act once Parliament votes for it") and "Parliament" ("the people we elect") state Veritas simplifications as general facts (assent; unelected chambers) | `index.html:959, 961` | Spec §12 lists "no head-of-state assent", "one chamber" as Veritas simplifications | Prefix with "In Veritas," or add "(in Veritas)" |
| m5 | Spec §4.2 list consequences ("Messaging apps and games not covered", "Most apps covered") are never shown, so under `l_feeds` the class does not see why Glimmer Chat/Quest becomes ARGUABLE | `index.html:683–685`, `mondayNote` `2763` | grep: `lists.*.consequence` unused | Show the consequence on the list card or after the list vote (spec table column) |
| m6 | Case 2 "Read the words" text cites "main purpose", which appears only in `b_narrow`'s §1. Under `b_trust` the relevant words are the Minister's list ("Photo and video feed apps") [spec] | `index.html:780–781` | Students cannot find "main purpose" in the Trust Bill's Law Book | Per-bill wording, e.g. "It is now a messaging app, not a photo feed app. Not covered." |
| m7 | Law Book seals are a fixed 44–52 px with 0.45-unit strokes and read as pale discs; author is effectively shown by colour only in the Law Book | `index.html:339, 1849` | Screenshots at both viewports | Add the author word (PARLIAMENT / MINISTER / COURT) under each gutter seal |
| m8 | `--ink-2` on `--paper-2` is 6.15:1 (below the 7:1 body rule): "Claimant says"/"Government says" labels and the locked Strike-down card text | `index.html:226, 380` | Computed contrast | Use `--ink` for these, or `--paper-3` behind |
| m9 | Glossary links underline words inside the Gazette headline (COURT, PARLIAMENT) | `linkTerms` on stage incl. `.gz__headline` | Screenshot `void-gazette` | Exclude headings/headline from linking |
| m10 | `minority()` comment says "fewest (non-zero) votes"; code returns the largest losing option | `index.html:2411–2418` | Behaviour is reasonable (runner-up); the doc is wrong | Fix the comment, or decide which the spec means |
| m11 | Resume restores the clock from the last action, not the last moment on screen; minutes on a long screen are lost | `index.html:2565`, `persistAfter` | Reload after 2 s on a screen → "saved at Case 1, 00:00" | Save `elapsed` on an interval or on `visibilitychange`/`pagehide` |
| m12 | With counts entered, clicking a non-winning card is silently ignored | `index.html:2315` | Hint says "or click the winning card" only | Brief note "Counts say B wins" or flash the winner |
| m13 | When the glossary was opened from the keyboard, Escape leaves focus on the hidden drawer heading. → and digits still drive the game while the drawer is open | `renderGlossary` `index.html:2662–2671` | Keyboard run log | Return focus to the stage; ignore game keys while the drawer is open |
| m14 | The Title screen script timing is 0:20, but reading the two scenario paragraphs plus the "say" takes ≈ 38 s | `index.html:1033` | §2.3 | Retime to 0:40 (the Opening still fits 3:00) |
| m15 | Teacher-note claims "amended March 2026" and "messaging services with social-media features may still be covered" could not be verified by this reviewer [spec] | `index.html:981` | See §3, confidence low | Facilitator or author to confirm against the current Australian rules before use |
| m16 | "The Clerk of Parliament has decided" covers court rulings and ministerial rules too; a real Clerk is an impartial official who decides none of these [spec] | `index.html:846, 1070` | Possible misconception about officials | "…so the Clerk has decided this one (in Veritas, the Clerk stands in when time is short)." |
| m17 | "In real courts, judges who disagree can publish a dissent" is true of common-law apex courts and some others, not all (e.g. French courts do not publish dissents) [spec] | `index.html:828` | §3 | "In many real courts…" |
| m18 | Headline "JUDGES REWRITE THE RULES" frames rights-based interpretation in one side's terms of a contested debate [spec] | `index.html:880` | `CLAUDE.md` contested-question rule | "JUDGES NARROW THE LAW" |
| m19 | Act I "What this means" lines contain evaluative steers ("Precise and fair to apps") [spec] | `index.html:651, 660` | May bias the vote towards Bill 1 | Neutral wording, or accept as a deliberate nudge |
| m20 | DATA `hook=0,0,0,0` cannot distinguish "no counts entered" from a real zero tally | `toData` `index.html:1469` | Keyboard run with no counts | Write `none` when nothing was entered |

---

## 2. Learning designer

### 2.1 Screen-by-screen walk (as a 14-year-old with no prior knowledge)

| Screen | What a newcomer sees and likely concludes | Risk |
|---|---|---|
| Title | Imaginary country, sleep and social media, Glimmer. Clear hook. | Read-aloud over its slot (m14) |
| Hook vote | Four static cards; vote with cards; no answer. Works. | — |
| Three branches | Three seals, one line each; "you will be all three. And a business." | Script overgeneralises (M10) |
| Act I Bills | Three statutes; "What this means" lines make the trade-offs explicit. Good for a novice. | Long read (M9); evaluative lines (m19); tally strip below fold at 1280 (M2) |
| Act I result | Hemicycle fills, ENACTED lands. Strong "Parliament made this" moment. | — |
| Act II List | "You are now the Minister… you decide which apps go on it." Clear. | List consequences hidden (m5) |
| Act II Age check | Header "those rules are law too" + REGULATION — IN FORCE stamp. **LM1 (Minister) lands well.** | Stamp sub-line unreadable (M1) |
| Act III Gap | Strong prompt ("What did Parliament actually write?"). CAUGHT highlights the exact words: excellent. | Under `b_trust` the operative words are the Minister's, not Parliament's; COMPLIED loses LM4 (M13) |
| Act IV Unseal | Envelope cracks; constitution read aloud. **LM3 lands.** | — |
| Case 1 (A) | Locked Strike-down card with padlock and lock text is the clearest LM2 moment in the session. | Script answer inaccurate (M11); the Reinterpret outcome then undoes it (B1) |
| Case 1 (B) | Strike down available. | Risk of over-generalising (M6) |
| Case 1 result | Held line types out; precedent added with Court seal. **LM1 (courts) lands** via "Future courts must follow this". | "Decided 9 to 14" (M3) |
| Case 2 | Words vs purpose, well framed; script presents it as contested. | Incoherent after Strike down of §1 (B2); wording mismatch under `b_trust` (m6) |
| No-case card | Clear statement of §1.3 item 4. | Contradicted by B1 on the same screen; dropped by Skip IV (M7) |
| Clerk card | Clear, stamped, reasoned. | "Clerk of Parliament" decides court cases (m16) |
| Gazette | Headline + authorship row of seals + Law Book. **LM1's strongest moment** ("Parliament 3 · The Minister 1 · The Court 1"). | Overflows (M2); stamps unreadable (M1); B1/B2 contradictions surface here |
| Three countries | Clear table, live column boxed and starred, disclaimer. **LM3.** | Same-label rows for Uphold/Reinterpret (M6) |
| Re-vote | Before/After counters. | No reveal of the outcome (M8); script projects the answer (M5) |
| Discussion | One question fills the screen. | Q3 false on COMPLIED paths (M13) |
| End | DATA line, Copy, Restart. | — |

### 2.2 Learning moments: noticed? understood? where it fails

| LM | Noticed? | Understood? | Paths where it fails or can be misread |
|---|---|---|---|
| **LM1** All three branches make law | Yes: the stamps, seals and Gazette authorship count make it hard to miss. | Mostly. "Rules in force: Parliament 3 · Minister 1 · Court 1" is concrete. | Author seals in the Law Book are colour-only at projection size (m7). Court lines can fall below the fold on the Gazette at 1280×720 (M2). Under B2 paths the Minister's list counts as "in force" under a void section. |
| **LM2** Parliament's Act is not automatically final | Yes under A (lock) and B (VOID). | **At risk.** Under A + Reinterpret (Kim) the ban disappears, so it reads as cancellation (B1). Under B + Strike, Glimmer is still fined (B2). On Uphold paths it is only implied by the options. | A·Reinterpret·Kim (B1); B·Strike·§1 with an ARGUABLE move (B2); any Uphold path (M6). |
| **LM3** Countries allocate power differently | Yes: sealed envelope and Three-countries panel. | Partly. The table lists options, not consequences. | B classes may generalise "judges can cancel laws" (M6). Uphold/Reinterpret paths give identical "becomes" rows. |
| **LM4** Gaps can be exploited | Yes on Lite/Chat/Quest paths; the CAUGHT highlight is excellent. | Yes. | Lost entirely on `m_comply` (M13). On `b_tough` everything is CAUGHT (teaches the converse, acceptable). Skip IV hides the No-case explanation (M7). |
| Should I care? | Phones throughout; Discussion Q1. | Yes. | — |

### 2.3 Read-aloud estimates vs §2 slots (estimates, ±20%)

Basis: words a facilitator reads aloud = stage text (kicker and tally excluded) + the script's "say", at 130 wpm. Word counts were measured from the rendered page in Chromium. Full vote rhythm (§2) = read + 60 s partner + 10 s cards + 30 s minority + ≈ 15 s entry/stamp. Opening and closing votes have no partner talk. Law Book reading is shown separately, because Act III asks the class to read it.

| Screen | Stage words | Say words | Read-aloud | + Law Book | Script slot | With vote rhythm | Verdict |
|---|---|---|---|---|---|---|---|
| Title | 58 | 24 | 38 s | — | 0:20 | — | **Over slot** (m14); Opening still fits |
| Hook | 19 | 24 | 20 s | — | 1:30 | ≈ 0:45 | OK |
| Three branches | 47 | 30 | 36 s | — | 1:10 | — | OK |
| **Opening total** | | | | | **3:00** | ≈ 2:00 | OK |
| Act I Bills | 154 | 26 | **83 s** | — | 5:00 | ≈ 3:20 + result 0:20 | Fits slot; **read > 60 s rhythm** (M9) |
| Act II List (`b_trust`) | 42 | 24 | 30 s | +25 s | 2:00 | ≈ 2:40 incl. result | **Over** |
| Act II Age check | 46 | 29 | 35 s | +33 s | 2:00 (4:00 alone) | ≈ 2:50 incl. result | Over when paired with List |
| **Act II total, `b_trust`** | | | | | **4:00** | **≈ 5:30** (≈ 3:30 without partner talk) | **Over slot** (M9) |
| Act II total, other Bills | | | | | 4:00 | ≈ 2:50 | OK |
| Act III Gap | 51 | 22 | 34 s | +35–40 s (needed) | 4:00 | ≈ 3:10 + result 0:46 | **Tight** (≈ 3:55) |
| Act IV Unseal | 38–45 | 32 | 32–36 s | — | 1:00 | ≈ 0:45 | OK |
| Case 1 | 57–75 | 24 | 37–46 s | — | 4:00 | ≈ 2:45 + lock question 0:30 (A) + result 0:45–0:52 | **At slot** (≈ 4:00) |
| Case 2 | ≈ 50 | 25 | ≈ 35 s | — | 3:00 | ≈ 2:30 + result 0:40 | **Slightly over** (≈ 3:10) |
| No-case card | 21 | 23 | 20 s | — | 0:30 | — | OK |
| **Act IV total (with Case 2)** | | | | | **8:00** | **≈ 8:10** | Tight/over |
| Gazette | 126–153 | 28 | 71–84 s | (Law Book is in stage text) | 1:30 | — | OK if not every line is read |
| Three countries | 85–89 | 21 | 49–51 s | — | 1:30 | — | OK |
| **Monday total** | | | | | **3:00** | ≈ 2:30–3:00 | Tight |
| Re-vote | 19 | 18 | 17 s | — | 1:30 | ≈ 1:00 | OK |
| Discussion | 60 → 27 | 17 | 36 s | — | 1:30 | + 30 s pairs + ≈ 60 s answers ≈ 2:05 | **Over** (≈ 2:05) |
| **Close total** | | | | | **3:00** | ≈ 3:05 | At slot |
| Clerk card | ≈ 40 | 27 | ≈ 30 s | — | 0:20 | — | Over its 20 s (minor) |

**Longest path** (`b_trust` · `l_feeds` · any check · `m_chat`/`m_quest` → Case 2; 8 votes): ≈ 2:00 + 3:40 + 5:30 + 3:55 + 8:10 + 2:45 + 3:05 ≈ **29:05**. Screen transitions and animations add ≈ 1 min across ≈ 22 screens, giving **≈ 30 min with no slack**. Any real discussion, or a single slow tally, pushes it over. Phase 8 should rehearse this path.

---

## 3. Accuracy auditor

Status key: **Matches spec** (verbatim or faithful to spec §1.3/§5/§12); **Not in spec** (authored claim); **Possibly inaccurate**. Confidence is the reviewer's confidence in the status given.

### 3.1 Legal and factual claims in CONTENT

| # | Location (CONTENT key) | Claim | Status | Reason | Conf. |
|---|---|---|---|---|---|
| 1 | `branches.items` | Parliament = people we elect, pass Acts; government = ministers who put laws into action; courts decide what the law means | Matches spec | §4.0 verbatim | High |
| 2 | `minister.header` | The Minister's detailed rules are "law too" | Matches spec | §4.2; consistent with §1.3 item 2 | High |
| 3 | `bills.*` | Bill texts and "What this means" | Matches spec | §4.1 verbatim; evaluative lines noted (m19) | High |
| 4 | `constitutions.A.summary` | Judges must apply every Act; may read compatibly or declare; cannot cancel | Matches spec | §5; accurate as a loose model of the HRA 1998 ss.3–4 | High |
| 5 | `constitutions.B.summary` | Judges can cancel any law, even an Act, that breaks the written Constitution | Matches spec | §5. US courts formally decline to apply rather than "cancel"; "loosely inspired" covers it | Medium |
| 6 | `constitutions.C.summary` | Elected President leads the government; decrees without Parliament in some areas; Constitutional Council can cancel Acts | Matches spec / possibly inaccurate in detail | In France the Prime Minister heads the government (the President presides over the Council of Ministers). Art. 37 regulatory power is right. Acceptable under "loosely inspired" | Medium |
| 7 | `rulings.*`, `lockText` | Ruling glosses; "In this constitution, judges cannot cancel an Act of Parliament." | Matches spec | §4.4 verbatim | High |
| 8 | `rulings.declare.result` | "Only Parliament can change it." | Matches spec | §4.4; accurate for s.4 HRA | High |
| 9 | `cases.*` | Facts, arguments, reinterpret texts | Matches spec | §4.4 verbatim. **But the Kim reinterpret text replaces the rule (B1)** | High |
| 10 | `noCase` | Judges apply the words; only Parliament can close a clear gap | Matches spec | §4.4, §1.3 item 4 | High |
| 11 | `precedent` | Every ruling binds future Veritas courts | Matches spec | §4.4; qualified "in Veritas"; §1.3 item 3 | High |
| 12 | `dissent` | "In real courts, judges who disagree can publish a dissent." | Matches spec · possibly inaccurate | Not universal (e.g. French courts do not publish dissents) (m17) | Medium |
| 13 | `clerk.script` | "the Clerk of Parliament has decided this one" | Matches spec · possibly misleading | Real Clerks are impartial officials (m16) | Medium |
| 14 | `headlines.REINTERPRETED` | "JUDGES REWRITE THE RULES" | Matches spec · contested framing | m18 | Medium |
| 15 | `countries.options/ageCheck` | A: Uphold/Reinterpret/Declare; B and C: Uphold/Reinterpret/Strike down; C government can make some rules by decree without an Act | Matches spec | §4.5. In France, ordinary courts cannot strike down; only the Constitutional Council can (by referral). Labelled, so acceptable | Medium |
| 16 | `disclaimer` | Veritas is imaginary; real countries are more complicated | Matches spec | §4.5 | High |
| 17 | `close.discussion[1]` | "Who should have the last word — the people you elect, or judges you don't?" | Matches spec | Posed as an open question (not settled). The "judges you don't [elect]" framing is not true of all systems (some US state judges are elected), but it is fine for Veritas | Medium |
| 18 | `checks.*.consequence` | Tick box ineffective; face scan errs; ID exposes adults | Matches spec | §4.2 | High |

### 3.2 Teacher notes (§12 and §1.3), as rendered

| # | Claim | Status | Reason | Conf. |
|---|---|---|---|---|
| T1 | UK courts cannot cancel Acts; HRA 1998 ss.3–4 | Matches spec; accurate | ss.3–4 HRA | High |
| T2 | Courts can quash ministers' rules that exceed their powers, e.g. *R (Public Law Project) v Lord Chancellor* [2016] UKSC 39 | Matches spec; accurate to my knowledge | Residence-test order held ultra vires | Medium-high |
| T3 | *Marbury v Madison* (1803): the Supreme Court asserts power to review Acts of Congress | Matches spec; accurate | — | High |
| T4 | Germany's Federal Constitutional Court can declare statutes void | Matches spec; accurate | It can also declare them merely incompatible; B's "Declare incompatible not offered" is a Veritas simplification | High |
| T5 | France: Art. 34 / Art. 37 division; Constitutional Council review Art. 61; Art. 61-1 since 2010 | Matches spec; accurate | QPC in force 1 March 2010 | High |
| T6 | *Donoghue v Stevenson* [1932] AC 562 created the modern law of negligence | Matches spec; accurate (conventional summary) | — | High |
| T7 | Australia's Online Safety Amendment (Social Media Minimum Age) Act 2024: "reasonable steps"; penalties on platforms, not children or parents | Matches spec; accurate to my knowledge | — | Medium-high |
| T8 | "Ministerial rules (2025, amended March 2026) excluded … online gaming and standalone messaging — though messaging services with social-media features may still be covered" | Matches spec · **unverified** | I cannot confirm the March 2026 amendment or the exact scope of the messaging carve-out (m15) | **Low** |
| T9 | Simplifications: one chamber, no assent, no appeals, no international law; whether judges or representatives *should* have the last word is unresolved | Matches spec | Correctly presents the debate as open | High |
| T10 | §1.3 items 1–4 | Matches spec; accurate | — | High |

### 3.3 `authored: true` items

| Block | Items | Verdict |
|---|---|---|
| `regulations` | Law Book wording for each list and check | Faithful to §4.2. OK |
| `caught` | Highlighted words; each is an exact substring (verified by tests) | OK |
| `actExtra`, `clerkExtra`, `closeExtra`, `nav`, `setupExtra`, `ui`, `screens`, `resume`, `teacherExtra`, `printCards`, `seals`, `gallery` | Interface labels and hints | No legal claims. British spelling. Sentences ≤ 20 words (checked by script). OK |
| `held` | "§n stands" / "must be read more narrowly, to respect rights" / "breaks rights, but it stays in force" / "is struck down" / "{app} is (not) covered by the Act[, because its real purpose is the same]" | Accurate to the rulings. Under `b_trust`, coverage comes via the Minister's list rather than the Act's words directly; acceptable |
| `voteExtra.tie` | "The facilitator chooses one of the tied cards." | Matches §6 ("Speaker's casting vote") |
| `glimmerStatus` | COMPLIED / CAUGHT / LOOPHOLE / CLOSED_BY_COURT lines | CLOSED_BY_COURT conflicts with §1.3 item 4 (m2), and is false after §1 is void (B2) |
| `gazetteExtra.overreach` | "under-16s cannot have accounts on homework apps either" | Faithful to §4.2 `l_all` |
| `countriesExtra` | Case 2 row label; "✱ The constitution Veritas has today." | OK |
| `glossary` (12) | Definitions | Accurate; "Strike down… Only some countries allow this" and "Precedent… Veritas works this way" are well qualified. **Act** and **Parliament** state Veritas simplifications generally (m4) |
| `script.setup/title/hook/bills/list/check/unseal/countries/revote/discussion/end/clerk/gazette/nocase/case2` | Say / Q / A | Accurate. "Which way is right? Judges disagree…" and "So which country does it best? That is a real debate…" present contested questions as contested, which is good. `list.a` ("Yes, when an Act gives them the power") is right for Veritas; it under-describes C's decree power, which the Three-countries panel covers |
| `script.branches` | "Every country has three branches." / "Parliament is everyone we elect." | **Not in spec, possibly inaccurate** (M10, m3) |
| `script.gap.a` | "Using a gap in the words is not breaking the law." | **Possibly inaccurate** on ARGUABLE paths (m1) |
| `script.case1.a` (spec verbatim, not authored) | "…they can only say it breaks rights." | **Possibly inaccurate**: omits s.3 reading (M11) |
| `script.case1.qB/aB` | "Not every country lets judges do this." | Accurate and well qualified |

**Unmarked authored copy:** none found. Every unmarked string traces to the spec, including `cases.claimantSays`/`governmentSays` (§4.4 table headers) and `bills.question` (§2 Votes column).

### 3.4 Contested questions presented as settled
- Not found in the authored script: Case 2, Countries and Discussion all present the debate as open. Good.
- Framing that leans one way: the "JUDGES REWRITE THE RULES" headline (m18), and the Act I "What this means" evaluations (m19). Both are spec copy.
- The No-case line "Judges apply the words — only Parliament can close this gap" is presented as settled. It matches §1.3 item 4 and is a fair statement of principle. In practice, the literal/purposive boundary is itself debated, which the Case 2 script acknowledges.

---

## 4. Classroom tester

### 4.1 Sessions run (Chromium, `file://`)

| Run | Constitution · path | Viewports | Reached End | Console errors |
|---|---|---|---|---|
| 1 | A · `b_narrow` · `k_face` · `m_lite` · Reinterpret (split 14–8) · No-case | 1280×720, 1920×1080 | Yes | 0 |
| 2 | A · `b_trust` · `l_feeds` · `k_id` · `m_chat` · Declare (split) · Read the words | both | Yes | 0 |
| 3 | B · `b_tough` · `k_tick` · `m_quest` · Strike (Marlow) | both | Yes | 0 |
| 4 | B · `b_trust` · `l_all` · `k_face` · `m_comply` · Uphold | both | Yes | 0 |
| 5 | B · `b_narrow` · `k_id`/`k_face` · `m_chat` · Strike · Read the purpose (B2 path) | both | Yes | 0 |
| 6 | Keyboard only (Tab to Start, digits, →, ←, K, S, G, Esc, Space) | 1280×720 | Yes | 0 |
| 7 | Back from End to Setup, every screen | 1280×720 | 23 Backs retrace all 16 forward screens, incl. vote un-decide steps | 0 |
| 8 | Skip Act: 16 patterns × A/B × 3 choice sets, start-of-act and part-way; Back after every skip, then skip again | 1280×720, reduced motion | 168/168 | 0 |
| 9 | Ties and splits (Act I 5–5–2; Case 1 6–8–9, 0–7–7, 0–0–20) | 1280×720 | Yes | 0 |
| 10 | Storage getter throws; `setItem` throws; Resume after reload; R restart | 1280×720 | Yes | 0 |
| 11 | Dark theme at 1280×720; light at 1024×768 | — | Yes | 0 (no horizontal scroll) |

### 4.2 Behaviour confirmed working
- Conditional screens: List only for `b_trust`; Case 2 only when ARGUABLE; No-case only for LOOPHOLE (when Act IV is not skipped).
- Strike down under A is visible, padlocked, not selectable by click or key 4, and shows the exact lock text. Declare incompatible is absent under B.
- Ties: → shows "Speaker's casting vote"; only tied cards can be clicked; a non-tied click is ignored.
- Unanimous vote shows "Everyone agreed…" with no split line.
- Skip is unavailable on the sealed Unseal screen until the seal is broken; K then confirms; Act IV confirmation carries "Not recommended".
- Back after every skip restored the identical pre-skip screen and Law Book (168/168).
- Space on a focused Next button advances once, not twice.
- A glossary term inside an option card opens the drawer without selecting the card.
- DATA: `|` in the class label is escaped (`9X%7Ctest`); no network requests.
- Storage blocked or full: the app runs to End silently. Resume returns to the same screen with history intact. Restart clears the save.
- Reduced motion: stamps fade only; other motion is off.
- Print: one A4 sheet, four cards (A square, B circle, C triangle, D diamond), letter reversed out of solid black shapes; prints in black and white.

### 4.3 Measurements

| Item | 1280×720 | 1920×1080 | Target |
|---|---|---|---|
| Body text | 20.7 px | 28 px | ≥ 20 px at 1280×720 ✔ |
| Option-card text | 20.7 px | 28 px | ≥ 26 px at 1920×1080 ✔ |
| Smallest UI text (plate kicker, footer hint, DATA line) | 15.5–17.6 px | 21–23.8 px | Secondary text; acceptable |
| Law Book stamp, first line | 11–15 px | 15–20 px | **Too small** (M1) |
| Law Book stamp, second line ("STILL IN FORCE", "IN FORCE") | **6.6–8.9 px** | 8.9–12 px | **Illegible** (M1) |
| Law Book gutter seal | 44–52 px fixed | 44–52 px fixed | Pale; author not readable (m7) |
| Light-mode body contrast (`--ink` on `--paper`) | 13.4:1 | | ≥ 7:1 ✔ |
| `--ink-2` on `--paper` / on `--paper-2` | 7.2:1 / **6.15:1** | | m8 |
| Vertical overflow | 13 screen states overflow 11–201 px | Case 2 result 46 px | **None expected** (M2) |
| Horizontal overflow at 1024 px | 0 | | 0 ✔ |

### 4.4 Dead ends
None. Every scripted and enumerated path reached End. The only "stuck" states are by design: a vote screen with no counts and no click, where → does nothing and the footer hint explains what to do, and a sealed Unseal screen until → breaks the seal.

---

## 5. Spec changes proposed (for the author; do not apply in 7b without a decision)

1. §4.4 Kim "Reinterpret" text and the "Reinterpret replaces … that section" rule: keep a prohibition and show the narrowing (B1).
2. §4.4 / §7.5: no Case 2 (and adjust the Clerk's Act IV rule) when Case 1 voids the section Case 2 depends on. Define Glimmer's status in that case (B2).
3. §4.5: one consequence line per constitution in the Three-countries panel (M6).
4. §4.6: show the §1.1 outcome sentence after the re-vote or on End (M8).
5. §7.4: correct the lock-question answer to include reading compatibly (M11).
6. §4.4 Case 2 "Read the words" wording per Bill (m6); §4.5.1 REINTERPRETED headline (m18); `dissent` and Clerk lines (m16, m17).
7. §12: re-verify the Australian ministerial-rules detail (m15).
8. §4.2: say where the List consequences appear (m5).
