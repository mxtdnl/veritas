// Phase 7b: one test (or more) per behavioural REVIEW.md finding that was fixed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadBlocks } from "./load-model.mjs";

const { CONTENT, MODEL, DESIGN, MACHINE, KEYS } = loadBlocks(["KEYS"]);
const spec = readFileSync(new URL("../spec.md", import.meta.url), "utf8");
const plain = (x) => JSON.parse(JSON.stringify(x));
const run = (s, ...actions) => actions.reduce((st, a) => MACHINE.step(st, typeof a === "string" ? { type: a } : a), s);
const sel = (value) => ({ type: "select", value });
const tally = (option, value) => ({ type: "tally", option, value });
function started(constitution) {
  return run(MACHINE.initial({ seed: 7 }), { type: "set-mode", value: "sealedChoose" },
    { type: "set-constitution", value: constitution }, { type: "start", date: "2026-10-16" });
}
// Title → … → Case 1 with the given Bill and move (list l_feeds under b_trust).
function toCase1(constitution, bill, move) {
  let s = run(started(constitution), "next", "next", "next", sel(bill), "next");
  if (bill === "b_trust") s = run(s, sel("l_feeds"), "next");
  return run(s, sel("k_face"), "next", sel(move), "next", "next", "next");
}
const ctx = (o = {}) => ({ typing: false, gallery: false, screen: "case1", confirm: null, glossary: false, view: null,
  canSkip: true, values: ["uphold", "reinterpret", "declare"], ...o });
const key = (k, o) => { const a = KEYS.resolve(k, ctx(o)); return a && plain(a); };

test("B1: under A, Reinterpret in Kim keeps the ban in the Law Book and adds the court's reading", () => {
  for (const bill of ["b_narrow", "b_trust"]) {
    const s = run(toCase1("A", bill, "m_lite"), sel("reinterpret"));
    const s1 = plain(MODEL.lawBook(s)).find((p) => p.id === "act-1");
    assert.equal(s1.status, "REINTERPRETED");
    assert.match(s1.text, /may not have an account/, "§1 still prohibits");
    assert.equal(s1.text, CONTENT.bills[bill].sections[0]);
    assert.equal(s1.reading, CONTENT.cases.kim.reinterpret);
    assert.ok(!plain(MODEL.lawBook(s)).some((p) => p.status === "VOID"));
  }
  // Marlow: §2 keeps its words too.
  const m = run(toCase1("A", "b_tough", "m_comply"), sel("reinterpret"));
  const s2 = plain(MODEL.lawBook(m)).find((p) => p.id === "act-2");
  assert.equal(s2.text, CONTENT.bills.b_tough.sections[1]);
  assert.equal(s2.reading, CONTENT.cases.marlow.reinterpret);
  assert.equal(CONTENT.noRule.reading.replace("{text}", s2.reading), "Read by the Court: " + CONTENT.cases.marlow.reinterpret);
});

test("B2: under B, striking down §1 skips Case 2; Glimmer has no rule to break; dependent lines have no effect", () => {
  for (const [bill, move] of [["b_narrow", "m_chat"], ["b_narrow", "m_quest"], ["b_trust", "m_chat"]]) {
    const c1 = toCase1("B", bill, move);
    assert.equal(c1.moveResult, "ARGUABLE");
    const s = run(c1, sel("strike"));
    assert.equal(MODEL.ruleVoid(s), true);
    const next = run(s, "next");
    assert.equal(next.screen, "nocase", `${bill} ${move}: no Case 2 after §1 is void`);
    assert.equal(run(next, "next").screen, "gazette");
    assert.equal(next.case2, null);
    assert.equal(MODEL.glimmerStatus(next), "NO_RULE");
    assert.equal(MODEL.headline(next), "VOID");
    const book = plain(MODEL.lawBook(next));
    assert.equal(book.find((p) => p.id === "act-2").noEffect, true);
    assert.equal(!!(book.find((p) => p.id === "reg-list") || {}).noEffect, bill === "b_trust");
    assert.ok(!book.find((p) => p.id === "act-3").noEffect);
    assert.ok(!book.find((p) => p.id === "reg-check").noEffect);
  }
  // A Glimmer that followed the law keeps COMPLIED; uphold keeps Case 2.
  assert.equal(MODEL.glimmerStatus(run(toCase1("B", "b_narrow", "m_comply"), sel("strike"))), "COMPLIED");
  assert.equal(run(toCase1("B", "b_narrow", "m_chat"), sel("uphold"), "next").screen, "case2");
  // Marlow strikes §2, not the rule: Case 2 is never reached under b_tough (all CAUGHT), and ruleVoid stays false.
  assert.equal(MODEL.ruleVoid(run(toCase1("B", "b_tough", "m_chat"), sel("strike"))), false);
  // The Clerk's Act IV under B never produces the contradiction.
  const clerk = run(toCase1("B", "b_narrow", "m_chat"), "skipAct");
  assert.deepEqual(plain(clerk.clerkCard.decisions), { case1: { id: "kim", ruling: "strike" } });
  assert.equal(run(clerk, "next").screen, "nocase");
  assert.equal(CONTENT.glimmerStatus.NO_RULE, "§1 is void, so there is no rule for Glimmer to break.");
});

