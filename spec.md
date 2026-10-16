# The Republic of Veritas
### *Who makes the law? Should I care?*

**Specification v2.0 — 16 October 2026** (replaces v1.0 entirely)
Whole-class projected simulation · high-school students (approx. 14–17), no prior knowledge · 30 minutes · single self-contained HTML file

---

## 1. Purpose

### 1.1 Learning outcome
> **Law is made by more than one branch of government — Parliament, the government and the courts — and a country's constitution decides who has the last word.**

### 1.2 Learning moments

| # | Moment | Where it happens |
|---|---|---|
| LM1 | All three branches make law | Act II (the Minister writes a rule), Act IV (judges' rulings become precedent), Monday Morning (every rule sealed by its author) |
| LM2 | A law passed by Parliament is not automatically valid or final | Act IV: the court may strike down or reinterpret the Act — or find it is not allowed to |
| LM3 | Countries give law-making power to different people | Sealed constitution opened before the court sits; "Same choices, three countries" panel |
| LM4 | Gaps in the law can be used by a clever business | Act III: the class plays Glimmer's board and hunts for a gap in the words |
| — | Should I care? | The law is about the students' own phones; opening and closing votes |

### 1.3 Accuracy qualifications (taught, not hidden)
1. **Courts cannot cancel Acts of Parliament everywhere.** In the UK, courts must read legislation compatibly with Convention rights "so far as it is possible" (Human Rights Act 1998, s.3) or may declare it incompatible (s.4); the Act stays in force. Constitution A models this.
2. **The executive usually makes law only with permission** — from an Act (e.g. UK statutory instruments) or a constitution. In Veritas, every rule the Minister makes is made under a power in the Act.
3. **Binding judge-made precedent is a common-law feature** (UK, USA, Canada, Australia). In civil-law systems court decisions are influential but not formally binding in the same way. Veritas follows precedent; teacher notes say so.
4. **Judges cannot rewrite clear words.** When an Act's words plainly leave a gap, closing it is Parliament's job. Act III/IV models this.

### 1.4 Design principles
- **One class, one republic.** No teams. The whole class plays each branch in turn.
- **One decision per screen.** Every vote is a single choice from 2–4 cards.
- **Everyone votes every time.** Simultaneous show of voting cards (§7.2); no one waits.
- **Consequences appear immediately** as stamps on a single living document: the Law Book.
- **No scores or invented statistics.** Outcomes are shown as law, not numbers.

---

## 2. Run of show

| # | Act | Class plays | Votes | Min | Running |
|---|---|---|---|---|---|
| 0 | Opening: the question and the three branches | Themselves | Hook vote | 3 | 3 |
| 1 | Make the law | Members of Parliament | Choose a Bill | 5 | 8 |
| 2 | Run the law | The Minister | Age-check rule (+ app list if Bill 3) | 4 | 12 |
| 3 | Find the gap | Glimmer's board | Glimmer's move | 4 | 16 |
| 4 | Judge the law | Supreme Court judges | Unseal constitution; Case 1; Case 2 if arguable | 8 | 24 |
| 5 | Monday Morning | Citizens | — | 3 | 27 |
| 6 | Close | Themselves | Re-vote; one "Should I care?" question | 3 | 30 |

Maximum 8 votes. Each full vote follows the same rhythm: **read (≤ 60 s) → talk to a partner (60 s) → show cards on "3, 2, 1" (10 s) → hear one minority voice (30 s) → facilitator enters result → stamp.** Opening and closing votes skip partner talk.

**Timing honesty:** these timings are a first-run estimate and are tight. The build includes a timed rehearsal (build plan Phase 8). If a class runs long, the facilitator may skip partner talk on Acts II and III.

---

## 3. The scenario

Veritas's Chief Medical Officer reports that teenagers are sleeping less and feeling worse. Many parents blame social media. Parliament has promised to act. The class decides what happens next.

**Glimmer** is Veritas's most popular photo-feed app, owned by Veritas Ventures Ltd. Many of its users are under 16.

---

## 4. Act by act

### 4.0 Opening (3 min)
- **S0 Title:** "The Republic of Veritas — Who makes the law? Should I care?"
- **S1 Hook vote (quick):** "In a country like ours, who makes the law?"
  A. Only Parliament · B. Parliament and the government · C. Parliament, the government and judges · D. Not sure
  Facilitator enters the tally (counts per option). Stored for the closing comparison. No answer revealed.
- **S2 The three branches:** three seals, one line each:
  - **Parliament** — the people we elect. They debate and pass laws called Acts.
  - **The government** — ministers who run the country and put laws into action.
  - **The courts** — judges who decide what the law means when people disagree.
  Closing line: "Today, you will be all three. And a business."

### 4.1 Act I — Make the law (5 min)
Screen: three Bill cards side by side, each set as a short statute with a title, two sections and one "What this means" line. The class votes. On the result, the chosen Bill moves into the Law Book, a hemicycle of seats fills, and **ENACTED** stamps across it.

| ID | Bill | §1 The rule | §2 Enforcement | Every Bill also says | What this means |
|---|---|---|---|---|---|
| `b_narrow` | The Clear Lines Bill | "Under-16s may not have an account on an app whose main purpose is posting things for the public to see." | "Apps that break this rule are fined." | §3 "The Minister will decide how apps check users' ages." | "Precise and fair to apps — but only covers apps that are mainly about posting." |
| `b_tough` | The Tough Bill | "Under-16s may not use any app that lets users share things with other users." | "An under-16 who breaks this rule commits a crime." | §3 (same) | "Catches almost everything — including homework apps — and makes rule-breaking children criminals." |
| `b_trust` | The Trust the Minister Bill | "Under-16s may not have an account on any app on the Minister's official list." | "Apps that break this rule are fined." | §3 (same) | "Parliament hands the Minister the power to decide which apps count." |

### 4.2 Act II — Run the law (4 min)
Screen header: "Parliament has passed the Act. Now the Minister makes the detailed rules — and those rules are law too." Each rule the class chooses is added to the Law Book with the **Ministry seal** and stamped **REGULATION — IN FORCE**.

**Vote A (only if `b_trust`): Which apps go on the list?**

| ID | Option | Consequence |
|---|---|---|
| `l_feeds` | Photo and video feed apps | Messaging apps and games not covered |
| `l_wide` | Feed apps, messaging apps and games | Most apps covered |
| `l_all` | Every app where users share things — including homework apps | Everything covered; overreach noted in Monday Morning |

**Vote B (always): How must apps check users' ages?**

| ID | Option | Consequence (shown in Monday Morning) |
|---|---|---|
| `k_tick` | Users tick a box saying they are 16 or over | "The law exists on paper. Any 12-year-old can tick a box." |
| `k_face` | A face scan estimates the user's age | "Most under-16s are stopped. Some 17-year-olds are wrongly blocked." |
| `k_id` | Every user, of any age, uploads ID | "Under-16s are stopped. Millions of adults hand over their passport details. Sam Okafor, 34, is preparing a court case." (not heard today) |

### 4.3 Act III — Find the gap (4 min)
Screen: the Law Book on the left, large; Glimmer's boardroom on the right. Prompt: **"You are Glimmer's board. Lawyers earn their money by reading the exact words. What did Parliament actually write?"** Four move cards; the class votes.

| ID | Move | `b_narrow` | `b_tough` | `b_trust` |
|---|---|---|---|---|
| `m_comply` | Follow the law: close under-16 accounts | COMPLIED | COMPLIED | COMPLIED (every list option includes feed apps) |
| `m_chat` | Relaunch as *Glimmer Chat*, "a messaging app" — same photo feed inside | ARGUABLE → Case 2 | CAUGHT | `l_feeds`: ARGUABLE → Case 2 · `l_wide`/`l_all`: CAUGHT |
| `m_quest` | Put the feed inside a game, *Glimmer Quest* | ARGUABLE → Case 2 | CAUGHT | `l_feeds`: ARGUABLE → Case 2 · `l_wide`/`l_all`: CAUGHT |
| `m_lite` | *Glimmer Lite*: no accounts — anyone can scroll without signing up | LOOPHOLE (clear) | CAUGHT | LOOPHOLE (clear) |

Stamps land immediately: **LOOPHOLE**, **ARGUABLE — SEE YOU IN COURT**, **CAUGHT** (with the words that caught them highlighted in the Law Book), or **COMPLIED**.

Why `m_lite` works: Bills 1 and 3 ban *accounts*; Glimmer Lite has none. Bill 2 bans *use*, so it is caught. This is the cleanest demonstration that the exact words matter.

### 4.4 Act IV — Judge the law (8 min)

**Unsealing (1 min).** A wax-sealed envelope cracks open, revealing Veritas's constitution. Live constitution is **A or B** (§5), drawn with the seeded PRNG unless the facilitator chose one at setup. The facilitator reads the summary aloud and says: *"Parliament, you passed your Act. Now we find out how much power the judges have over it."*

**Case 1 — the rights challenge (always heard, 4 min).**

| Bill | Case | Facts | Claimant says | Government says | "Reinterpret" text |
|---|---|---|---|---|---|
| `b_tough` | *Marlow v Attorney General* | Jo Marlow, 15, was charged with a crime for using a photo app. | "A criminal record at 15 can follow you for life. The punishment doesn't fit." | "Parliament was elected to protect children. Without a real penalty, the rule means nothing." | "Only deliberate, repeated rule-breaking after a written warning is a crime." |
| `b_narrow`, `b_trust` | *Kim v Attorney General* | Rae Kim, 15, runs a popular wildlife-photo account. It has been closed. | "Young people have a right to express themselves and join communities." | "Parliament judged the harm to children to be greater." | "Under-16s may still have accounts that only post to approved school or club groups." |

*Marlow* challenges §2 (the crime); *Kim* challenges §1 (the rule). Reinterpret keeps that section's words and adds the court's reading beneath them ("Read by the Court: …"), so the change shows as a narrowing; Strike down voids that section only.

Ruling options:

| Option | A — Sovereign Parliament | B — Guardian Court | Result |
|---|---|---|---|
| **Uphold** — the law stands | ✓ | ✓ | Act stamped IN FORCE |
| **Reinterpret** — read the law more narrowly so it respects rights | ✓ | ✓ | §1 or §2 keeps its words, with the court's reading beneath; stamped REINTERPRETED |
| **Declare incompatible** — say publicly it breaks rights, but it stays | ✓ | not offered | Stamped INCOMPATIBLE — STILL IN FORCE; line: "Only Parliament can change it." |
| **Strike down** — cancel the section | 🔒 "In this constitution, judges cannot cancel an Act of Parliament." | ✓ | Section stamped VOID |

The locked option stays visible under A. The facilitator asks: *"Why can't you press that?"*

**Case 2 — the loophole (only if Act III was ARGUABLE and §1 still stands, 3 min).** *Minister for Digital Affairs v Veritas Ventures Ltd*: "Glimmer now calls itself a messaging app / game — with the same photo feed. Is it covered by the law?"
- **Read the words** (literal): "Its main purpose is now messaging/gaming. Not covered." → LOOPHOLE stays open.
- **Read the purpose** (purposive): "Everyone knows what this app is really for. Covered." → Glimmer CAUGHT and fined.

If Act III was a clear LOOPHOLE (`m_lite`), show a single card instead (30 s): **"No case. The words are clear: Glimmer Lite has no accounts. Judges apply the words — only Parliament can close this gap."** If Case 1 struck down §1 and Act III was ARGUABLE or a LOOPHOLE, show a single card instead: **"No case. §1 is void, so there is no rule for Glimmer to break."** §2 and any Minister's list are then noted "No effect while §1 is void.", and Glimmer's status is NO RULE TO BREAK. If Act III was CAUGHT or COMPLIED, skip Case 2.

**Precedent:** every ruling, including Uphold, is written onto the case folder in typewriter type and added to the Law Book with the **Court seal**: *"[Case name] — Held: {ruling}. Future courts in Veritas must follow this."*

**Judges' split:** if the vote was not unanimous, show "Decided {n} to {m}" and invite one dissenting voice: *"In real courts, judges who disagree can publish a dissent."*

### 4.5 Monday Morning (3 min)
**The Veritas Gazette** front page: masthead, headline (§4.5.1), and the Law Book as it actually stands below the fold. Every line carries its author's seal and its status stamp. Struck rows remain visible, crossed through.

Beneath it, the **authorship line**: *"Rules in force in Veritas this morning: Parliament {a} · The Minister {b} · The Court {c}."* rendered as a row of seals. Glimmer's status is shown as a separate marginal note (business is not a law-maker).

Then the **"Same choices, three countries"** panel: one row per ruling the class made, three columns.

| | A — Sovereign Parliament (UK-like) | B — Guardian Court (US/Germany-like) | C — Strong President (France-like) |
|---|---|---|---|
| What the court could do with Case 1 | Uphold / Reinterpret / Declare incompatible | Uphold / Reinterpret / Strike down | Uphold / Reinterpret / Strike down (Constitutional Council) |
| What the class's choice becomes | mapped (§6) | mapped (§6) | mapped (§6) |
| If the judges think Case 1's law breaks rights | They can say so publicly, but the law stays in force | They can cancel that part of the law | The Constitutional Council can cancel that part of the law |
| Who could have made the age-check rule | The Minister, because the Act allowed it | The Minister, because the Act allowed it | The government — and in some areas it can make rules by decree without an Act |

The live constitution column is highlighted. Footer: *"Veritas is imaginary. Real countries are more complicated."*

#### 4.5.1 Headline priority
VOID → "COURT CANCELS PARLIAMENT'S LAW" · INCOMPATIBLE → "JUDGES: LAW BREAKS RIGHTS — BUT IT STAYS" · LOOPHOLE open → "GLIMMER SLIPS THROUGH THE NET" · REINTERPRETED → "JUDGES REWRITE THE RULES" · CAUGHT → "GLIMMER CAUGHT OUT" · otherwise → "NEW ONLINE LAW STARTS TODAY".

### 4.6 Close (3 min)
1. **Re-vote** the opening question. Show both tallies side by side as two rows of counters. (The intended shift is towards C.)
2. **One discussion question** (facilitator picks one of three):
   - "Count the seals. Who wrote the law that applies to you this morning?"
   - "In one country the judges could cancel Parliament's law; in another they couldn't. Who should have the last word — the people you elect, or judges you don't?"
   - "Glimmer found a gap. Was it legal? Was it fair? Whose job is it to close it?"
3. End screen with the learning outcome (§1.1, verbatim), Restart and the DATA line.

---

## 5. Constitutions

| ID | Name | On-screen summary (read aloud) |
|---|---|---|
| A | **The Sovereign Parliament** (loosely inspired by the UK) | "Parliament is the highest law-maker. Judges must apply every Act. They can read an Act in a way that respects rights, and they can say publicly that it breaks rights — but they cannot cancel it." |
| B | **The Guardian Court** (loosely inspired by the USA and Germany) | "Veritas has a written Constitution, and it is the highest law. Judges can cancel — 'strike down' — any law that breaks it, even an Act of Parliament." |
| C | **The Strong President** (loosely inspired by France) — *comparison only, never live* | "An elected President leads the government, which can make some rules by decree without a vote in Parliament. A Constitutional Council can cancel Acts that break the Constitution." |

C is excluded from the live draw because, in this flow, its difference (decree power) would not change any decision the class makes. It appears only in the comparison panel.

---

## 6. Model

Deterministic and small. All functions are pure and live between `/* MODEL:START */` and `/* MODEL:END */`.

```
state = {
  seed, constitution: 'A'|'B', sealed: boolean,
  hook: {A,B,C,D}, revote: {A,B,C,D},
  bill: 'b_narrow'|'b_tough'|'b_trust',
  list: 'l_feeds'|'l_wide'|'l_all'|null,
  check: 'k_tick'|'k_face'|'k_id',
  move: 'm_comply'|'m_chat'|'m_quest'|'m_lite',
  moveResult: 'COMPLIED'|'CAUGHT'|'LOOPHOLE'|'ARGUABLE',
  case1: { id, ruling: 'uphold'|'reinterpret'|'declare'|'strike', split?: [for, against] },
  case2: { ruling: 'literal'|'purposive', split? } | null,
  screen, history[]
}
```

Functions:
- `moveResult(bill, list, move)` — the table in §4.3.
- `case1For(bill)` — Marlow or Kim.
- `rulingOptions(constitution)` — §4.4 table, with `locked` and `lockReason`.
- `lawBook(state)` — ordered provisions `{id, author: 'PARL'|'MIN'|'COURT', text, status}`; statuses: `ENACTED`, `IN_FORCE`, `REINTERPRETED`, `INCOMPATIBLE_IN_FORCE`, `VOID`, `REGULATION_IN_FORCE`, `PRECEDENT`.
- `authorship(lawBook)` — counts of live rules by author (exclude VOID).
- `glimmerStatus(state)` — final: COMPLIED, CAUGHT, LOOPHOLE (open), CLOSED BY COURT, NO RULE TO BREAK (§1 void).
- `headline(state)` — §4.5.1.
- `threeCountries(state)` — for each of A, B, C: available options and the mapped outcome. Mapping by intent: Uphold → Uphold; Reinterpret → Reinterpret; Declare incompatible (A) ↔ Strike down (B, C) — both are "the judges think this law breaks rights". Case 2 is unchanged across constitutions (interpretation is available in all three).
- `autoDecide(act, state)` — returns the §7.5 decisions for the remaining votes in that act, given choices already made.
- `toData(state)` / `parseData(line)`.

`state` also holds `skipped: Set<'I'|'II'|'III'|'IV'>`, and each auto-decided choice is flagged `byClerk: true`.

Ties in any vote: the facilitator's choice ("the Speaker's casting vote").

---

## 7. Classroom mechanics

### 7.1 Facilitator entry
Each vote screen shows the option cards and a compact tally strip: one number box per option (+/− buttons, keyboard digits). The facilitator may enter counts or simply click the winning card. The highest count wins; ties prompt "Speaker's casting vote".

### 7.2 Voting cards (print view)
One A4 sheet per student, cut into four cards: **A** (square), **B** (circle), **C** (triangle), **D** (diamond). Each card carries its letter *and* shape, so colour is never needed. Students raise one card on "3, 2, 1". Fallback: fingers 1–4.

### 7.3 Minority voice
After each full vote, the screen shows: *"Hear from someone who voted {minority option}."* If the vote was unanimous: *"Everyone agreed. Can anyone argue the other side?"*

### 7.4 Facilitator script
Each screen has a collapsible script panel (key S) with: what to say (≤ 40 words), timing for that screen, and one likely student question with a short answer. Example for the Act IV lock: *Q: "Why can't the judges just cancel it?" A: "In this constitution, Parliament is the highest law-maker. In the UK, judges can't cancel an Act. They can read it in a way that respects rights, or say publicly that it breaks them."*

### 7.5 Skip Act
For when time is tight. Every Act screen (Acts I–IV) shows a small **"Skip act — the Clerk decides"** button in the footer (key K). One press, with a one-step confirmation ("Skip Act III? The Clerk will choose for the class."), auto-decides **every remaining vote in that act** and shows a single result card. Then the session continues as normal.

**Result card (≈ 20 s):** the Clerk's seal, the decision(s) taken, a one-line reason, and a **DECIDED BY THE CLERK** stamp. The same stamp marks those lines in the Law Book through to Monday Morning. Script line: *"We're short of time, so the Clerk of Parliament has decided this one. In real life, if you don't take part, someone else decides for you."*

**Auto-decisions** are fixed (not random) and chosen to keep every learning moment visible:

| Act | Auto-decision | Reason it is chosen | Time saved (approx.) |
|---|---|---|---|
| I — Make the law | `b_narrow` (Clear Lines Bill) | Leaves a gap for Act III and produces the *Kim* rights case | 4 min |
| II — Run the law | List: `l_feeds` (only if `b_trust`) · Check: `k_face` | Keeps the Minister's rule visibly in the Law Book without adding a privacy subplot | 3 min |
| III — Find the gap | `m_lite` if it is LOOPHOLE under the current Bill; otherwise `m_chat` | Prefers a clear loophole, which also removes Case 2 and saves more time | 3 min |
| IV — Judge the law | Unseal still shown. Case 1: the "rights broken" ruling — Declare incompatible (A) or Strike down (B). Case 2, if any (none once §1 is struck down): Read the purpose | Produces the strongest constitutional contrast for the three-countries panel | 5 min |

Rules:
- Skipping Act IV is allowed but the confirmation warns: *"Not recommended — this act carries the main lesson."* The No-case card (not a vote) is still shown after the Clerk's Act IV card.
- Acts can be skipped in any combination. Skipping an act part-way through keeps the votes already taken and auto-decides only the rest.
- The Opening, Monday Morning and Close cannot be skipped (they are short and carry the comparison and the re-vote). To save time there, the facilitator skips partner talk.
- Back after a skip restores the act's state before the skip.
- Auto-decided votes record no tally and no split; Act IV auto-rulings show "Decided by the Clerk" instead of a vote count.

---

## 8. Screens and controls

**Screens:** Setup · Title · Hook vote · Three branches · Act I Bills · Act II List (conditional) · Act II Age check · Act III Gap · Act IV Unseal · Case 1 · Case 2 or No-case card (conditional) · Gazette · Three countries · Re-vote · Discussion · End.

**Setup:** Constitution: Sealed — random A/B (default) · Sealed — choose · Open — choose. Class label (optional; used in seed and DATA line). Buttons: Start · Print voting cards · Teacher notes.

**Persistent chrome:** procedure ribbon (Bill → Rules → Gap → Court → Monday) with the current stage tied in red tape; "You are now: …" plate naming the role the class is playing, with its seal; a count-up clock showing elapsed session time against 30:00 (turns brass at 25:00, oxblood at 30:00); glossary drawer.

**Keyboard:** → / Space next · ← back · 1–4 select card · K skip act (confirm) · S script panel · G glossary · D light/dark · F fullscreen · R restart (confirm).

**Persistence:** save to `localStorage` after each action, inside try/catch; offer Resume on load; app works without storage.

**Glossary (12 terms, ≤ 20 words each):** Act · Bill · Parliament · Government · Minister · Regulation · Court · Constitution · Strike down · Reinterpret · Precedent · Loophole.

**DATA line:**
```
DATA|veritas|v2|class=<label>|seed=<n>|const=<A|B>|sealed=<0|1>|hook=<a,b,c,d>|bill=..|list=..|check=..|move=..|moveResult=..|case1=<id:ruling:for-against>|case2=<ruling:for-against|none>|revote=<a,b,c,d>|skipped=<I,II,III,IV|none>|elapsed=<mm:ss>
```

---

## 9. Design system — "Chancery & Seal"

The visual language of a state's paperwork: engraved certificates, wax seals, rubber stamps, case folders and an official gazette.

### 9.1 Palette
Light ("Vellum", default): `--paper #F2EADB` · `--paper-2 #E6D9C2` · `--paper-3 #FBF7EF` · `--ink #1B2130` · `--ink-2 #454C5E` · `--rule #8C7A5B` · `--parl #2E5A3B` (chamber green) · `--min #8A5A0C` (brass) · `--court #7A1E2A` (sealing-wax oxblood) · `--biz #57376A` (plum) · `--stamp #B0261C` · `--force #1E4D3A` · `--tape #C2362B`.
Dark ("Night Sitting"): bg #14161B · panels #1D2028 · raised #252935 · ink #ECE4D3 · ink-2 #B6AE9C · branch colours #7FB08D, #D8A84E, #D9707E, #B79AD0 · stamp #E5574B.
Body text ≥ 7:1 in light mode. Status never by colour alone.

### 9.2 Typography (no web fonts)
Serif: `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif`; headings in small caps, +0.08em tracking. Typewriter (case folders, DATA line): `"Courier New", ui-monospace, monospace`. `§` for sections. Root size `clamp(18px, 1.15vw + 6px, 28px)`; body ≥ 20 px at 1280×720; option-card text ≥ 26 px at 1920×1080.

### 9.3 Motifs
1. **Guilloché seals** — procedurally drawn rosettes (hypotrochoids) with a distinct pattern per author: Parliament (hemicycle emblem), Minister (despatch box and key), Court (balance scales over a column), Glimmer (magnifying glass over fine print), Clerk (quill and ledger — used only for Skip Act).
2. **Rubber stamps** — ENACTED, IN FORCE, REGULATION — IN FORCE, LOOPHOLE, ARGUABLE — SEE YOU IN COURT, CAUGHT, COMPLIED, REINTERPRETED, INCOMPATIBLE — STILL IN FORCE, VOID, DECIDED BY THE CLERK. SVG ink texture (`feTurbulence` + `feDisplacementMap`), rotated −4° to −9°, landing scale 1.35 → 1 in 160 ms with a 2 px jolt; fade only under `prefers-reduced-motion`.
3. **Red tape** tying the current stage on the procedure ribbon.
4. **The Law Book** — one raised document that persists from Act I to Monday Morning, set as a statute with marginal author seals. It is the visual spine of the session.
5. **Case folders** — manila folders with typed tabs (`VSC/2026/001`) and a ruled "Held:" line.
6. **Wax-sealed envelope** for the constitution; the seal cracks along an SVG path.
7. **The Gazette** — broadsheet front page with double rules, columns and an engraved Parliament-building illustration.

### 9.4 Rules
Inline SVG line-engraving with cross-hatched shading. No gradients, drop shadows, rounded pills, emoji or dashboard styling. Square-cornered option cards; the selected card gets a stamped tick and a heavier rule. 16:9 primary (1920×1080), fully legible at 1280×720, no horizontal scroll at ≥ 1024 px.

---

## 10. Technical constraints
- One self-contained `index.html`; no build step; no network requests; runs from `file://` and GitHub Pages.
- Vanilla JS. Event delegation only (`data-action` attributes); no inline `on*=` handlers.
- Blocks in order: style · SVG defs · `CONTENT` (all copy) · `MODEL` (pure) · `APP`.
- Seeded PRNG (mulberry32) for the constitution draw only; seed from `?seed=` or hash of date + class label.

---

## 11. Acceptance criteria
1. Every path through the session has ≤ 8 votes and reaches the End screen with no dead ends. (Enumeration test over all choice combinations × A/B.)
2. Every path's Law Book contains at least one live Minister regulation and at least one Court precedent (LM1).
3. Under A, no path produces VOID; Strike down is visible and locked with the exact lock text.
4. `m_lite` is LOOPHOLE under `b_narrow` and `b_trust`, CAUGHT under `b_tough`.
5. Case 2 appears iff Act III result was ARGUABLE and Case 1 did not strike down §1.
6. The three-countries panel always shows a different available option set for A versus B.
7. DATA line round-trips through `parseData`.
8. A timed rehearsal at default pacing completes in ≤ 30 minutes (build plan Phase 8).
9. No console errors; legible at 1280×720 on a projector.
10. Every combination of skipped acts (16), crossed with every class choice in the acts not skipped, reaches the End screen and still satisfies criteria 2, 3 and 6. Skipping all four acts still produces a Law Book with Parliament, Minister and Court lines.

---

## 12. Teacher notes (in-app screen + print)

**Real-world anchors (for the facilitator):**
- UK: courts cannot cancel Acts — Human Rights Act 1998 ss.3–4. Courts can quash ministers' rules that exceed their powers, e.g. *R (Public Law Project) v Lord Chancellor* [2016] UKSC 39.
- USA: *Marbury v Madison* (1803) — the Supreme Court asserts power to review Acts of Congress. Germany: the Federal Constitutional Court can declare statutes void.
- France: the Constitution divides rule-making between Parliament (Art. 34) and the government (Art. 37); the Constitutional Council reviews laws (Art. 61; Art. 61-1 since 2010).
- Judge-made law: *Donoghue v Stevenson* [1932] AC 562 created the modern law of negligence.
- Scenario parallel: Australia's Online Safety Amendment (Social Media Minimum Age) Act 2024 requires age-restricted platforms to take "reasonable steps" to stop under-16s holding accounts, with penalties on platforms, not children or parents. Ministerial rules (2025, amended March 2026) excluded categories such as online gaming and standalone messaging — though messaging services with social-media features may still be covered. The Act's focus on *accounts* parallels the Glimmer Lite gap.

**Simplifications to name if asked:** Veritas has one chamber, no head-of-state assent, no appeals, no international law. Constitution summaries are "loosely inspired by", not descriptions of, real countries. Whether judges or elected representatives *should* have the last word is a genuine, unresolved debate.
