// Every path through the session: bill × list × check × move × case1 ruling × case2 ruling × constitution A/B,
// crossed with all 16 Skip Act patterns. Drives the real state machine (MACHINE.step) and checks spec §11
// criteria 1–7 and 10 on every path.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadMachine } from "./load-model.mjs";

const { CONTENT, MODEL, MACHINE } = loadMachine();
const plain = (x) => JSON.parse(JSON.stringify(x));
const ACTS = ["I", "II", "III", "IV"];
const FIRST_SCREEN = { I: "bills", II: null, III: "gap", IV: "unseal" }; // Act II starts at list or check.
const MAX_STEPS = 200;

function actFirstScreen(s, act) {
  if (act === "II") return s.bill === "b_trust" ? "list" : "check";
  return FIRST_SCREEN[act];
}

// Depth-first over every choice. `pattern` is the set of acts the Clerk decides (skipped at the act's first screen).
function enumerate(constitution, pattern) {
  const paths = [];
  let s0 = MACHINE.initial({ seed: 1 });
  s0 = MACHINE.step(s0, { type: "set-mode", value: "sealedChoose" });
  s0 = MACHINE.step(s0, { type: "set-constitution", value: constitution });
  s0 = MACHINE.step(s0, { type: "start", date: "2026-10-16" });

  function walk(s, trail, steps) {
    if (steps > MAX_STEPS) throw new Error("Path too long: " + trail.join(" > "));
    const seen = trail.concat([s.screen]);
    if (s.screen === "end") { paths.push({ state: s, screens: seen }); return; }

    // Under A, Strike down must be visible and locked with the exact text whenever Case 1 is on screen.
    if (s.screen === "case1") {
      const opts = MACHINE.options(s);
      const strike = opts.find((o) => o.value === "strike");
      assert.ok(strike, "Strike down is visible");
      if (s.constitution === "A") {
        assert.equal(strike.locked, true);
        assert.equal(strike.lockReason, "In this constitution, judges cannot cancel an Act of Parliament.");
      } else {
        assert.equal(strike.locked, false);
        assert.ok(!opts.some((o) => o.value === "declare"), "Declare incompatible absent under B");
      }
    }

    const act = MACHINE.ACT_OF[s.screen];
    if (act && pattern.has(act) && s.screen === actFirstScreen(s, act) && !MACHINE.decision(s)) {
      if (act === "IV" && !s.opened) return walk(advance(s, { type: "next" }), seen, steps + 1);
      const k = advance(s, { type: "skipAct" });
      assert.equal(k.screen, "clerk");
      return walk(advance(k, { type: "next" }), seen, steps + 1);
    }

    if (MACHINE.isVote(s.screen) && !MACHINE.decision(s)) {
      for (const o of MACHINE.options(s).filter((x) => !x.locked)) walk(advance(s, { type: "select", value: o.value }), seen, steps + 1);
      return;
    }
    walk(advance(s, { type: "next" }), seen, steps + 1);
  }

  // No dead ends: every action we take must move the session on.
  function advance(s, a) {
    const n = MACHINE.step(s, a);
    assert.notEqual(n, s, `Dead end at ${s.screen} on ${a.type}`);
    return n;
  }

  walk(s0, [], 0);
  return paths;
}

const PATTERNS = Array.from({ length: 16 }, (_, m) => new Set(ACTS.filter((_, i) => m & (1 << i))));

