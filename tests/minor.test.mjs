// Minor REVIEW.md findings (m1–m19) fixed after Phase 8, and the spec amendments they needed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadBlocks, loadSource } from "./load-model.mjs";

const { CONTENT, DESIGN, MACHINE, KEYS } = loadBlocks(["KEYS"]);
const source = loadSource().html;
const spec = readFileSync(new URL("../spec.md", import.meta.url), "utf8");
const plain = (x) => JSON.parse(JSON.stringify(x));
const run = (s, ...actions) => actions.reduce((st, a) => MACHINE.step(st, typeof a === "string" ? { type: a } : a), s);
const sel = (value) => ({ type: "select", value });
const tally = (option, value) => ({ type: "tally", option, value });
function started(constitution) {
  return run(MACHINE.initial({ seed: 7 }), { type: "set-mode", value: "sealedChoose" },
    { type: "set-constitution", value: constitution }, { type: "start", date: "2026-10-16" });
}
function toCase1(constitution, bill, move) {
  let s = run(started(constitution), "next", "next", "next", sel(bill), "next");
  if (bill === "b_trust") s = run(s, sel("l_feeds"), "next");
  return run(s, sel("k_face"), "next", sel(move), "next", "next", "next");
}
const ctx = (o = {}) => ({ typing: false, gallery: false, screen: "case1", confirm: null, glossary: false, view: null,
  canSkip: true, values: ["uphold", "reinterpret", "declare"], ...o });
const key = (k, o) => { const a = KEYS.resolve(k, ctx(o)); return a && plain(a); };

test("m1, m2: the gap answer and Glimmer's status allow for a court reading the words by their purpose", () => {
  assert.match(CONTENT.script.gap.a, /a court may decide the words cover you/);
  assert.ok(!/closed the gap/.test(CONTENT.glimmerStatus.CLOSED_BY_COURT), "only Parliament closes a gap (§1.3)");
  assert.match(CONTENT.glimmerStatus.CLOSED_BY_COURT, /purpose/);
});

test("m3, m4: Veritas simplifications are not stated as general facts", () => {
  assert.ok(!/everyone we elect/.test(CONTENT.script.branches.a));
  const def = (t) => CONTENT.glossary.find((g) => g.term === t).def;
  assert.match(def("Act"), /In Veritas, a Bill becomes an Act/);
  assert.match(def("Parliament"), /^In Veritas,/);
});

test("m5: each list card shows its consequence, and the spec says so", () => {
  // The list card markup is built in the APP block, which the tests do not load; check the source line instead.
  assert.match(source, /sc === "list"\) c\.html = [^\n]*CONTENT\.lists\[o\.value\]\.consequence/);
  for (const id of ["l_feeds", "l_wide", "l_all"]) {
    assert.ok(spec.includes(`| \`${id}\` | ${CONTENT.lists[id].text} | "${CONTENT.lists[id].consequence}" |`), id);
  }
  assert.match(spec, /Each list card shows its consequence beneath the option/);
});

test("m6: Case 2 'Read the words' quotes the words of the Bill in force", () => {
  for (const [bill, move] of [["b_narrow", "m_chat"], ["b_narrow", "m_quest"], ["b_trust", "m_chat"], ["b_trust", "m_quest"]]) {
    const s = run(toCase1("A", bill, move), sel("uphold"), "next");
    assert.equal(s.screen, "case2", `${bill} ${move}`);
    const text = MACHINE.case2Text(s, "literal");
    if (bill === "b_trust") {
      assert.ok(!/main purpose/.test(text), "the Trust Bill has no 'main purpose' words");
      assert.match(text, /not a photo feed app/);
    } else assert.match(text, /main purpose/);
    assert.equal(MACHINE.case2Text(s, "purposive"), CONTENT.case2.options.purposive[move]);
  }
  assert.match(spec, /`b_trust` \(`l_feeds`\): "It is now a messaging app \/ a game, not a photo feed app\. Not covered\."/);
});

