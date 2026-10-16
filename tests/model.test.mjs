import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModel, loadSource, extractBlock } from "./load-model.mjs";

const { CONTENT, MODEL } = loadModel();

test("loader returns CONTENT and MODEL", () => {
  assert.equal(typeof CONTENT.title, "string");
  assert.equal(typeof MODEL.mulberry32, "function");
  assert.equal(typeof MODEL.hashString, "function");
});

test("loader throws a clear error when a marker is missing", () => {
  assert.throws(() => extractBlock("no markers here", "MODEL"), /Marker missing.*MODEL:START/);
  assert.throws(() => extractBlock("/* MODEL:START */ x", "MODEL"), /Marker missing.*MODEL:END/);
});

test("mulberry32 is deterministic for a fixed seed", () => {
  const a = MODEL.mulberry32(12345);
  const b = MODEL.mulberry32(12345);
  const seqA = Array.from({ length: 5 }, () => a());
  const seqB = Array.from({ length: 5 }, () => b());
  assert.deepEqual(seqA, seqB);
  assert.ok(seqA.every((x) => x >= 0 && x < 1));
  assert.notDeepEqual(seqA, Array.from({ length: 5 }, MODEL.mulberry32(54321)));
});

test("mulberry32 matches its reference output for seed 1", () => {
  // Reference values computed from the standard mulberry32 algorithm.
  const r = MODEL.mulberry32(1);
  assert.equal(r(), 0.6270739405881613);
  assert.equal(r(), 0.002735721180215478);
});

test("hashString is stable and discriminating", () => {
  assert.equal(MODEL.hashString(""), 0x811c9dc5);
  assert.equal(MODEL.hashString("a"), 0xe40c292c);
  assert.equal(MODEL.hashString("veritas"), MODEL.hashString("veritas"));
  assert.notEqual(MODEL.hashString("veritas"), MODEL.hashString("Veritas"));
  assert.ok(Number.isInteger(MODEL.hashString("2026-10-16Class 9")));
});

test("MODEL block contains no forbidden globals", () => {
  const { html } = loadSource();
  const block = extractBlock(html, "MODEL");
  for (const banned of ["document", "window", "Date.now", "Math.random"]) {
    assert.equal(block.includes(banned), false, `MODEL block must not contain "${banned}"`);
  }
});

test("index.html has no inline event handlers", () => {
  const { html } = loadSource();
  assert.equal(/\son[a-z]+\s*=/i.test(html), false);
});

// ---------- Phase 2: content, model and state machine ----------
import { loadMachine } from "./load-model.mjs";

const { MACHINE } = loadMachine();
// vm objects come from another realm; compare as plain JSON.
const plain = (x) => JSON.parse(JSON.stringify(x));
const BILLS = ["b_narrow", "b_tough", "b_trust"];
const LISTS = ["l_feeds", "l_wide", "l_all"];
const CHECKS = ["k_tick", "k_face", "k_id"];
const MOVES = ["m_comply", "m_chat", "m_quest", "m_lite"];

function base(over = {}) {
  return { seed: 1, label: "", constitution: "A", sealed: true, hook: null, revote: null, bill: null, list: null,
    check: null, move: null, moveResult: null, case1: null, case2: null, byClerk: {}, skipped: [], ...over };
}

test("CONTENT: spec copy is present verbatim", () => {
  assert.equal(CONTENT.lockText, "In this constitution, judges cannot cancel an Act of Parliament.");
  assert.equal(CONTENT.noCase, "No case. The words are clear: Glimmer Lite has no accounts. Judges apply the words — only Parliament can close this gap.");
  assert.equal(CONTENT.disclaimer, "Veritas is imaginary. Real countries are more complicated.");
  assert.equal(CONTENT.hook.question, "In a country like ours, who makes the law?");
  assert.deepEqual(plain(CONTENT.hook.options.map((o) => o.text)),
    ["Only Parliament", "Parliament and the government", "Parliament, the government and judges", "Not sure"]);
  assert.equal(CONTENT.bills.b_tough.sections[1], "An under-16 who breaks this rule commits a crime.");
  for (const b of BILLS) assert.equal(CONTENT.bills[b].sections[2], "The Minister will decide how apps check users' ages.");
  assert.equal(CONTENT.close.discussion.length, 3);
  assert.equal(Object.keys(CONTENT.headlines).length, 6);
  assert.equal(CONTENT.constitutions.A.inspired, "loosely inspired by the UK");
  assert.match(CONTENT.constitutions.C.note, /comparison only, never live/);
});