test("M3: the split names a plurality as 'n of total', and a tie as decided by the Speaker's casting vote", () => {
  const c1 = toCase1("A", "b_narrow", "m_comply");
  // Uphold 6 · Reinterpret 8 · Declare 9.
  const plural = run(c1, tally("A", 6), tally("B", 8), tally("C", 9), "next");
  assert.equal(plural.case1.ruling, "declare");
  assert.equal(MACHINE.splitLine(plural), "Decided by 9 of 23 judges");
  // Two cards voted: the spec's "Decided n to m".
  assert.equal(MACHINE.splitLine(run(c1, tally("A", 14), tally("C", 9), "next")), "Decided 14 to 9");
  // Tie, then the casting vote.
  const tie = run(c1, tally("B", 7), tally("C", 7), "next");
  assert.deepEqual(plain(tie.tie), ["B", "C"]);
  assert.equal(MACHINE.splitLine(run(tie, sel("reinterpret"))), "Decided 7 to 7 — on the Speaker's casting vote");
  const tie3 = run(c1, tally("A", 2), tally("B", 7), tally("C", 7), "next", sel("declare"));
  assert.equal(MACHINE.splitLine(tie3), "Decided by 7 of 16 judges — on the Speaker's casting vote");
  // Unanimous, or no counts: no split line.
  assert.equal(MACHINE.splitLine(run(c1, tally("A", 20), "next")), "");
  assert.equal(MACHINE.splitLine(run(c1, sel("uphold"))), "");
});

test("M4: with a confirmation open, Enter on a focused button is left to that button", () => {
  assert.equal(key("Enter", { confirm: "restart", onButton: true }), null, "No, go back keeps its own Enter");
  assert.equal(key("Enter", { confirm: "skip", onButton: true }), null);
  assert.deepEqual(key("Enter", { confirm: "restart", onButton: false }), { type: "restart" });
  assert.deepEqual(key("y", { confirm: "restart", onButton: true }), { type: "restart" });
  assert.deepEqual(key("n", { confirm: "restart", onButton: true }), { type: "confirm-no" });
});

test("M5: the printed teacher notes carry every screen's script, with its variants", () => {
  const html = DESIGN.teacherNotes();
  for (const k of Object.keys(CONTENT.screens).filter((x) => x !== "authored")) {
    const e = CONTENT.script[k];
    for (const f of ["timing", "say", "q", "a"]) assert.ok(html.includes(DESIGN.esc(e[f])), `${k}.${f}`);
    assert.ok(html.includes(">" + CONTENT.screens[k] + "</h3>"), k);
  }
  for (const t of [CONTENT.script.case1.qB, CONTENT.script.case1.aB, CONTENT.lockQuestion, CONTENT.script.gap.askComplied,
    CONTENT.script.nocase.sayVoid, CONTENT.script.nocase.aVoid]) assert.ok(html.includes(DESIGN.esc(t)), t);
  assert.equal((html.match(/<li>/g) || []).length, 9, "spec §12 and §1.3 lists unchanged");
});

test("M6: the three-countries panel states what judges can do about a rights breach, per constitution", () => {
  const R = CONTENT.countriesExtra.rights;
  assert.deepEqual(Object.keys(R), ["A", "B", "C"]);
  assert.notEqual(R.A, R.B);
  assert.match(R.A, /law stays in force/);
  assert.match(R.B, /cancel/);
  assert.match(R.C, /Constitutional Council/);
  for (const t of [CONTENT.countriesExtra.rightsRow, R.A, R.B, R.C]) assert.ok(t.split(/\s+/).length <= 20, t);
});

test("M7: skipping Act IV still shows the no-case card after a clear loophole", () => {
  for (const c of ["A", "B"]) {
    const clerk = run(toCase1(c, "b_narrow", "m_lite"), "skipAct");
    assert.equal(clerk.screen, "clerk");
    assert.equal(run(clerk, "next").screen, "nocase");
  }
  // When the Clerk rules on Case 2, the Gazette follows.
  assert.equal(run(toCase1("A", "b_narrow", "m_chat"), "skipAct", "next").screen, "gazette");
});

