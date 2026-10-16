# REHEARSAL.md — timing estimate (Phase 8)

This is a calculation, not a timed run. It reads the real screens in a headless browser and counts words. It cannot measure pauses, tally entry, stamp animations, transitions or discussion. Spec §11 criterion 8 (a timed rehearsal at default pacing completes in ≤ 30 minutes) is **not confirmed** by this file. A live run with colleagues is still needed.

No copy was changed. Overruns are flagged only.

## Method

- **Paths.** 140 distinct session paths were played through `index.html` at 1920×1080 with Constitution A or B sealed-and-chosen: 5 Bill/list combinations × 4 Glimmer moves × 2 constitutions × 3 available Case 1 rulings × 2 Case 2 rulings (where Case 2 appears). Two extra runs confirmed that the age-check choice does not change any word count. No console errors on any run. No Skip Act on these paths (skipping only saves time).
- **Screen words.** The text of the projected stage as it stands before the class votes, with the letter and shape on each card, the act label, the tally controls, the seal ring text and the stamps left out. Option cards, case folders, the constitution summary and table cells are counted. The Law Book is **not** counted, except that on the Gazette the headline, authorship line and Glimmer note are. Law Book words are reported separately below.
- **Script words.** The "Say" line from the script panel (S), plus the "Ask" line where one is shown (the lock question under A; the "was there a gap?" question after COMPLIED). The "likely question" and its answer are not counted, because they are read only if a student asks.
- **Read aloud** = (screen words + script words) ÷ 130 wpm. Where the script repeats a sentence that is already on screen (hook, branches, countries, re-vote), both are counted, so those rows are slightly high.
- **Vote rhythm** (spec §2), added to each vote screen: partner talk 60 s + show cards 10 s + hear one minority voice 30 s = **1:40**. The spec's "read (≤ 60 s)" step is the read-aloud time above, so it is not added a second time. The Hook and Re-vote skip partner talk: 10 s + 30 s = **0:40**. The app shows no minority prompt on those two screens, so 0:30 of that is conservative.
- **Slot** = the "Timing" line in each screen's script, which sums to the §2 act slots (3 + 5 + 4 + 4 + 8 + 3 + 3 = 30). The age check has a 2:00 slot when the list vote was held and a 4:00 slot when it was not.

## Per-screen table

The worst case over all 140 paths is shown. A range means the text differs by path.

| Screen | Screen words | Script words | Read aloud | Vote rhythm | Estimate | Slot | Margin | Verdict |
|---|---|---|---|---|---|---|---|---|
| Title | 59 | 24 | 0:38 | — | **0:38** | 0:20 | −0:18 | **OVER** |
| Hook vote | 22 | 24 | 0:21 | 0:40 | **1:01** | 1:30 | +0:29 | fits |
| Three branches | 48 | 29 | 0:36 | — | **0:36** | 1:10 | +0:34 | fits |
| Act I — Bills | 167 | 26 | 1:29 | 1:40 | **3:09** | 5:00 | +1:51 | fits |
| Act II — List (Bill 3 only) | 44 | 24 | 0:31 | 1:40 | **2:11** | 2:00 | −0:11 | **OVER** |
| Act II — Age check | 48 | 29 | 0:36 | 1:40 | **2:16** | 2:00 with list · 4:00 without | −0:16 · +1:44 | **OVER** with the list vote |
| Act III — Gap | 55 | 22 | 0:36 | 1:40 | **2:16** | 4:00 | +1:44 | fits |
| Act IV — Unseal | 38–45 | 32 | 0:36 | — | **0:36** | 1:00 | +0:24 | fits |
| Act IV — Case 1 | 61–90 | 24–29 | 0:55 | 1:40 | **2:35** | 4:00 | +1:25 | fits |
| Act IV — Case 2 (if arguable) | 50–51 | 25 | 0:35 | 1:40 | **2:15** | 3:00 | +0:45 | fits |
| Act IV — No-case card (if loophole) | 14–21 | 23–24 | 0:20 | — | **0:20** | 0:30 | +0:10 | fits, under 15 s spare |
| Gazette | 43–50 | 28 | 0:36 | — | **0:36** | 1:30 | +0:54 | fits |
| Three countries | 133–152 | 21 | 1:20 | — | **1:20** | 1:30 | +0:10 | fits, under 15 s spare |
| Re-vote | 24 | 18 | 0:19 | 0:40 | **0:59** | 1:30 | +0:31 | fits |
| Discussion (longest question) | 27 | 17 | 0:20 | — | **0:20** | 1:30 | +1:10 | fits |
| End | 37 | 17 | 0:25 | — | **0:25** | none set | — | — |

Clerk result cards (Skip Act, spec §7.5 and script: ≈ 20 s):