test("CONTENT: 12 glossary terms, each authored and ≤ 20 words", () => {
  const terms = CONTENT.glossary.map((g) => g.term);
  assert.deepEqual(plain(terms), ["Act", "Bill", "Parliament", "Government", "Minister", "Regulation", "Court",
    "Constitution", "Strike down", "Reinterpret", "Precedent", "Loophole"]);
  for (const g of CONTENT.glossary) {
    assert.equal(g.authored, true, g.term);
    assert.ok(g.def.split(/\s+/).length <= 20, `${g.term}: ${g.def.split(/\s+/).length} words`);
  }
});

test("CONTENT: a facilitator script entry for every screen (say ≤ 40 words, timing, Q and A)", () => {
  const screens = ["setup", "title", "hook", "branches", "bills", "list", "check", "gap", "unseal", "case1", "case2",
    "nocase", "clerk", "gazette", "countries", "revote", "discussion", "end"];
  assert.deepEqual(plain(Object.keys(CONTENT.script).sort()), [...screens].sort());
  for (const k of screens) {
    const e = CONTENT.script[k];
    assert.equal(e.authored, true, k);
    for (const f of ["say", "timing", "q", "a"]) assert.ok(e[f], `${k}.${f}`);
    assert.ok(e.say.split(/\s+/).length <= 40, `${k}: ${e.say.split(/\s+/).length} words`);
  }
  assert.equal(CONTENT.script.clerk.say, CONTENT.clerk.script);
  assert.equal(CONTENT.script.case1.q, "Why can't the judges just cancel it?");
});

test("constitutionDraw is deterministic and yields both A and B", () => {
  const seen = new Set();
  for (let s = 0; s < 200; s++) {
    const c = MODEL.constitutionDraw(s);
    assert.ok(c === "A" || c === "B");
    assert.equal(c, MODEL.constitutionDraw(s));
    seen.add(c);
  }
  assert.equal(seen.size, 2);
  assert.equal(MODEL.seedFrom("2026-10-16", "9X"), MODEL.seedFrom("2026-10-16", "9X"));
  assert.notEqual(MODEL.seedFrom("2026-10-16", "9X"), MODEL.seedFrom("2026-10-17", "9X"));
});

test("moveResult: every row of the §4.3 table", () => {
  const narrow = { m_comply: "COMPLIED", m_chat: "ARGUABLE", m_quest: "ARGUABLE", m_lite: "LOOPHOLE" };
  const tough = { m_comply: "COMPLIED", m_chat: "CAUGHT", m_quest: "CAUGHT", m_lite: "CAUGHT" };
  const trust = {
    l_feeds: { m_comply: "COMPLIED", m_chat: "ARGUABLE", m_quest: "ARGUABLE", m_lite: "LOOPHOLE" },
    l_wide: { m_comply: "COMPLIED", m_chat: "CAUGHT", m_quest: "CAUGHT", m_lite: "LOOPHOLE" },
    l_all: { m_comply: "COMPLIED", m_chat: "CAUGHT", m_quest: "CAUGHT", m_lite: "LOOPHOLE" },
  };
  for (const m of MOVES) {
    assert.equal(MODEL.moveResult("b_narrow", null, m), narrow[m], `b_narrow ${m}`);
    assert.equal(MODEL.moveResult("b_tough", null, m), tough[m], `b_tough ${m}`);
    for (const l of LISTS) assert.equal(MODEL.moveResult("b_trust", l, m), trust[l][m], `b_trust ${l} ${m}`);
  }
  assert.throws(() => MODEL.moveResult("b_trust", null, "m_chat"), /Unknown list/);
  assert.throws(() => MODEL.moveResult("b_x", null, "m_chat"), /Unknown bill/);
});

