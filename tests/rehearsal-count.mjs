// Rehearsal word count (REHEARSAL.md method). Opt-in: not a test, and not run by `node --test`.
// Needs Playwright and a Chromium build:  node tests/rehearsal-count.mjs [--overflow]
// Env: PLAYWRIGHT (module path, default "playwright"), CHROMIUM (executable path, optional).
// Plays every Bill/list × move × constitution × Case 1 × Case 2 path from file://, reads the projected stage before
// the class votes, and estimates each screen at 130 wpm plus the spec §2 vote rhythm. --overflow also reports, per
// screen and viewport, the worst vertical overflow (px) of the stage, the Law Book column and the page.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const FILE = pathToFileURL(fileURLToPath(new URL("../index.html", import.meta.url))).href;
const WPM = 130;
const FULL = 100, QUICK = 40; // read is counted separately; partner 60 s + cards 10 s + minority 30 s; hook and re-vote 10 s + 30 s
const VOTES = { bills: FULL, list: FULL, check: FULL, gap: FULL, case1: FULL, case2: FULL, hook: QUICK, revote: QUICK };
// Not read aloud: card letters and shapes, act labels, tallies, stamps, seals, the Law Book, chrome.
const SKIP = ".card__mark, .tally, .kicker, .stamp, svg, .lawbook, .foot, .script, .plate, .ribbon, .clock";
const overflow = process.argv.includes("--overflow");

let pw;
try { pw = await import(process.env.PLAYWRIGHT || "playwright"); } catch (e) {
  console.error("Playwright is not installed. Set PLAYWRIGHT to its module path, or install it, then re-run.");
  process.exit(1);
}
const chromium = pw.chromium || (pw.default && pw.default.chromium);
const exe = process.env.CHROMIUM || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

function paths() {
  const out = [], bl = [["b_narrow"], ["b_tough"], ["b_trust", "l_feeds"], ["b_trust", "l_wide"], ["b_trust", "l_all"]];
  for (const c of ["A", "B"]) for (const [bill, list] of bl) for (const move of ["m_comply", "m_chat", "m_quest", "m_lite"])
    for (const case1 of c === "A" ? ["uphold", "reinterpret", "declare"] : ["uphold", "reinterpret", "strike"])
      for (const case2 of ["literal", "purposive"]) out.push({ c, bill, list, check: "k_id", move, case1, case2 });
  return out;
}
const screenOf = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem("veritas:v2:session")).game.screen; } catch (e) { return null; }
});
const read = (page, skip) => page.evaluate((skip) => {
  const words = (t) => t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const stage = document.querySelector('[data-region="stage"]').cloneNode(true);
  stage.querySelectorAll(skip).forEach((n) => n.remove());
  const rows = [...document.querySelectorAll(".script dt")].map((dt) => [dt.textContent, dt.nextElementSibling.textContent]);
  const pick = (label) => rows.filter((r) => r[0] === label).map((r) => r[1]);
  const o = (el) => (el ? Math.max(0, el.scrollHeight - el.clientHeight) : 0);
  return {
    screen: words(stage.textContent), script: [...pick("Say"), ...pick("Ask")].reduce((n, t) => n + words(t), 0),
    timing: (pick("Timing")[0] || ""),
    overflow: Math.max(o(document.querySelector(".game__main > .stage")), o(document.querySelector('[data-region="book"]')),
      Math.max(0, document.documentElement.scrollHeight - innerHeight))
  };
}, skip);

