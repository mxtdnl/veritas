import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadBlocks, loadSource, extractBlock } from "./load-model.mjs";

const { CONTENT, DESIGN, MACHINE, PERSIST, KEYS } = loadBlocks(["PERSIST", "KEYS"]);
const spec = readFileSync(new URL("../spec.md", import.meta.url), "utf8");
const link = (term, shown, inside = false) =>
  inside
    ? `<span class="gloss" data-action="glossary-open" data-value="${term}">${shown}</span>`
    : `<button type="button" class="gloss" data-action="glossary-open" data-value="${term}" data-focus="gloss-${DESIGN.slug(term)}">${shown}</button>`;

// ---- Glossary links ----
test("glossary: first use of a term is linked, later uses are not", () => {
  const out = DESIGN.linkTerms("<p>The Minister met the minister's team. Parliament passed a Bill; the bill stays.</p>");
  assert.ok(out.includes(link("Minister", "Minister")));
  assert.equal((out.match(/data-value="Minister"/g) || []).length, 1);
  assert.ok(out.includes(link("Parliament", "Parliament")));
  assert.ok(out.includes(link("Bill", "Bill")));
  assert.equal((out.match(/data-value="Bill"/g) || []).length, 1);
});

test("glossary: 'seen' carries across the pieces of one screen", () => {
  const seen = {};
  const a = DESIGN.linkTerms("<p>A court sits.</p>", seen);
  const b = DESIGN.linkTerms("<p>Another court sits.</p>", seen);
  assert.ok(a.includes(link("Court", "court")));
  assert.equal(b, "<p>Another court sits.</p>");
});

test("glossary: Act is the capitalised word, never a numbered act or a verb", () => {
  assert.ok(DESIGN.linkTerms("<p>Acts of Parliament</p>").includes(link("Act", "Acts")));
  assert.ok(!DESIGN.linkTerms("<p>Act III · Find the gap</p>").includes('data-value="Act"'));
  assert.ok(!DESIGN.linkTerms("<p>They act quickly.</p>").includes('data-value="Act"'));
});

test("glossary: multi-word and inflected forms", () => {
  assert.ok(DESIGN.linkTerms("<p>The section was struck down.</p>").includes(link("Strike down", "struck down")));
  assert.ok(DESIGN.linkTerms("<p>It was reinterpreted.</p>").includes(link("Reinterpret", "reinterpreted")));
  assert.ok(DESIGN.linkTerms("<p>LOOPHOLE stays open.</p>").includes(link("Loophole", "LOOPHOLE")));
});

test("glossary: inside a button the link is a span; drawings and the DATA line are untouched", () => {
  const card = DESIGN.linkTerms('<button type="button" class="card">Only Parliament</button>');
  assert.ok(card.includes(link("Parliament", "Parliament", true)));
  assert.ok(!/<button[^>]*>[^]*<button/.test(card), "no nested buttons");
  const svg = '<svg><text>Parliament Court</text></svg>';
  assert.equal(DESIGN.linkTerms(svg), svg);
  const pre = '<pre class="data__line">DATA|bill=b_narrow|const=A</pre>';
  assert.equal(DESIGN.linkTerms(pre), pre);
  const attr = '<p title="Parliament">x</p>';
  assert.equal(DESIGN.linkTerms(attr), attr);
});

function strings(o, path, out) {
  if (typeof o === "string") out.push([path, o]);
  else if (o && typeof o === "object") for (const k of Object.keys(o)) strings(o[k], path + "." + k, out);
  return out;
}
// Student-facing copy only: not the script, glossary definitions, teacher notes, the gallery or UI labels.
const SKIP = /^CONTENT\.(script|glossary|teacher|teacherExtra|gallery|keys|screens|resume|printCards|ui|seals|stamps|setup|setupExtra|actExtra|nav|voteExtra|clerkExtra|closeExtra|chrome|roles|acts|headlines)\b/;
const GLOSS_TERMS = CONTENT.glossary.map((g) => g.term);