test("enumeration: every path satisfies spec §11 criteria 1–7 and 10", (t) => {
  let total = 0;
  const perPattern = {};
  for (const pattern of PATTERNS) {
    const key = [...pattern].join(",") || "none";
    for (const constitution of ["A", "B"]) {
      const paths = enumerate(constitution, pattern);
      assert.ok(paths.length > 0);
      perPattern[key] = (perPattern[key] || 0) + paths.length;
      total += paths.length;

      for (const { state: s, screens } of paths) {
        const where = `${constitution} skip=${key} ${s.bill}/${s.list}/${s.check}/${s.move}/${s.case1 && s.case1.ruling}/${s.case2 && s.case2.ruling}`;

        // 1. ≤ 8 class votes and reaches the End screen (no dead ends: enforced in advance()).
        assert.equal(s.screen, "end", where);
        assert.ok(MACHINE.classVotes(s) <= 8, where);
        assert.ok(s.hook && s.revote, where);

        // Skipped acts took exactly their autoDecide values and are flagged byClerk.
        assert.deepEqual(plain(s.skipped).sort(), [...pattern].sort(), where);
        if (pattern.has("I")) { assert.equal(s.bill, "b_narrow"); assert.equal(s.byClerk.bill, true); }
        if (pattern.has("II")) {
          assert.equal(s.check, "k_face"); assert.equal(s.byClerk.check, true);
          if (s.bill === "b_trust") { assert.equal(s.list, "l_feeds"); assert.equal(s.byClerk.list, true); }
        }
        if (pattern.has("III")) {
          assert.equal(s.move, MODEL.moveResult(s.bill, s.list, "m_lite") === "LOOPHOLE" ? "m_lite" : "m_chat", where);
          assert.equal(s.byClerk.move, true);
        }
        if (pattern.has("IV")) {
          assert.equal(s.case1.ruling, constitution === "A" ? "declare" : "strike", where);
          assert.equal(s.case1.split, undefined);
          if (s.case2) assert.equal(s.case2.ruling, "purposive");
          assert.ok(screens.includes("unseal"), "the unseal screen is still shown");
        }
        assert.equal(s.list !== null, s.bill === "b_trust", where);

        // 2. At least one live Minister regulation and at least one Court precedent.
        const book = plain(MODEL.lawBook(s));
        assert.ok(book.some((p) => p.author === "MIN" && p.status === "REGULATION_IN_FORCE"), where);
        assert.ok(book.some((p) => p.author === "COURT" && p.status === "PRECEDENT"), where);
        assert.ok(book.some((p) => p.author === "PARL" && p.status !== "VOID"), where);
        const by = MODEL.authorship(MODEL.lawBook(s));
        assert.ok(by.PARL >= 2 && by.MIN >= 1 && by.COURT >= 1, where);

        // 3. Under A, no VOID (the locked option is checked during the walk).
        if (constitution === "A") assert.ok(!book.some((p) => p.status === "VOID"), where);

        // 4. m_lite is LOOPHOLE under b_narrow and b_trust, CAUGHT under b_tough.
        if (s.move === "m_lite") assert.equal(s.moveResult, s.bill === "b_tough" ? "CAUGHT" : "LOOPHOLE", where);
        assert.equal(s.moveResult, MODEL.moveResult(s.bill, s.list, s.move), where);

        // 5. Case 2 appears iff Act III was ARGUABLE (shown, or ruled by the Clerk when Act IV is skipped).
        const arguable = s.moveResult === "ARGUABLE";
        assert.equal(!!s.case2, arguable, where);
        assert.equal(screens.includes("case2"), arguable && !pattern.has("IV"), where);
        assert.equal(screens.includes("nocase"), s.moveResult === "LOOPHOLE" && !pattern.has("IV"), where);

        // 6. The three-countries panel shows a different available option set for A and for B.
        const panel = plain(MODEL.threeCountries(s));
        const a = panel.find((c) => c.id === "A"), b = panel.find((c) => c.id === "B");
        assert.notDeepEqual(a.options, b.options, where);
        assert.ok(a.options.includes(a.case1) && b.options.includes(b.case1), where);
        assert.equal(panel.filter((c) => c.live).map((c) => c.id).join(), constitution);
        assert.ok(CONTENT.headlines[MODEL.headline(s)], where);
        assert.ok(MODEL.glimmerStatus(s), where);

        // 7. DATA line round-trips.
        const line = MODEL.toData(s, 1234);
        const d = plain(MODEL.parseData(line));
        assert.equal(MODEL.toData(MODEL.parseData(line)), line, where);
        for (const k of ["constitution", "bill", "list", "check", "move", "moveResult", "case1", "case2", "hook", "revote"]) {
          assert.deepEqual(d[k], plain(s[k]), `${where} DATA ${k}`);
        }
        assert.deepEqual(d.skipped, ACTS.filter((x) => pattern.has(x)));
      }
    }
  }

  // 10. Skipping all four acts still gives Parliament, Minister and Court lines.
  for (const constitution of ["A", "B"]) {
    const all = enumerate(constitution, new Set(ACTS));
    for (const { state } of all) {
      const authors = new Set(MODEL.lawBook(state).filter((p) => p.status !== "VOID").map((p) => p.author));
      assert.deepEqual([...authors].sort(), ["COURT", "MIN", "PARL"]);
    }
  }

  t.diagnostic(`paths: ${total} (per skip pattern, A+B: ${JSON.stringify(perPattern)})`);
  console.log(`enumerate: ${total} paths checked`);
});
