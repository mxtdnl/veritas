# The Republic of Veritas

*Who makes the law? Should I care?*

A 30-minute, whole-class simulation for high-school students (about 14–17) with no prior knowledge. One person facilitates and projects `index.html`. The class votes on one decision per screen, with printed cards. They play Parliament, then the Minister, then a business hunting for a loophole, then the Supreme Court.

**Learning outcome:** law is made by more than one branch of government — Parliament, the government and the courts — and a country's constitution decides who has the last word.

Veritas is imaginary. Real countries are described only as having *loosely inspired* a constitution, and the app presents who should have the last word as an open question.

`spec.md` is the source of truth for behaviour and content. `CLAUDE.md` governs how the code is built. `REHEARSAL.md` has the timing estimate. `REVIEW.md` is the Phase 7 review.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app: one self-contained file. No build step, no network requests, no web fonts. |
| `spec.md` | Design specification. |
| `tests/` | Unit and enumeration tests (Node's built-in `node:test`, no dependencies). `tests/rehearsal-count.mjs` is an opt-in timing count that needs Playwright; it is not part of `node --test`. |
| `REHEARSAL.md` | Per-screen timing estimate and the screens that run over their slot. |

## Running it

Open `index.html` in a desktop browser. It works from `file://` and offline, and is built to run from GitHub Pages. It makes no network requests. It has been tested in Chromium only; other current browsers are expected to work but have not been tried.

Test on the projector before the lesson. The layout is designed for 1920×1080 and 1280×720. Press **F** for fullscreen. Press **D** to switch between the light and dark themes.

### Before class

1. **Print the voting cards.** On the Setup screen press **Print voting cards**. This prints one A4 portrait sheet with four cards: **A** (square), **B** (circle), **C** (triangle), **D** (diamond). Each card has its letter and its shape, so black and white is fine. Print one sheet per student and cut along the dashed lines. If cards are not practical, students can show 1–4 fingers.
2. **Read the teacher notes.** On Setup press **Teacher notes**. This screen holds the real-world anchors, the simplifications to name if asked, the accuracy qualifications and the script for every screen. **Print teacher notes** prints it.
3. **Choose the setup** (below), then press **Start**.

### Setup choices

| Choice | Meaning |
|---|---|
| **Sealed — random A/B** (default) | The constitution is drawn at random and stays sealed until Act IV. Nobody knows how much power the judges have until the envelope is opened. |
| **Sealed — choose** | You pick A or B. It stays sealed until Act IV. |
| **Open — choose** | You pick A or B and the class sees it from the start. The envelope is skipped. |
| **Class label** (optional) | Used in the random draw and written into the DATA line. |

If an earlier session was saved in the browser, Setup offers **Resume**. The app works without browser storage: it simply never offers Resume.

### The vote rhythm

Every full vote follows the same steps:

1. **Read** (up to 60 s). Read the screen aloud, using the script panel (**S**).
2. **Talk to a partner** (60 s).
3. **Show cards** on "3, 2, 1" (10 s).
4. **Enter the result.** Use the +/− boxes under the cards and press **→**, or just click the winning card. A tie asks for the **Speaker's casting vote**: click one of the tied cards. The stamp lands and the ruling goes into the Law Book.
5. **Hear one minority voice** (30 s). Once the result is in, the screen names the runner-up card to ask. Then press **→** to move on.

The opening and closing votes (the hook question and the re-vote) skip partner talk. Enter counts for them: they are compared at the end. Do not reveal an answer at the start.

There are at most 8 votes. The clock in the corner turns brass at 25:00 and oxblood at 30:00. If time is short, skip partner talk on Acts II and III, or press **K** to skip an act: the Clerk decides for the class. Skipping Act IV is not recommended. The Opening, Monday Morning and the Close cannot be skipped.

### Keyboard

→ or Space next · ← back · 1–4 select a card · K skip act (asks first) · S script panel · G glossary · D light/dark · F fullscreen · R restart (asks first)

### Run of show

| Act | The class plays | Vote | Min |
|---|---|---|---|
| Opening | Themselves | Hook: who makes the law? | 3 |
| I — Make the law | Members of Parliament | Choose a Bill | 5 |
| II — Run the law | The Minister | App list (Bill 3 only); age check | 4 |
| III — Find the gap | Glimmer's board | Glimmer's move | 4 |
| IV — Judge the law | Supreme Court judges | Case 1; Case 2 if arguable | 8 |
| Monday Morning | Citizens | — | 3 |
| Close | Themselves | Re-vote; one discussion question | 3 |

Timings are an estimate. `REHEARSAL.md` shows which screens run over. Run the session once with colleagues before the first class.

## The constitutions

| | Name | Summary read aloud |
|---|---|---|
| **A** | The Sovereign Parliament (loosely inspired by the UK) | "Parliament is the highest law-maker. Judges must apply every Act. They can read an Act in a way that respects rights, and they can say publicly that it breaks rights — but they cannot cancel it." |
| **B** | The Guardian Court (loosely inspired by the USA and Germany) | "Veritas has a written Constitution, and it is the highest law. Judges can cancel — 'strike down' — any law that breaks it, even an Act of Parliament." |
| **C** | The Strong President (loosely inspired by France) | "An elected President leads the government, which can make some rules by decree without a vote in Parliament. A Constitutional Council can cancel Acts that break the Constitution." |

**C is never live.** It appears only in the "Same choices, three countries" panel on Monday Morning, because its difference would not change any decision the class makes. A and B are the only constitutions the class lives under.

Under A, *Strike down* is shown on the Case 1 screen but locked, with the reason in full. Ask the class: "Why can't you press that?"

## URL parameters

Add these after the file name or page address, for example `index.html?seed=7`.

| Parameter | Effect |
|---|---|
| `?seed=<number>` | Fixes the random seed. With **Sealed — random A/B**, the seed decides the constitution, so the same seed always gives the same one: seeds 1–6 and 10 give B; seeds 7, 8 and 9 give A. The seed is written into the DATA line. It survives Restart. Anything that is not a number is ignored. |
| `?gallery=1` | A review-only gallery of the design system: every seal, stamp and component, in both themes. It is not part of the lesson. Do not project it to a class. |

Without `?seed=`, the seed is a hash of today's date (UTC) and the class label, set when you press Start. The same label on the same date therefore draws the same constitution. Use **Sealed — choose** or **Open — choose** to be sure of A or B.

## The DATA line

The End screen shows one line of data in typewriter type, with a **Copy** button. If the browser blocks copying, the line is selected so you can press Ctrl+C (or ⌘C). It records one session and is built from fields separated by `|`:

```
DATA|veritas|v2|class=<label>|seed=<n>|const=<A|B>|sealed=<0|1>|hook=<a,b,c,d>|bill=..|list=..|check=..|move=..|moveResult=..|case1=<id:ruling:for-against>|case2=<ruling:for-against|none>|revote=<a,b,c,d>|skipped=<I,II,III,IV|none>|elapsed=<mm:ss>
```

| Field | Meaning |
|---|---|
| `DATA\|veritas\|v2` | Marks the line and its format version. |
| `class` | Your class label. `%`, `\|` and line breaks in it are percent-encoded. |
| `seed` | The seed behind the random draw. |
| `const` | The live constitution, `A` or `B`. |
| `sealed` | `1` if it was sealed until Act IV; `0` if open. |
| `hook` | Opening vote counts for A, B, C, D, in that order. |
| `bill` | `b_narrow` (Clear Lines), `b_tough` (Tough) or `b_trust` (Trust the Minister). |
| `list` | The Minister's app list: `l_feeds`, `l_wide`, `l_all`; `none` unless the Bill was `b_trust`. |
| `check` | Age check: `k_tick`, `k_face` or `k_id`. |
| `move` | Glimmer's move: `m_comply`, `m_chat`, `m_quest` or `m_lite`. |
| `moveResult` | `COMPLIED`, `CAUGHT`, `LOOPHOLE` or `ARGUABLE`. |
| `case1` | Case id, ruling (`uphold`, `reinterpret`, `declare` or `strike`) and the judges' split as `for-against`. The first number is the winning card's votes; the second is everyone else's, so a unanimous ruling is `14-0`. `-` means no counts were entered, or the Clerk decided. |
| `case2` | Ruling (`literal` or `purposive`) and split; `none` if Case 2 was not heard. |
| `revote` | Closing vote counts for A, B, C, D. Compare with `hook` to see the shift. |
| `skipped` | Acts the Clerk decided, such as `II,III`; `none` if none. |
| `elapsed` | Session time, `mm:ss`, fixed when the End screen is reached. |

A field with no value is written `none`. Example, with a Bill 2 session under Constitution B:

```
DATA|veritas|v2|class=9B|seed=1234|const=B|sealed=1|hook=4,9,3,6|bill=b_tough|list=none|check=k_face|move=m_lite|moveResult=CAUGHT|case1=marlow:strike:14-8|case2=none|revote=0,2,19,1|skipped=none|elapsed=27:41
```

The numbers in this example are made up to show the format. They are not a recorded session.

## Tests

```
node --test
```

Run it from the repository root: `node --test tests/` fails on Node 22. Run on Node 22 with nothing else installed.