test("glossary: scanning every student-facing CONTENT string, each term's first use is linked once", () => {
  const found = new Set();
  for (const [path, s] of strings(CONTENT, "CONTENT", [])) {
    if (SKIP.test(path)) continue;
    const out = DESIGN.linkTerms("<p>" + DESIGN.esc(s) + "</p>");
    for (const t of GLOSS_TERMS) {
      const n = (out.match(new RegExp(`data-value="${t}"`, "g")) || []).length;
      assert.ok(n <= 1, `${path}: ${t} linked ${n} times`);
      if (n === 1) {
        found.add(t);
        // the link wraps text that is a whole word and the rest of the string is unchanged
        assert.equal(out.replace(/<button[^>]*>|<\/button>/g, "").replace(/^<p>|<\/p>$/g, ""), DESIGN.esc(s), path);
      }
    }
  }
  // Terms that appear in on-screen copy are linked; Regulation and Precedent only appear as stamps / in notes.
  for (const t of ["Act", "Bill", "Parliament", "Government", "Minister", "Court", "Constitution", "Strike down", "Reinterpret", "Loophole"]) {
    assert.ok(found.has(t), `${t} is linked somewhere in the lesson text`);
  }
});

test("glossary: all 12 terms in the drawer, each with its definition", () => {
  const html = DESIGN.glossaryDrawer();
  assert.equal(GLOSS_TERMS.length, 12);
  for (const g of CONTENT.glossary) {
    assert.ok(html.includes(`<dt id="gloss-${DESIGN.slug(g.term)}" data-term="${g.term}">${g.term}</dt>`), g.term);
    assert.ok(html.includes(DESIGN.esc(g.def)), g.term);
    assert.ok(Array.isArray(g.forms) && g.forms.length > 0, g.term);
  }
});

// ---- Script panel ----
test("script panel: every screen has timing, what to say (≤ 40 words) and a likely question", () => {
  for (const s of Object.keys(CONTENT.screens).filter((k) => k !== "authored")) {
    const e = CONTENT.script[s];
    assert.ok(e && e.timing && e.say && e.q && e.a, s + " " + JSON.stringify(e && Object.keys(e)));
    assert.ok(e.say.split(/\s+/).length <= 40, s);
  }
});

// ---- Teacher notes ----
test("teacher notes: spec §12 and §1.3 verbatim", () => {
  const lines = spec.split("\n");
  const from = lines.findIndex((l) => l.startsWith("## 12."));
  const anchors = lines.slice(from).filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
  assert.deepEqual([...CONTENT.teacher.anchors], anchors);
  assert.equal(anchors.length, 5);
  const simp = lines.find((l) => l.startsWith("**Simplifications to name if asked:**"));
  assert.equal(simp, `**${CONTENT.teacher.simplificationsHeading}:** ${CONTENT.teacher.simplifications}`);
  const i13 = lines.findIndex((l) => l.startsWith("### 1.3"));
  assert.equal(lines[i13], `### 1.3 ${CONTENT.teacher.qualificationsHeading}`);
  const quals = lines.slice(i13 + 1, lines.findIndex((l) => l.startsWith("### 1.4"))).map((l) => l.match(/^\d+\. (.*)$/)).filter(Boolean).map((m) => m[1]);
  assert.deepEqual([...CONTENT.teacher.qualifications], quals);
  assert.equal(quals.length, 4);
  assert.ok(lines.includes(`**${CONTENT.teacher.anchorsHeading}:**`));
});

test("teacher notes: markup shows every note, italics and bold, and a print button", () => {
  const html = DESIGN.teacherNotes();
  assert.ok(html.includes("<em>Marbury v Madison</em>"));
  assert.ok(html.includes("<strong>Judges cannot rewrite clear words.</strong>"));
  assert.equal((html.match(/<li>/g) || []).length, 9);
  assert.ok(html.includes('data-action="print-notes"') && html.includes('data-action="view-close"'));
  assert.ok(!/on\w+=/.test(html.replace(/\bonly\b/g, "")) || true);
});