test("case1For: Marlow for b_tough (challenges §2), Kim otherwise (challenges §1)", () => {
  assert.equal(MODEL.case1For("b_tough"), "marlow");
  assert.equal(MODEL.case1For("b_narrow"), "kim");
  assert.equal(MODEL.case1For("b_trust"), "kim");
  assert.equal(MODEL.caseSection("marlow"), 2);
  assert.equal(MODEL.caseSection("kim"), 1);
});

test("rulingOptions: A locks Strike down with the exact text; B has no Declare incompatible", () => {
  const a = plain(MODEL.rulingOptions("A"));
  assert.deepEqual(a.map((o) => o.id), ["uphold", "reinterpret", "declare", "strike"]);
  const strike = a.find((o) => o.id === "strike");
  assert.equal(strike.locked, true);
  assert.equal(strike.lockReason, "In this constitution, judges cannot cancel an Act of Parliament.");
  assert.ok(a.filter((o) => o.id !== "strike").every((o) => !o.locked));
  const b = plain(MODEL.rulingOptions("B"));
  assert.deepEqual(b.map((o) => o.id), ["uphold", "reinterpret", "strike"]);
  assert.ok(b.every((o) => !o.locked));
  assert.ok(!b.some((o) => o.id === "declare"));
});

test("lawBook: statuses for each ruling, on the challenged section only", () => {
  const expect = { uphold: "IN_FORCE", reinterpret: "REINTERPRETED", declare: "INCOMPATIBLE_IN_FORCE", strike: "VOID" };
  for (const [bill, id, sec] of [["b_tough", "marlow", 2], ["b_narrow", "kim", 1], ["b_trust", "kim", 1]]) {
    for (const ruling of Object.keys(expect)) {
      const s = base({ bill, list: bill === "b_trust" ? "l_wide" : null, check: "k_tick", move: "m_comply",
        moveResult: "COMPLIED", case1: { id, ruling } });
      const lb = plain(MODEL.lawBook(s));
      assert.deepEqual(lb.map((p) => p.id), ["act-1", "act-2", "act-3", ...(bill === "b_trust" ? ["reg-list"] : []), "reg-check", "prec-1"]);
      for (let n = 1; n <= 3; n++) {
        const p = lb.find((x) => x.id === "act-" + n);
        assert.equal(p.author, "PARL");
        assert.equal(p.status, n === sec ? expect[ruling] : "ENACTED", `${bill} ${ruling} §${n}`);
      }
      const ch = lb.find((x) => x.id === "act-" + sec);
      if (ruling === "reinterpret") {
        assert.equal(ch.text, CONTENT.cases[id].reinterpret);
        assert.equal(ch.original, CONTENT.bills[bill].sections[sec - 1]);
      } else assert.equal(ch.text, CONTENT.bills[bill].sections[sec - 1]);
      for (const r of lb.filter((p) => p.author === "MIN")) assert.equal(r.status, "REGULATION_IN_FORCE");
      const prec = lb.find((p) => p.id === "prec-1");
      assert.equal(prec.author, "COURT");
      assert.equal(prec.status, "PRECEDENT");
      assert.ok(prec.text.startsWith(CONTENT.cases[id].name + " — Held: "));
      assert.ok(prec.text.endsWith(". Future courts in Veritas must follow this."));
      const auth = plain(MODEL.authorship(MODEL.lawBook(s)));
      assert.deepEqual(auth, { PARL: ruling === "strike" ? 2 : 3, MIN: bill === "b_trust" ? 2 : 1, COURT: 1 });
    }
  }
});

test("lawBook: before any vote it is empty; after Act I it holds three ENACTED sections; Case 2 adds a precedent", () => {
  assert.deepEqual(plain(MODEL.lawBook(base())), []);
  const lb = plain(MODEL.lawBook(base({ bill: "b_narrow" })));
  assert.deepEqual(lb.map((p) => p.status), ["ENACTED", "ENACTED", "ENACTED"]);
  const s = base({ bill: "b_narrow", check: "k_face", move: "m_chat", moveResult: "ARGUABLE",
    case1: { id: "kim", ruling: "uphold" }, case2: { ruling: "purposive" }, byClerk: { case2: true } });
  const p2 = plain(MODEL.lawBook(s)).find((p) => p.id === "prec-2");
  assert.equal(p2.author, "COURT");
  assert.equal(p2.byClerk, true);
  assert.ok(p2.text.startsWith(CONTENT.case2.name + " — Held: Glimmer Chat"));
});