test("M8: the End screen states the learning outcome, verbatim from spec §1.1", () => {
  const m = spec.match(/### 1\.1 Learning outcome\n> \*\*(.+?)\*\*/);
  assert.equal(CONTENT.outcome, m[1]);
});

test("M9–M11: script timing, the branches line and the lock answer", () => {
  for (const k of ["list", "check"]) assert.match(CONTENT.script[k].timing, /skip partner talk if behind/);
  assert.ok(CONTENT.script.branches.say.startsWith("Veritas has three branches."));
  assert.ok(!/every country/i.test(CONTENT.script.branches.say));
  const a = CONTENT.script.case1.a;
  assert.ok(!/only say/.test(a));
  assert.match(a, /read it in a way that respects rights/);
  assert.match(a, /say publicly that it breaks them/);
  assert.ok(a.split(/\s+/).length <= 40);
});

test("M12: Enter in a tally box commits it; other keys still go to the box", () => {
  assert.deepEqual(key("Enter", { typing: true, tallyBox: true }), { type: "tally-commit" });
  assert.equal(key("Enter", { typing: true, tallyBox: false }), null, "the class label field");
  assert.equal(key("ArrowRight", { typing: true, tallyBox: true }), null);
  assert.equal(key("3", { typing: true, tallyBox: true }), null);
});

test("M13: after 'Follow the law', the gap is still asked about and the 'Glimmer found a gap' question is not offered", () => {
  const toEnd = (move) => {
    let s = run(toCase1("A", "b_narrow", move), sel("uphold"), "next");
    while (s.screen !== "discussion") s = run(s, "next");
    return s;
  };
  const comply = toEnd("m_comply");
  assert.deepEqual(plain(MACHINE.discussionChoices(comply)), [0, 1]);
  assert.equal(run(comply, sel("2")), comply, "the hidden question cannot be chosen");
  assert.equal(run(comply, sel("1")).discussion, 1);
  assert.deepEqual(plain(MACHINE.discussionChoices(toEnd("m_lite"))), [0, 1, 2]);
  assert.ok(CONTENT.script.gap.askComplied);
});

test("7b authored copy: flagged, short, British spelling", () => {
  for (const k of ["noRule", "voteExtra", "glimmerStatus", "countriesExtra", "teacherExtra"]) assert.equal(CONTENT[k].authored, true, k);
  const lines = [CONTENT.noRule.card, CONTENT.noRule.noEffect, CONTENT.glimmerStatus.NO_RULE, CONTENT.voteExtra.splitOf,
    CONTENT.script.gap.askComplied, CONTENT.script.nocase.sayVoid, CONTENT.script.nocase.qVoid, CONTENT.script.nocase.aVoid];
  for (const t of lines) {
    for (const sentence of t.split(/(?<=[.?!])\s+/)) assert.ok(sentence.split(/\s+/).length <= 20, sentence);
  }
});

test("M2/M5 layout: the game fits the viewport, columns scroll only inside, the script panel is in the flow", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const css = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  const rule = (sel) => { const m = css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{([^}]*)\\}")); return m ? m[1] : ""; };
  assert.match(rule("#app.is-game"), /height:\s*100vh/);
  assert.match(rule("#app.is-game"), /overflow:\s*hidden/);
  assert.match(rule(".game"), /height:\s*100%/);
  assert.match(rule(".game__main"), /min-height:\s*0/);
  const cols = rule('.game__main > .stage, .game__main > [data-region="book"]');
  assert.match(cols, /max-height:\s*100%/);
  assert.match(cols, /overflow:\s*hidden auto/);
  assert.ok(!/position:\s*fixed/.test(rule(".script")), "the script panel no longer overlays the stage");
  assert.match(rule(".script"), /max-height/);
});

test("spec v2 amendments: the copy in index.html matches spec.md", () => {
  assert.ok(spec.includes(CONTENT.script.case1.a), "§7.4 lock answer");
  assert.ok(spec.includes(CONTENT.noRule.card), "§4.4 no-rule card");
  assert.ok(spec.includes(CONTENT.noRule.noEffect), "§4.4 no-effect note");
  assert.ok(spec.includes(`| ${CONTENT.countriesExtra.rightsRow} | ${CONTENT.countriesExtra.rights.A} | ${CONTENT.countriesExtra.rights.B} | ${CONTENT.countriesExtra.rights.C} |`), "§4.5 row");
});