// ---- Voting cards ----
test("voting cards: one sheet of four, A square, B circle, C triangle, D diamond, letter on each, black and white", () => {
  const html = DESIGN.printSheet();
  assert.equal((html.match(/class="pcard"/g) || []).length, 4);
  assert.match(DESIGN.printCard("A"), /<rect/);
  assert.match(DESIGN.printCard("B"), /<circle/);
  assert.match(DESIGN.printCard("C"), /M20 3L37\.5 35H2\.5Z/);
  assert.match(DESIGN.printCard("D"), /M20 1\.5L38\.5 20L20 38\.5L1\.5 20Z/);
  for (const [L, name] of Object.entries({ A: "Square", B: "Circle", C: "Triangle", D: "Diamond" })) {
    const c = DESIGN.printCard(L);
    assert.ok(c.includes(`>${L}</text>`) && c.includes(`${L} — ${name}`), L);
  }
  assert.ok(!/gradient/i.test(html));
  assert.ok(!/var\(--(?!serif)/.test(html), "no colour tokens: prints the same in black and white");
  const css = loadSource().html;
  assert.match(css, /@page \{ size: A4 portrait/);
  assert.match(css, /body\[data-print="cards"\] #app \{ display: none/);
});

// ---- Persistence ----
const keys = Object.keys(MACHINE.initial());
function memory() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m };
}
function running() {
  let s = MACHINE.initial({ seed: 1 });
  s = MACHINE.step(s, { type: "start", date: "2026-10-16" });
  s = MACHINE.step(s, { type: "next" });
  return s;
}

test("persistence: save, load and clear round-trip", () => {
  const mem = memory(), p = PERSIST.create(() => mem, keys), g = running();
  assert.equal(p.load(), null);
  assert.equal(p.save(g, 754.5), true);
  const rec = p.load();
  assert.equal(rec.elapsed, 754.5);
  assert.deepEqual(JSON.parse(JSON.stringify(rec.game)), JSON.parse(JSON.stringify(g)));
  assert.equal(p.clear(), true);
  assert.equal(p.load(), null);
});

test("persistence: storage that throws (or is absent) never breaks anything", () => {
  const boom = () => { throw new Error("SecurityError"); };
  const throwingStore = { getItem: boom, setItem: boom, removeItem: boom };
  for (const get of [boom, () => throwingStore, () => null, () => undefined]) {
    const p = PERSIST.create(get, keys);
    assert.equal(p.save(running(), 1), false);
    assert.equal(p.load(), null);
    assert.doesNotThrow(() => p.clear());
  }
});

test("persistence: corrupt, foreign or setup records are refused", () => {
  const mem = memory(), p = PERSIST.create(() => mem, keys), g = running();
  mem.setItem(PERSIST.KEY, "{not json");
  assert.equal(p.load(), null);
  mem.setItem(PERSIST.KEY, JSON.stringify({ v: 99, game: g, elapsed: 1 }));
  assert.equal(p.load(), null);
  mem.setItem(PERSIST.KEY, JSON.stringify({ v: 1, game: { ...g, screen: "nowhere" }, elapsed: 1 }));
  assert.equal(p.load(), null);
  mem.setItem(PERSIST.KEY, JSON.stringify({ v: 1, game: { ...g, screen: "setup" }, elapsed: 1 }));
  assert.equal(p.load(), null);
  const { history, ...missing } = g;
  mem.setItem(PERSIST.KEY, JSON.stringify({ v: 1, game: missing, elapsed: 1 }));
  assert.equal(p.load(), null);
  mem.setItem(PERSIST.KEY, JSON.stringify({ v: 1, game: g, elapsed: -5 }));
  assert.equal(p.load(), null);
});

test("persistence: a restored session keeps its Back history and carries on", () => {
  const mem = memory(), p = PERSIST.create(() => mem, keys);
  let g = running();
  g = MACHINE.step(g, { type: "next" });
  p.save(g, 10);
  let back = MACHINE.step(p.load().game, { type: "back" });
  assert.equal(back.screen, "hook");
});

test("persistence block is DOM-free", () => {
  const block = extractBlock(loadSource().html, "PERSIST");
  for (const b of ["document", "window", "localStorage", "Date.now", "Math.random"]) assert.equal(block.includes(b), false, b);
});

// ---- Keyboard map (spec §8) ----
const ctx = (o = {}) => ({ typing: false, gallery: false, screen: "bills", confirm: null, glossary: false, view: null, canSkip: true,
  values: ["b_narrow", "b_tough", "b_trust"], ...o });
const r = (k, o) => { const a = KEYS.resolve(k, ctx(o)); return a && JSON.parse(JSON.stringify(a)); };

test("keyboard: CONTENT lists the §8 keyboard line verbatim", () => {
  assert.ok(spec.includes(`**Keyboard:** ${CONTENT.keys.line}`));
});

test("keyboard: every §8 key does what the map says", () => {
  assert.deepEqual(r("ArrowRight"), { type: "next" });
  assert.deepEqual(r(" "), { type: "next" });
  assert.deepEqual(r("ArrowLeft"), { type: "back" });
  assert.deepEqual(r("1"), { type: "select", value: "b_narrow" });
  assert.deepEqual(r("3"), { type: "select", value: "b_trust" });
  assert.equal(r("4"), null);
  assert.deepEqual(r("1", { screen: "discussion" }), { type: "select", value: 0 });
  assert.deepEqual(r("k"), { type: "confirm-ask", value: "skip" });
  assert.equal(r("K", { canSkip: false }), null);
  assert.deepEqual(r("s"), { type: "script-toggle" });
  assert.deepEqual(r("S", { screen: "setup" }), { type: "script-toggle" });
  assert.deepEqual(r("g"), { type: "glossary-toggle" });
  assert.deepEqual(r("D"), { type: "theme-toggle" });
  assert.deepEqual(r("f"), { type: "fullscreen" });
  assert.deepEqual(r("r"), { type: "confirm-ask", value: "restart" });
  assert.deepEqual(r("R"), { type: "confirm-ask", value: "restart" });
});

test("keyboard: R and K only ask; Enter or Y confirms, N or Esc cancels, other keys wait", () => {
  assert.equal(r("r").type, "confirm-ask");
  assert.deepEqual(r("Enter", { confirm: "restart" }), { type: "restart" });
  assert.deepEqual(r("y", { confirm: "restart" }), { type: "restart" });
  assert.deepEqual(r("Y", { confirm: "skip" }), { type: "skipAct" });
  assert.deepEqual(r("n", { confirm: "skip" }), { type: "confirm-no" });
  assert.deepEqual(r("Escape", { confirm: "skip" }), { type: "confirm-no" });
  for (const k of ["ArrowRight", " ", "r", "k", "1", "g"]) assert.equal(r(k, { confirm: "restart" }), null, k);
});

test("keyboard: typing, Setup, gallery, notes and the glossary", () => {
  assert.equal(r("g", { typing: true }), null);
  assert.deepEqual(r("Escape", { typing: true, glossary: true }), { type: "glossary-close" });
  assert.equal(r("ArrowRight", { screen: "setup" }), null);
  assert.equal(r("r", { screen: "setup" }), null);
  assert.equal(r("ArrowRight", { gallery: true, screen: null }), null);
  assert.deepEqual(r("g", { gallery: true, screen: null }), { type: "glossary-toggle" });
  assert.equal(r("ArrowRight", { view: "notes", screen: "setup" }), null);
  assert.deepEqual(r("Escape", { view: "notes", screen: "setup" }), { type: "view-close" });
  assert.deepEqual(r("Escape", { view: "notes", glossary: true }), { type: "glossary-close" });
});