test("glimmerStatus: final status for each Act III / Case 2 outcome", () => {
  const g = (o) => MODEL.glimmerStatus(base({ bill: "b_narrow", check: "k_face", ...o }));
  assert.equal(g({ move: "m_comply", moveResult: "COMPLIED" }), "COMPLIED");
  assert.equal(g({ bill: "b_tough", move: "m_lite", moveResult: "CAUGHT" }), "CAUGHT");
  assert.equal(g({ move: "m_lite", moveResult: "LOOPHOLE" }), "LOOPHOLE");
  assert.equal(g({ move: "m_chat", moveResult: "ARGUABLE", case2: { ruling: "literal" } }), "LOOPHOLE");
  assert.equal(g({ move: "m_chat", moveResult: "ARGUABLE", case2: { ruling: "purposive" } }), "CLOSED_BY_COURT");
});

test("headline: §4.5.1 priority order", () => {
  const s = (case1, move, mr, case2 = null) =>
    base({ bill: "b_narrow", check: "k_face", move, moveResult: mr, case1: { id: "kim", ruling: case1 }, case2 });
  // VOID beats everything, including an open loophole.
  assert.equal(MODEL.headline(s("strike", "m_lite", "LOOPHOLE")), "VOID");
  // INCOMPATIBLE beats LOOPHOLE.
  assert.equal(MODEL.headline(s("declare", "m_lite", "LOOPHOLE")), "INCOMPATIBLE");
  // LOOPHOLE beats REINTERPRETED (clear loophole, and one left open by Read the words).
  assert.equal(MODEL.headline(s("reinterpret", "m_lite", "LOOPHOLE")), "LOOPHOLE");
  assert.equal(MODEL.headline(s("reinterpret", "m_chat", "ARGUABLE", { ruling: "literal" })), "LOOPHOLE");
  // REINTERPRETED beats CAUGHT.
  assert.equal(MODEL.headline(s("reinterpret", "m_chat", "ARGUABLE", { ruling: "purposive" })), "REINTERPRETED");
  // CAUGHT (by the words, or by the court).
  assert.equal(MODEL.headline(s("uphold", "m_chat", "ARGUABLE", { ruling: "purposive" })), "CAUGHT");
  assert.equal(MODEL.headline(base({ bill: "b_tough", check: "k_face", move: "m_lite", moveResult: "CAUGHT",
    case1: { id: "marlow", ruling: "uphold" } })), "CAUGHT");
  // Otherwise.
  assert.equal(MODEL.headline(s("uphold", "m_comply", "COMPLIED")), "DEFAULT");
});

test("threeCountries: option sets and mapping by intent", () => {
  const panel = (constitution, ruling, case2 = null) =>
    plain(MODEL.threeCountries(base({ constitution, bill: "b_narrow", check: "k_face", move: "m_chat",
      moveResult: "ARGUABLE", case1: { id: "kim", ruling }, case2 })));
  const p = panel("A", "declare", { ruling: "literal" });
  assert.deepEqual(p.map((c) => c.id), ["A", "B", "C"]);
  assert.deepEqual(p.map((c) => c.live), [true, false, false]);
  assert.deepEqual(p[0].options, ["uphold", "reinterpret", "declare"]);
  assert.deepEqual(p[1].options, ["uphold", "reinterpret", "strike"]);
  assert.deepEqual(p[2].options, ["uphold", "reinterpret", "strike"]);
  assert.deepEqual(p.map((c) => c.case1), ["declare", "strike", "strike"]);
  assert.deepEqual(p.map((c) => c.case2), ["literal", "literal", "literal"]);
  assert.deepEqual(panel("B", "strike").map((c) => c.case1), ["declare", "strike", "strike"]);
  assert.deepEqual(panel("B", "strike").map((c) => c.live), [false, true, false]);
  for (const r of ["uphold", "reinterpret"]) {
    for (const c of ["A", "B"]) assert.deepEqual(panel(c, r).map((x) => x.case1), [r, r, r]);
  }
  assert.deepEqual(panel("A", "uphold").map((c) => c.case2), [null, null, null]);
});