| Card | Screen words | Script words | Read aloud | Margin against 0:20 |
|---|---|---|---|---|
| Act I | 23 | 26 | 0:23 | −0:03 |
| Act II (no list) | 29 | 26 | 0:25 | −0:05 |
| Act II (list and age check) | 37 | 26 | 0:29 | −0:09 |
| Act III | 30 | 26 | 0:26 | −0:06 |
| Act IV | 30–35 | 26 | 0:26–0:28 | −0:06 to −0:08 |

## Longest path

**21:08**, with 8 votes: Bill 3 (*Trust the Minister*) with the `l_feeds` list, any age check, `m_chat` or `m_quest`, Constitution A, Case 2 heard. The Case 1 ruling moves the total by a few seconds at most; the longest figure is with Declare incompatible. Screens: Title → Hook → Branches → Bills → List → Age check → Gap → Unseal → Case 1 → Case 2 → Gazette → Three countries → Re-vote → Discussion → End.

| Shape of path | Paths | Estimate |
|---|---|---|
| Case 2 heard, list vote held | 20 | 20:50–21:08 |
| No-case card, list vote held | 20 | 18:47–19:06 |
| Case 2 heard, no list vote | 20 | 18:39–18:57 |
| Neither Case 2 nor no-case card, list vote held | 42 | 18:27–18:45 |
| No-case card, no list vote | 8 | 16:36–16:54 |
| Neither, no list vote | 30 | 16:15–16:37 |

Votes per path: 6 to 8, so spec §11 criterion 1 (≤ 8) holds for these paths.

Act by act on the longest path, against the §2 slots:

| Act | Estimate | Slot | |
|---|---|---|---|
| Opening | 2:15 | 3:00 | fits |
| I — Make the law | 3:09 | 5:00 | fits |
| II — Run the law | 4:27 | 4:00 | **OVER by 0:27** |
| III — Find the gap | 2:16 | 4:00 | fits |
| IV — Judge the law | 5:21 | 8:00 | fits |
| Monday Morning | 1:56 | 3:00 | fits |
| Close | 1:45 | 3:00 | fits |
| **Total** | **21:08** | **30:00** | 8:52 unmodelled |

## Screens over their slot

1. **Title** — 0:38 against 0:20, over by 0:18. The screen carries the title, subtitle and both scenario paragraphs (spec §3) as well as the script line. The Opening still fits its 3:00 slot (2:15 on the longest path).
2. **Act II List** — 2:11 against 2:00, over by 0:11. Bill 3 paths only.
3. **Act II Age check, after a list vote** — 2:16 against 2:00, over by 0:16. Together with item 2, Act II on a Bill 3 path is 4:27 against 4:00. The script already says "skip partner talk if behind" for both screens; skipping partner talk on both saves 2:00.
4. **Clerk result cards** — 0:23 to 0:29 against ≈ 0:20, over by 3 to 9 s. Each skip still saves several minutes (spec §7.5).

Near the limit (under 15 s spare): **Three countries** (+0:10) and the **No-case card** (+0:10).

The age check on paths with no list vote (4:00 slot), and every other screen, fit.

## Sensitivities

- **Law Book read aloud in full.** The Law Book is not counted above. If the facilitator reads it out as well, the worst cases become: Gap 2:47 (slot 4:00), Case 1 3:02 (4:00), **Case 2 3:03 (3:00, over by 0:03)**, **No-case card 1:10 (0:30, over by 0:40)**, **Gazette 1:41 (1:30, over by 0:11)**. The script lines for these screens do not ask for the Law Book to be read out.
- **Read phase at a flat 60 s.** If the spec's "read (≤ 60 s)" step is taken as a fixed minute at every full vote instead of the read-aloud time, the longest path is **23:00**. Only Act I (1:29) reads for longer than 60 s, so the flat minute does not change which screens are over.
- **Quick votes.** If the Hook and Re-vote take only the 10 s card show, the longest path is 20:08.

## What is not modelled

Entering tally counts or clicking a winner, stamp animations (160 ms each), the envelope cracking, tie handling ("Speaker's casting vote"), glossary look-ups, answering likely questions, the partner talk and two or three answers on the Discussion screen (the script says 30 s plus answers), settling the class between screens, and any student who needs a vote repeated. These share the 8:52 gap between the modelled 21:08 and the 30:00 slot total. The Discussion script (30 s of partner talk, then two or three answers) is the one place the script itself schedules such time. A class that debates will use all of it.

## Reading the result

- On words alone, every path fits 30:00 with room to spare. Two of the slots are set tighter than the words need (Title and Act II), and Act II is the one act whose total exceeds its slot.
- Act II is the first place to cut time: use the script's "skip partner talk if behind" on the List and Age check (−2:00), or Skip Act (Act II saves ≈ 3 min).
- The 30-minute budget is an estimate. Run it live once before the first class.

## Repeating the count

The counting script is not in the repository. It loads `index.html` from `file://` in headless Chromium, plays each path with the keyboard and the saved game state (`veritas:v2:session`), and counts words with the exclusions above. It needs re-running if any CONTENT string changes.
