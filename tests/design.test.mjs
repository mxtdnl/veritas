import { test } from "node:test";
import assert from "node:assert/strict";
import { loadDesign, loadSource, extractBlock } from "./load-model.mjs";

const { CONTENT, DESIGN } = loadDesign();
const AUTHORS = ["PARL", "MIN", "COURT", "GLIMMER", "CLERK"];
const SPEC_STAMPS = [
  "ENACTED", "IN FORCE", "REGULATION — IN FORCE", "LOOPHOLE", "ARGUABLE — SEE YOU IN COURT", "CAUGHT",
  "COMPLIED", "REINTERPRETED", "INCOMPATIBLE — STILL IN FORCE", "VOID", "DECIDED BY THE CLERK",
];

test("DESIGN block is DOM-free and deterministic", () => {
  const block = extractBlock(loadSource().html, "DESIGN");
  for (const banned of ["document", "window", "Date.now", "Math.random"]) {
    assert.equal(block.includes(banned), false, `DESIGN block must not contain "${banned}"`);
  }
});

test("seal() returns an SVG for every author, sized as asked, with ring text", () => {
  for (const a of AUTHORS) {
    const svg = DESIGN.seal(a, 120);
    assert.match(svg, /^<svg[^>]*class="seal seal--/);
    assert.match(svg, /width="120" height="120"/);
    assert.ok(svg.includes("<textPath"), `${a} has ring text`);
    assert.ok(svg.includes(CONTENT.seals[a]), `${a} ring text comes from CONTENT`);
    assert.ok(svg.includes("font-variant:small-caps"));
    assert.ok(svg.includes("<pattern"), `${a} uses hatch patterns`);
  }
  assert.throws(() => DESIGN.seal("NOBODY", 50), /Unknown seal author/);
});

test("each author has a distinct guilloché parameter set and distinct geometry", () => {
  const keys = AUTHORS.map((a) => {
    const p = DESIGN.SEALS[a];
    return [p.R, p.r, p.d, p.copies, p.rim].join(",");
  });
  assert.equal(new Set(keys).size, AUTHORS.length);
  const strip = (s) => s.replace(/vx[a-z]\d+/g, "ID");
  const bodies = AUTHORS.map((a) => strip(DESIGN.seal(a, 100)));
  assert.equal(new Set(bodies).size, AUTHORS.length);
});

test("hypotrochoid stays inside its annulus", () => {
  const d = DESIGN.hypotrochoid(15, 4, 3.4, 53, 72, 0, 100, 100);
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  for (let i = 0; i < nums.length; i += 2) {
    const r = Math.hypot(nums[i] - 100, nums[i + 1] - 100);
    assert.ok(r >= 52.9 && r <= 72.1, `radius ${r} outside annulus`);
  }
});

test("every spec stamp word is implemented, with the ink filter", () => {
  assert.deepEqual(Object.values(CONTENT.stamps).sort(), [...SPEC_STAMPS].sort());
  for (const key of Object.keys(CONTENT.stamps)) {
    const svg = DESIGN.stamp(key);
    assert.ok(svg.includes('filter="url(#stamp-ink)"'), key);
    for (const line of CONTENT.stamps[key].split(" — ")) assert.ok(svg.includes(`>${line}</text>`), `${key}: ${line}`);
    assert.ok(svg.includes(`aria-label="${CONTENT.stamps[key]}"`));
  }
  assert.throws(() => DESIGN.stamp("NOPE"), /Unknown stamp/);
});

test("stamp rotation is seeded, deterministic and within -9° to -4°", () => {
  for (const key of Object.keys(CONTENT.stamps)) {
    for (let i = 0; i < 50; i++) {
      const a = DESIGN.stampAngle(key, "s" + i);
      assert.ok(a <= -4 && a >= -9, `${key} angle ${a}`);
      assert.equal(a, DESIGN.stampAngle(key, "s" + i));
    }
  }
  const angles = new Set(Array.from({ length: 20 }, (_, i) => DESIGN.stampAngle("VOID", i).toFixed(2)));
  assert.ok(angles.size > 10, "angles vary with the salt");
  assert.equal(DESIGN.stamp("VOID", { salt: "x" }), DESIGN.stamp("VOID", { salt: "x" }));
});

test("landing class is opt-in", () => {
  assert.ok(DESIGN.stamp("CAUGHT", { land: true }).includes("stamp--land"));
  assert.ok(!DESIGN.stamp("CAUGHT").includes("stamp--land"));
});

test("clock formats elapsed time and turns brass at 25:00, oxblood at 30:00", () => {
  assert.equal(DESIGN.formatClock(0), "00:00");
  assert.equal(DESIGN.formatClock(724.9), "12:04");
  assert.equal(DESIGN.formatClock(3725), "62:05");
  assert.equal(DESIGN.clockLevel(1499), "normal");
  assert.equal(DESIGN.clockLevel(1500), "brass");
  assert.equal(DESIGN.clockLevel(1799), "brass");
  assert.equal(DESIGN.clockLevel(1800), "oxblood");
  assert.ok(DESIGN.clock(1800).includes("clock--oxblood"));
});

test("option card: letter and shape always; selected adds tick and aria-pressed", () => {
  const off = DESIGN.optionCard({ letter: "B", text: "x", value: "B", action: "pick", selected: false });
  const on = DESIGN.optionCard({ letter: "B", text: "x", value: "B", action: "pick", selected: true });
  assert.ok(off.includes("<circle") && off.includes(">B</text>"));
  assert.ok(off.includes('aria-pressed="false"') && !off.includes("card__tick"));
  assert.ok(on.includes('aria-pressed="true"') && on.includes("card__tick") && on.includes("is-selected"));
  assert.ok(on.includes('data-action="pick"'));
});

test("tally strip has a box and +/- per option", () => {
  const html = DESIGN.tallyStrip([{ letter: "A" }, { letter: "B" }], { A: 4 }, "tally");
  assert.equal((html.match(/class="tally__box"/g) || []).length, 2);
  assert.equal((html.match(/data-delta="1"/g) || []).length, 2);
  assert.equal((html.match(/data-delta="-1"/g) || []).length, 2);
  assert.ok(html.includes('value="4"') && html.includes('value="0"'));
});

test("Law Book puts an author seal in the gutter and strikes void lines", () => {
  const html = DESIGN.lawBook([
    { author: "PARL", num: "§1", text: "Rule.", stamps: ["ENACTED"] },
    { author: "COURT", num: "", text: "Held.", stamps: ["VOID"], struck: true },
  ]);
  assert.ok(html.includes("seal--PARL") && html.includes("seal--COURT"));
  assert.equal((html.match(/prov--struck/g) || []).length, 1);
  assert.ok(html.includes(CONTENT.chrome.lawBook));
});

test("case folder has a typed tab and a Held: line", () => {
  const html = DESIGN.caseFolder({ ref: "VSC/2026/001", name: "A v B", facts: "F", held: "Upheld." });
  assert.ok(html.includes('folder__tab tw">VSC/2026/001'));
  assert.ok(html.includes(">Held:</span>") && html.includes("Upheld."));
});

test("envelope has a crack path and split wax halves", () => {
  const html = DESIGN.envelope(false);
  assert.ok(html.includes('class="env__crack"') && html.includes("env__waxA") && html.includes("env__waxB"));
  assert.ok(!html.includes("data-enter"));
  assert.ok(DESIGN.envelope(true).includes('data-enter="env--open"'));
});

test("ribbon lists the five stages in order", () => {
  const html = DESIGN.ribbon();
  const labels = [...html.matchAll(/<\/span>([A-Za-z]+)<\/li>/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["Bill", "Rules", "Gap", "Court", "Monday"]);
});

test("design rules: no gradients, shadows, rounded corners or network", () => {
  const { html } = loadSource();
  assert.equal(/gradient/i.test(html), false, "no gradients");
  assert.equal(/box-shadow|text-shadow|drop-shadow/i.test(html), false, "no shadows");
  for (const m of html.matchAll(/border-radius\s*:\s*([^;]+);/g)) assert.equal(m[1].trim(), "0", "square corners only");
  assert.equal(/<link\b|<script[^>]+src=|<img\b|url\(\s*['"]?https?:|@import/i.test(html), false, "no external resources");
  assert.equal(/(src|href)\s*=\s*["']https?:/i.test(html), false, "no network URLs");
});

test("dark theme is wired under the media query and data-theme", () => {
  const { html } = loadSource();
  assert.ok(/@media \(prefers-color-scheme: dark\)\s*{\s*:root:not\(\[data-theme="light"\]\)/.test(html));
  assert.ok(html.includes(':root[data-theme="dark"]'));
  for (const c of ["#14161B", "#1D2028", "#252935", "#ECE4D3", "#B6AE9C", "#7FB08D", "#D8A84E", "#D9707E", "#B79AD0", "#E5574B"]) {
    assert.ok(html.includes(c), c);
  }
});

test("authored CONTENT groups are flagged", () => {
  for (const k of ["seals", "ui", "gallery"]) assert.equal(CONTENT[k].authored, true, k);
});

test("option card: html body, display-only (static) cards and a note", () => {
  const html = DESIGN.optionCard({ letter: "A", html: "<b>x</b>", value: "v", action: "select" });
  assert.ok(html.includes("<b>x</b>") && html.startsWith("<button"));
  const stat = DESIGN.optionCard({ letter: "D", text: "Not sure", static: true });
  assert.ok(stat.startsWith('<div class="card card--static">') && !stat.includes("data-action"));
  assert.ok(stat.includes(">D</text>"), "static card keeps letter and shape");
  const tied = DESIGN.optionCard({ letter: "B", text: "x", value: "v", action: "select", note: "Tied" });
  assert.ok(tied.includes('class="card__note">Tied<') && tied.includes("is-noted"));
});

test("statute sets each Bill with §1–§3 and the What this means line, verbatim", () => {
  for (const id of ["b_narrow", "b_tough", "b_trust"]) {
    const b = CONTENT.bills[id];
    const html = DESIGN.statute(b);
    assert.ok(html.includes(DESIGN.esc(b.title)));
    b.sections.forEach((t, i) => assert.ok(html.includes(`§${i + 1}</span>${DESIGN.esc(t)}`), `${id} §${i + 1}`));
    assert.ok(html.includes(`${CONTENT.bills.meansLabel}:</span> ${DESIGN.esc(b.means)}`));
  }
});

test("hemicycle: seats fill only when asked, staggered", () => {
  const empty = DESIGN.hemicycle(false), full = DESIGN.hemicycle(true);
  assert.ok(!empty.includes("hemi--fill") && full.includes("hemi--fill"));
  const seats = (full.match(/class="hemi__seat"/g) || []).length;
  assert.ok(seats > 30, `${seats} seats`);
  assert.equal(new Set(full.match(/--d:\d+ms/g)).size > 10, true);
});

test("Clerk result card: seal, decisions, reason and a landing DECIDED BY THE CLERK stamp", () => {
  const html = DESIGN.clerkCard({ kicker: "Act II · Run the law", decisions: [{ label: "The age check", text: "A face scan" }], reason: "Because." });
  assert.ok(html.includes("seal--CLERK"));
  assert.ok(html.includes("<dt>The age check</dt><dd>A face scan</dd>"));
  assert.ok(html.includes(`${CONTENT.clerkExtra.reason}:</span> Because.`));
  assert.ok(html.includes('aria-label="DECIDED BY THE CLERK"') && html.includes("stamp--land"));
});

test("Law Book: optional title; new lines slide in and their stamps land", () => {
  const html = DESIGN.lawBook([
    { author: "PARL", num: "§1", text: "Old.", stamps: ["ENACTED"] },
    { author: "MIN", num: "", text: "New.", stamps: ["REGULATION_IN_FORCE", "CLERK"], land: true },
  ], "The Clear Lines Bill");
  assert.ok(html.includes('<p class="lawbook__title">The Clear Lines Bill</p>'));
  assert.equal((html.match(/prov--new/g) || []).length, 1);
  assert.equal((html.match(/stamp--land/g) || []).length, 2);
});

test("Phase 3 authored CONTENT groups are flagged", () => {
  for (const k of ["nav", "setupExtra", "clerkExtra"]) assert.equal(CONTENT[k].authored, true, k);
  assert.equal(CONTENT.branches.title, "The three branches");
  assert.equal(CONTENT.bills.question, "Choose a Bill");
  assert.equal(CONTENT.clerk.button, "Skip act — the Clerk decides");
});

test("locked option card: visible, not a button, padlocked, lock text in full", () => {
  const html = DESIGN.optionCard({ letter: "D", text: "Strike down — cancel the section", value: "strike", action: "select",
    locked: true, lockText: CONTENT.lockText });
  assert.ok(html.startsWith('<div class="card card--locked" aria-disabled="true"'));
  assert.ok(!html.includes("data-action"), "a locked card cannot be pressed");
  assert.ok(html.includes('class="padlock"'));
  assert.ok(html.includes(">D</text>"), "keeps letter and shape");
  assert.ok(html.includes(DESIGN.esc(CONTENT.lockText)));
});

test("Law Book: marks exact words and adds a note line", () => {
  const html = DESIGN.lawBook([{ author: "PARL", num: "§1", text: "Under-16s may not use any app <here>.", stamps: ["ENACTED"],
    mark: "use any app", note: "Only Parliament can change it." }]);
  assert.ok(html.includes('Under-16s may not <mark class="caught">use any app</mark> &lt;here&gt;.'));
  assert.ok(html.includes('<span class="prov__note">Only Parliament can change it.</span>'));
  const none = DESIGN.lawBook([{ author: "PARL", num: "§1", text: "Rule.", stamps: [], mark: "absent" }]);
  assert.ok(!none.includes("<mark"), "no mark when the words are not in the line");
  assert.ok(DESIGN.lawBook([], null, { compact: true }).includes("lawbook--compact"));
});

test("case folder: Held line can type itself out; no Held text leaves the ruled line empty", () => {
  assert.ok(DESIGN.caseFolder({ ref: "R", name: "N", facts: "F", held: "§1 stands.", type: true }).includes("held__text--type"));
  assert.ok(!DESIGN.caseFolder({ ref: "R", name: "N", facts: "F", held: "" }).includes("held__text"));
});

test("constitution card: letter, name, inspired-by and the §5 summary, verbatim", () => {
  for (const c of ["A", "B"]) {
    const html = DESIGN.charter(c, false);
    const k = CONTENT.constitutions[c];
    assert.ok(html.includes(`Constitution ${c} — ${DESIGN.esc(k.name)}`));
    assert.ok(html.includes(`(${k.inspired})`));
    assert.ok(html.includes(DESIGN.esc(k.summary)));
    assert.ok(!html.includes("charter--reveal"));
  }
  assert.ok(DESIGN.charter("A", true).includes("charter--reveal"));
});

test("Clerk card: a decision can carry a note (Decided by the Clerk) and a stamp", () => {
  const html = DESIGN.clerkCard({ kicker: "k", reason: "r",
    decisions: [{ label: "Case 1 ruling", text: "Strike down", note: CONTENT.clerk.decided, html: DESIGN.stamp("CAUGHT") }] });
  assert.ok(html.includes(`<span class="clerk__note">${CONTENT.clerk.decided}</span>`));
  assert.ok(html.includes('aria-label="CAUGHT"'));
});

test("idScope: the same input renders the same markup, so unchanged regions are not rebuilt", () => {
  DESIGN.idScope("b");
  const a = DESIGN.seal("COURT", 52) + DESIGN.envelope(true);
  DESIGN.idScope("b");
  const b = DESIGN.seal("COURT", 52) + DESIGN.envelope(true);
  assert.equal(a, b);
  assert.ok(a.includes('id="vxbs1h"'));
  DESIGN.idScope("");
});

test("Phase 4 authored CONTENT groups are flagged; caught words are exact substrings of the Law Book lines", () => {
  for (const k of ["caught", "actExtra"]) assert.equal(CONTENT[k].authored, true, k);
  const tough = CONTENT.bills.b_tough.sections[0];
  for (const w of Object.values(CONTENT.caught.b_tough)) assert.ok(tough.includes(w), w);
  for (const l of ["l_wide", "l_all"]) {
    for (const w of Object.values(CONTENT.caught[l])) assert.ok(CONTENT.regulations.list[l].includes(w), `${l}: ${w}`);
  }
});

// ---- Phase 5: Monday Morning and Close ----
const visibleText = (html) => html.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

test("Gazette engraving: line-engraved SVG with hatch patterns, no gradients or shadows", () => {
  const svg = DESIGN.parliamentBuilding();
  assert.match(svg, /^<svg[^>]*class="engraving"/);
  assert.ok(svg.includes('role="img"') && svg.includes(`aria-label="${CONTENT.seals.PARL}"`));
  assert.ok(svg.includes("<pattern"));
  for (const banned of ["Gradient", "feDropShadow", "box-shadow"]) assert.ok(!svg.includes(banned), banned);
});

test("authorship line: a row of the three authors' seals carrying the spec sentence and the counts", () => {
  const html = DESIGN.authorshipRow({ PARL: 2, MIN: 1, COURT: 3 });
  const seals = [...html.matchAll(/class="seal seal--(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(seals, ["PARL", "MIN", "COURT"]);
  const sentence = CONTENT.gazette.authorship.replace("{a}", 2).replace("{b}", 1).replace("{c}", 3).replace(/\.$/, "");
  assert.equal(visibleText(html), sentence);
});

test("three-countries table: the live column is boxed in every row and marked ✱ once, in its header", () => {
  const cols = [{ label: "A", live: false }, { label: "B", live: true }, { label: "C", live: false }];
  const rows = [{ label: "r1", cells: ["a1", "b1", "c1"] }, { label: "r2", cells: ["a2", "b2", "c2"] }];
  const html = DESIGN.countriesTable(cols, rows);
  assert.equal((html.match(/class="is-live"/g) || []).length, 1 + rows.length);
  assert.equal((html.match(/✱/g) || []).length, 1);
  assert.match(html, /<th scope="col" class="is-live"><span class="countries__star">✱<\/span>B<\/th>/);
  assert.match(html, /<td class="is-live">b2<\/td>/);
  assert.ok(!/<td class="is-live">(a|c)\d/.test(html));
});

test("re-vote comparison: opening counts as read-only counters, closing counts as tally controls", () => {
  const opts = CONTENT.hook.options;
  const html = DESIGN.tallyCompare(opts, { A: 4, B: 0, C: 7, D: 1 }, { A: 1, C: 12 }, "tally", { before: "Before", after: "After" });
  assert.deepEqual([...html.matchAll(/class="counter"[^>]*>(\d+)</g)].map((m) => m[1]), ["4", "0", "7", "1"]);
  assert.deepEqual([...html.matchAll(/data-tally="(\w)"/g)].map((m) => m[1]), ["A", "B", "C", "D"]);
  assert.match(html, /value="12" data-tally="C"/);
  assert.match(html, /value="0" data-tally="B"/);
  assert.equal((html.match(/data-action="tally"/g) || []).length, 8);
  for (const o of opts) assert.ok(html.includes(o.text), o.text);
  // No opening tally yet (null): every counter shows 0.
  assert.deepEqual([...DESIGN.tallyCompare(opts, null, {}, "tally", { before: "B", after: "A" }).matchAll(/class="counter"[^>]*>(\d+)</g)].map((m) => m[1]), ["0", "0", "0", "0"]);
});

test("Law Book: stampScale overrides the compact stamp size (the Gazette's smaller stamps)", () => {
  const p = [{ author: "PARL", num: "§1", text: "t", stamps: ["ENACTED"] }];
  const h = (html) => Number(html.match(/height:([\d.]+)em/)[1]);
  assert.ok(h(DESIGN.lawBook(p, null, { compact: true, stampScale: 0.44 })) < h(DESIGN.lawBook(p, null, { compact: true })));
});

test("Phase 5 authored CONTENT groups are flagged; the spec's close copy is verbatim", () => {
  for (const k of ["gazetteExtra", "countriesExtra", "closeExtra", "glimmerStatus"]) assert.equal(CONTENT[k].authored, true, k);
  assert.equal(CONTENT.close.discussion.length, 3);
  assert.equal(CONTENT.close.revote, CONTENT.hook.question);
  assert.equal(CONTENT.disclaimer, "Veritas is imaginary. Real countries are more complicated.");
  assert.ok(CONTENT.countriesExtra.liveKey.startsWith("✱"));
});