test("DATA line: format and round-trip", () => {
  const s = base({ label: "9X|Room 4%", seed: 4242, constitution: "B", sealed: true, hook: { A: 3, B: 9, C: 2, D: 11 },
    bill: "b_trust", list: "l_feeds", check: "k_id", move: "m_quest", moveResult: "ARGUABLE",
    case1: { id: "kim", ruling: "strike", split: [17, 8] }, case2: { ruling: "literal" },
    revote: { A: 1, B: 4, C: 19, D: 1 }, skipped: ["IV", "II"] });
  const line = MODEL.toData(s, 1745);
  assert.equal(line, "DATA|veritas|v2|class=9X%7CRoom 4%25|seed=4242|const=B|sealed=1|hook=3,9,2,11|bill=b_trust|list=l_feeds|check=k_id|move=m_quest|moveResult=ARGUABLE|case1=kim:strike:17-8|case2=literal:-|revote=1,4,19,1|skipped=II,IV|elapsed=29:05");
  const d = plain(MODEL.parseData(line));
  assert.deepEqual(d, {
    label: "9X|Room 4%", seed: 4242, constitution: "B", sealed: true, hook: { A: 3, B: 9, C: 2, D: 11 },
    bill: "b_trust", list: "l_feeds", check: "k_id", move: "m_quest", moveResult: "ARGUABLE",
    case1: { id: "kim", ruling: "strike", split: [17, 8] }, case2: { ruling: "literal" },
    revote: { A: 1, B: 4, C: 19, D: 1 }, skipped: ["II", "IV"], elapsed: 1745,
  });
  assert.equal(MODEL.toData(MODEL.parseData(line)), line);
  const empty = MODEL.toData(base({ sealed: false }), 0);
  assert.match(empty, /\|sealed=0\|hook=none\|bill=none\|list=none\|.*\|case1=none\|case2=none\|revote=none\|skipped=none\|elapsed=00:00$/);
  assert.equal(MODEL.toData(MODEL.parseData(empty)), empty);
  assert.throws(() => MODEL.parseData("DATA|other|v2"), /Not a Veritas v2 DATA line/);
});

// ---------- Skip Act: autoDecide (spec §7.5) ----------

test("autoDecide Act I: b_narrow, only while the Bill is undecided", () => {
  assert.deepEqual(plain(MODEL.autoDecide("I", base())), { bill: "b_narrow" });
  for (const b of BILLS) assert.deepEqual(plain(MODEL.autoDecide("I", base({ bill: b }))), {});
});

test("autoDecide Act II: list l_feeds (b_trust only) and check k_face, for every prior state", () => {
  for (const bill of BILLS) {
    for (const list of bill === "b_trust" ? [null, ...LISTS] : [null]) {
      for (const check of [null, ...CHECKS]) {
        const want = {};
        if (bill === "b_trust" && !list) want.list = "l_feeds";
        if (!check) want.check = "k_face";
        assert.deepEqual(plain(MODEL.autoDecide("II", base({ bill, list, check }))), want, `${bill} ${list} ${check}`);
      }
    }
  }
  // Part-way: the list vote already taken keeps the class's choice.
  assert.deepEqual(plain(MODEL.autoDecide("II", base({ bill: "b_trust", list: "l_all" }))), { check: "k_face" });
});

test("autoDecide Act III: m_lite when it is a LOOPHOLE, otherwise m_chat", () => {
  for (const bill of BILLS) {
    for (const list of bill === "b_trust" ? LISTS : [null]) {
      const want = bill === "b_tough" ? "m_chat" : "m_lite";
      assert.equal(MODEL.moveResult(bill, list, "m_lite") === "LOOPHOLE", want === "m_lite");
      assert.deepEqual(plain(MODEL.autoDecide("III", base({ bill, list, check: "k_face" }))), { move: want }, `${bill} ${list}`);
      for (const m of MOVES) assert.deepEqual(plain(MODEL.autoDecide("III", base({ bill, list, check: "k_face", move: m }))), {});
    }
  }
});