test("m9: an element marked data-nolink is not glossary-linked; linking resumes after it", () => {
  const out = DESIGN.linkTerms('<h2 class="gz__headline" data-nolink>COURT CANCELS PARLIAMENT\'S LAW</h2><p>The court sits.</p>');
  assert.ok(out.startsWith('<h2 class="gz__headline" data-nolink>COURT CANCELS PARLIAMENT\'S LAW</h2>'));
  assert.ok(out.includes('data-value="Court"'), "first use after the headline is linked");
  assert.ok(!out.includes('data-value="Parliament"'));
  const nested = DESIGN.linkTerms("<div data-nolink><div>Parliament</div> Minister</div><p>Minister</p>");
  assert.equal((nested.match(/data-value="Minister"/g) || []).length, 1, "nested elements stay inside the unlinked one");
  assert.ok(!nested.includes('data-value="Parliament"'));
});

test("m12: a click the counts do not allow names the counted winner", () => {
  let s = run(started("A"), "next", "next", "next");
  assert.equal(s.screen, "bills");
  assert.equal(MACHINE.countedWinners(s, "b_tough"), null, "no counts: any click wins");
  s = run(s, tally("A", 5), tally("B", 2));
  assert.deepEqual(plain(MACHINE.countedWinners(s, "b_tough")), ["A"]);
  assert.equal(MACHINE.countedWinners(s, "b_narrow"), null, "the winning card is allowed");
  assert.equal(run(s, sel("b_tough")), s, "the game still ignores it");
  assert.match(CONTENT.nav.hintCounted, /\{letters\}/);
});

test("m13: while the glossary is open, game keys do nothing; G, Escape, D and F still work", () => {
  for (const k of ["ArrowRight", " ", "ArrowLeft", "1", "k", "r", "s"]) assert.equal(key(k, { glossary: true }), null, k);
  assert.deepEqual(key("g", { glossary: true }), { type: "glossary-toggle" });
  assert.deepEqual(key("Escape", { glossary: true }), { type: "glossary-close" });
  assert.deepEqual(key("d", { glossary: true }), { type: "theme-toggle" });
  assert.deepEqual(key("f", { glossary: true }), { type: "fullscreen" });
  assert.deepEqual(key("ArrowRight"), { type: "next" }, "closed drawer: unchanged");
});

test("m7: every Law Book line names its author under the seal", () => {
  const html = DESIGN.lawBook([{ author: "PARL", num: "§1", text: "x", stamps: [] }, { author: "MIN", text: "y", stamps: [] },
    { author: "COURT", text: "z", stamps: [] }], "T");
  for (const a of ["PARL", "MIN", "COURT"]) assert.ok(html.includes('<span class="prov__author" aria-hidden="true" data-nolink>' + CONTENT.ui.author[a] + "</span>"), a);
  for (const a of ["PARL", "MIN", "COURT", "CLERK", "GLIMMER"]) assert.ok(CONTENT.ui.author[a], a);
});

test("m14: the Opening's screen timings still sum to its 3-minute slot", () => {
  const secs = (t) => { const [m, s] = t.split(":").map(Number); return m * 60 + s; };
  const S = CONTENT.script;
  assert.equal(S.title.timing, "0:40");
  assert.equal(secs(S.title.timing) + secs(S.hook.timing) + secs(S.branches.timing), 180);
});

test("m16–m19: amended copy matches spec.md", () => {
  assert.ok(spec.includes(CONTENT.clerk.script), "§7.5 Clerk line");
  assert.equal(CONTENT.script.clerk.say, CONTENT.clerk.script);
  assert.ok(!/Clerk of Parliament has decided/.test(CONTENT.clerk.script));
  assert.ok(spec.includes(CONTENT.dissent) && /^In many real courts/.test(CONTENT.dissent), "§4.4 dissent");
  assert.ok(spec.includes(`REINTERPRETED → "${CONTENT.headlines.REINTERPRETED}"`) && CONTENT.headlines.REINTERPRETED === "JUDGES NARROW THE LAW", "§4.5.1");
  assert.ok(spec.includes(`"${CONTENT.bills.b_narrow.means}"`) && !/fair/.test(CONTENT.bills.b_narrow.means), "§4.1");
  for (const b of ["b_tough", "b_trust"]) assert.ok(spec.includes(`"${CONTENT.bills[b].means}"`), b);
});