async function play(page, p) {
  await page.goto(FILE);
  await page.evaluate(() => localStorage.clear());
  await page.goto(FILE);
  await page.click('[data-action="set-mode"][data-value="sealedChoose"]');
  await page.click(`[data-action="set-constitution"][data-value="${p.c}"]`);
  await page.click('[data-action="start"]');
  await page.keyboard.press("s");
  const pick = { bills: p.bill, list: p.list, check: p.check, gap: p.move, case1: p.case1, case2: p.case2 };
  const seen = [];
  for (let i = 0; i < 40; i++) {
    const sc = await screenOf(page);
    // The constitution is read aloud once the envelope is open.
    if (sc === "unseal") await page.keyboard.press("ArrowRight");
    const r = await read(page, SKIP);
    seen.push({ sc, ...r, after: 0 });
    if (sc === "end") return seen;
    if (pick[sc]) {
      await page.click(`.card[data-action="select"][data-value="${pick[sc]}"]`);
      seen[seen.length - 1].after = (await read(page, SKIP)).overflow;
    } else if (sc === "hook" || sc === "revote") await page.click('[data-action="tally"][data-option="C"][data-delta="1"]');
    else if (sc === "discussion") await page.keyboard.press("1");
    await page.locator("main").focus();
    await page.keyboard.press("ArrowRight");
  }
  throw new Error("Path did not reach End: " + JSON.stringify(p));
}

const secs = (t) => { const m = /(\d+):(\d\d)/.exec(t); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
const mmss = (s, sign) => (s < 0 ? "−" : sign ? "+" : "") + Math.floor(Math.abs(s) / 60) + ":" + String(Math.round(Math.abs(s) % 60)).padStart(2, "0");
const viewports = overflow ? [[1280, 720], [1920, 1080]] : [[1920, 1080]];
const worst = {}, over = {}, totals = [], seenPaths = new Set(), errors = [];
for (const [w, h] of viewports) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  for (const p of paths()) {
    const run = await play(page, p);
    const sig = run.map((r) => r.sc).join(">") + "|" + JSON.stringify(p) ;
    for (const r of run) {
      const k = w + "×" + h + " " + r.sc;
      over[k] = Math.max(over[k] || 0, r.overflow, r.after);
    }
    if (w !== 1920) continue;
    const key = run.map((r) => r.sc + ":" + r.screen + ":" + r.script).join(">");
    if (seenPaths.has(key)) continue;
    seenPaths.add(key);
    let total = 0;
    for (const r of run) {
      const readS = ((r.screen + r.script) / WPM) * 60, est = readS + (VOTES[r.sc] || 0);
      let slot = secs(r.timing);
      if (r.sc === "check" && !p.list) slot = secs(r.timing.split("(")[1] || "") || slot;
      total += est;
      // Worst case per screen: the tightest margin against its slot (or the longest estimate where there is no slot).
      const cur = worst[r.sc], score = slot != null ? slot - est : -est;
      if (!cur || score < cur.score) worst[r.sc] = { screen: r.screen, script: r.script, readS, est, slot, score };
    }
    totals.push({ total, p: sig.split("|")[1] });
  }
  await page.close();
}
await browser.close();

console.log("| Screen | Screen words | Script words | Read aloud | Vote rhythm | Estimate | Slot | Margin |");
console.log("|---|---|---|---|---|---|---|---|");
for (const [sc, r] of Object.entries(worst)) {
  console.log(`| ${sc} | ${r.screen} | ${r.script} | ${mmss(r.readS)} | ${VOTES[sc] ? mmss(VOTES[sc]) : "—"} | ${mmss(r.est)} | ` +
    `${r.slot != null ? mmss(r.slot) : "—"} | ${r.slot != null ? mmss(r.slot - r.est, true) + (r.slot < r.est ? " **OVER**" : "") : "—"} |`);
}
totals.sort((a, b) => b.total - a.total);
console.log(`\nPaths with distinct word counts: ${totals.length}. Longest: ${mmss(totals[0].total)} — ${totals[0].p}`);
if (overflow) {
  console.log("\nWorst overflow (px), before or after the decision:");
  for (const [k, v] of Object.entries(over)) if (v > 0) console.log(`  ${k}: ${v}`);
}
console.log(errors.length ? `\nConsole errors: ${errors.length}\n  ` + errors.slice(0, 5).join("\n  ") : "\nNo console errors.");