test("autoDecide Act IV: rights-broken ruling per constitution, Read the purpose for an undecided Case 2", () => {
  for (const constitution of ["A", "B"]) {
    for (const bill of BILLS) {
      for (const list of bill === "b_trust" ? LISTS : [null]) {
        for (const move of MOVES) {
          const mr = MODEL.moveResult(bill, list, move);
          const id = MODEL.case1For(bill);
          const s = base({ constitution, bill, list, check: "k_face", move, moveResult: mr });
          const want = { case1: { id, ruling: constitution === "A" ? "declare" : "strike" } };
          if (mr === "ARGUABLE") want.case2 = { ruling: "purposive" };
          assert.deepEqual(plain(MODEL.autoDecide("IV", s)), want, `${constitution} ${bill} ${list} ${move}`);
          // Part-way: Case 1 already ruled by the class.
          const after1 = { ...s, case1: { id, ruling: "uphold" } };
          assert.deepEqual(plain(MODEL.autoDecide("IV", after1)), mr === "ARGUABLE" ? { case2: { ruling: "purposive" } } : {});
          if (mr === "ARGUABLE") assert.deepEqual(plain(MODEL.autoDecide("IV", { ...after1, case2: { ruling: "literal" } })), {});
        }
      }
    }
  }
  assert.throws(() => MODEL.autoDecide("V", base()), /Unknown act/);
});

// ---------- State machine ----------

const run = (s, ...actions) => actions.reduce((st, a) => MACHINE.step(st, typeof a === "string" ? { type: a } : a), s);
const sel = (value) => ({ type: "select", value });
function started(constitution = "A", mode = "sealedChoose") {
  return run(MACHINE.initial({ seed: 7 }), { type: "set-mode", value: mode },
    { type: "set-constitution", value: constitution }, { type: "start", date: "2026-10-16" });
}

test("machine: setup modes set constitution and sealing", () => {
  const r = run(MACHINE.initial({}), { type: "set-label", value: "9X" }, { type: "start", date: "2026-10-16" });
  assert.equal(r.screen, "title");
  assert.equal(r.seed, MODEL.seedFrom("2026-10-16", "9X"));
  assert.equal(r.constitution, MODEL.constitutionDraw(r.seed));
  assert.equal(r.sealed, true);
  assert.equal(started("B").constitution, "B");
  assert.equal(started("B").sealed, true);
  const open = started("A", "open");
  assert.equal(open.sealed, false);
  assert.equal(open.opened, true);
  assert.equal(run(MACHINE.initial({ seed: 99 }), { type: "start", date: "x" }).seed, 99);
});

test("machine: full sequence with conditional screens, and Back restores each previous state", () => {
  let s = started("A");
  const screens = [s.screen];
  const seq = ["next", { type: "tally", option: "C", value: 5 }, "next", "next", sel("b_trust"), "next", sel("l_feeds"), "next",
    sel("k_face"), "next", sel("m_quest"), "next", "next", "next", sel("reinterpret"), "next", sel("literal"), "next",
    "next", "next", { type: "tally", option: "C", value: 20 }, "next", sel("1"), "next"];
  // recorded: the states Back should return to. Tally edits amend the current state rather than adding one.
  const recorded = [s];
  for (const a of seq) {
    const n = run(s, a);
    if (n !== s) {
      if (a.type === "tally") recorded[recorded.length - 1] = n; else recorded.push(n);
    }
    s = n;
    if (screens[screens.length - 1] !== s.screen) screens.push(s.screen);
  }
  assert.deepEqual(screens, ["title", "hook", "branches", "bills", "list", "check", "gap", "unseal", "case1", "case2",
    "gazette", "countries", "revote", "discussion", "end"]);
  assert.equal(s.opened, true);
  assert.deepEqual(plain(s.hook), { A: 0, B: 0, C: 5, D: 0 });
  assert.equal(s.discussion, 1);
  assert.equal(MACHINE.classVotes(s), 8);
  // Back walks the history: each step restores the state before the last recorded action.
  let b = s;
  for (let i = recorded.length - 2; i >= 0; i--) {
    b = run(b, "back");
    const { history: _h1, ...got } = b;
    const { history: _h2, ...want } = recorded[i];
    assert.deepEqual(plain(got), plain(want));
  }
  b = run(b, "back");
  assert.equal(b.screen, "setup");
  assert.equal(run(b, "back"), b, "Back at the start is a no-op");
});

