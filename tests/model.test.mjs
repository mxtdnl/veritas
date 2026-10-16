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