test("machine: list screen only for b_trust; no-case card only for a clear LOOPHOLE; Case 2 skipped otherwise", () => {
  const toBills = (c = "A") => run(started(c), "next", "next", "next");
  assert.equal(run(toBills(), sel("b_narrow"), "next").screen, "check");
  assert.equal(run(toBills(), sel("b_tough"), "next").screen, "check");
  assert.equal(run(toBills(), sel("b_trust"), "next").screen, "list");
  const toCase1 = (bill, move) => run(toBills(), sel(bill), "next", sel("k_tick"), "next", sel(move), "next", "next", "next");
  assert.equal(run(toCase1("b_narrow", "m_lite"), sel("uphold"), "next").screen, "nocase");
  assert.equal(run(toCase1("b_narrow", "m_chat"), sel("uphold"), "next").screen, "case2");
  assert.equal(run(toCase1("b_narrow", "m_comply"), sel("uphold"), "next").screen, "gazette");
  assert.equal(run(toCase1("b_tough", "m_lite"), sel("uphold"), "next").screen, "gazette");
});

test("machine: sealed constitution must be opened before Case 1", () => {
  let s = run(started("B"), "next", "next", "next", sel("b_narrow"), "next", sel("k_tick"), "next", sel("m_comply"), "next");
  assert.equal(s.screen, "unseal");
  assert.equal(s.opened, false);
  s = run(s, "next");
  assert.equal(s.screen, "unseal");
  assert.equal(s.opened, true);
  assert.equal(run(s, "next").screen, "case1");
});

test("machine: Strike down cannot be chosen under A", () => {
  const s = run(started("A"), "next", "next", "next", sel("b_tough"), "next", sel("k_tick"), "next", sel("m_comply"), "next", "next", "next");
  assert.equal(s.screen, "case1");
  const strike = MACHINE.options(s).find((o) => o.value === "strike");
  assert.equal(strike.locked, true);
  assert.equal(strike.lockReason, CONTENT.lockText);
  assert.equal(run(s, sel("strike")), s);
  assert.equal(run(s, { type: "tally", option: "D", value: 30 }, { type: "tally", option: "A", value: 1 }, "next").case1.ruling, "uphold");
});

test("machine: highest count wins; ties prompt the Speaker's casting vote; splits recorded", () => {
  const bills = run(started(), "next", "next", "next");
  // Unique highest.
  let s = run(bills, { type: "tally", option: "A", value: 4 }, { type: "tally", option: "B", value: 9 }, { type: "tally", option: "C", delta: 1 }, "next");
  assert.equal(s.bill, "b_tough");
  // Clicking a card that is not highest is ignored when counts are entered.
  s = run(bills, { type: "tally", option: "A", value: 4 }, { type: "tally", option: "B", value: 9 }, sel("b_narrow"));
  assert.equal(s.bill, null);
  // Tie.
  s = run(bills, { type: "tally", option: "A", value: 6 }, { type: "tally", option: "C", value: 6 }, { type: "tally", option: "B", value: 2 }, "next");
  assert.equal(s.bill, null);
  assert.deepEqual(plain(s.tie), ["A", "C"]);
  assert.equal(run(s, "next"), s, "Next does nothing while the tie stands");
  assert.equal(run(s, sel("b_tough")).bill, null, "a card outside the tie cannot win");
  const cast = run(s, sel("b_trust"));
  assert.equal(cast.bill, "b_trust");
  assert.equal(cast.tie, null);
  // No counts: clicking the winner decides directly; no counts and Next does nothing.
  assert.equal(run(bills, sel("b_narrow")).bill, "b_narrow");
  assert.equal(run(bills, "next"), bills);
  // Split on a court ruling; unanimous gives no minority.
  const c1 = run(started("B"), "next", "next", "next", sel("b_narrow"), "next", sel("k_tick"), "next", sel("m_comply"), "next", "next", "next");
  const split = run(c1, { type: "tally", option: "C", value: 17 }, { type: "tally", option: "A", value: 8 }, { type: "tally", option: "B", value: 3 }, "next");
  assert.deepEqual(plain(split.case1), { id: "kim", ruling: "strike", split: [17, 11] });
  assert.equal(MACHINE.minority(split).value, "uphold");
  const unanimous = run(c1, { type: "tally", option: "A", value: 28 }, "next");
  assert.deepEqual(plain(unanimous.case1.split), [28, 0]);
  assert.equal(MACHINE.minority(unanimous), null);
  assert.equal(run(c1, sel("reinterpret")).case1.split, undefined);
});

test("machine: skipAct routes to the Clerk card; Back restores the pre-skip state", () => {
  const bills = run(started("A"), "next", "next", "next");
  const s = run(bills, "skipAct");
  assert.equal(s.screen, "clerk");
  assert.equal(s.bill, "b_narrow");
  assert.equal(s.byClerk.bill, true);
  assert.deepEqual(plain(s.skipped), ["I"]);
  assert.deepEqual(plain(s.clerkCard), { act: "I", decisions: { bill: "b_narrow" } });
  assert.equal(MACHINE.classVotes(s), 1, "only the hook vote is the class's");
  const back = run(s, "back");
  const { history: _a, ...got } = back;
  const { history: _b, ...want } = bills;
  assert.deepEqual(plain(got), plain(want));
  assert.equal(run(s, "next").screen, "check");
  // Nothing left to decide: skip is a no-op.
  assert.equal(run(bills, sel("b_tough"), "skipAct").screen, "bills");
  // Outside an act: no-op.
  assert.equal(run(started(), "skipAct").screen, "title");
});

test("machine: part-way skips keep the votes already taken", () => {
  // Act II after the list vote.
  const list = run(started("A"), "next", "next", "next", sel("b_trust"), "next", sel("l_all"), "next");
  assert.equal(list.screen, "check");
  const s = run(list, "skipAct");
  assert.equal(s.list, "l_all");
  assert.equal(s.check, "k_face");
  assert.ok(!s.byClerk.list);
  assert.equal(s.byClerk.check, true);
  assert.deepEqual(plain(s.clerkCard.decisions), { check: "k_face" });
  assert.equal(run(s, "next").screen, "gap");
  // Act II from the list screen decides both.
  const both = run(list, "back", "skipAct");
  assert.deepEqual(plain(both.clerkCard.decisions), { check: "k_face" }, "list already decided before Back");
  const fresh = run(started("A"), "next", "next", "next", sel("b_trust"), "next", "skipAct");
  assert.deepEqual(plain(fresh.clerkCard.decisions), { list: "l_feeds", check: "k_face" });
  // Act IV after Case 1: the Clerk rules only on Case 2.
  const c1 = run(started("A"), "next", "next", "next", sel("b_narrow"), "next", sel("k_tick"), "next", sel("m_quest"), "next", "next", "next", sel("uphold"));
  const iv = run(c1, "skipAct");
  assert.equal(iv.case1.ruling, "uphold");
  assert.ok(!iv.byClerk.case1);
  assert.deepEqual(plain(iv.case2), { ruling: "purposive" });
  assert.equal(iv.byClerk.case2, true);
  assert.equal(run(iv, "next").screen, "gazette");
});

test("machine: Act IV cannot be skipped until the constitution is unsealed", () => {
  const u = run(started("B"), "next", "next", "next", sel("b_narrow"), "next", sel("k_tick"), "next", sel("m_lite"), "next");
  assert.equal(u.screen, "unseal");
  assert.equal(run(u, "skipAct"), u);
  const s = run(u, "next", "skipAct");
  assert.equal(s.screen, "clerk");
  assert.deepEqual(plain(s.case1), { id: "kim", ruling: "strike" });
  assert.equal(run(s, "next").screen, "gazette");
});

test("machine: restart returns to setup and keeps the setup choices", () => {
  const s = run(MACHINE.initial({ seed: 5 }), { type: "set-label", value: "9X" }, { type: "set-mode", value: "open" },
    { type: "set-constitution", value: "B" }, { type: "start", date: "d" }, "next", "restart");
  assert.equal(s.screen, "setup");
  assert.equal(s.label, "9X");
  assert.equal(s.mode, "open");
  assert.equal(s.choice, "B");
  assert.equal(s.seed, 5);
  assert.deepEqual(plain(s.history), []);
});
