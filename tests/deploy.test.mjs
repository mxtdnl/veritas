// Phase 8: the file is deployable as one self-contained page (spec §10).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const head = html.slice(0, html.indexOf("<style>"));

test("title and meta description are set", () => {
  assert.match(head, /<title>The Republic of Veritas<\/title>/);
  const m = head.match(/<meta name="description" content="([^"]+)">/);
  assert.ok(m, "meta description present");
  assert.ok(m[1].length >= 50 && m[1].length <= 160, "description length " + m[1].length);
});

test("no external resource can be requested", () => {
  assert.doesNotMatch(html, /https?:\/\//, "no absolute URLs anywhere in the file");
  assert.doesNotMatch(html, /<script[^>]*\ssrc=/i, "no external scripts");
  assert.doesNotMatch(html, /<link[^>]*href="(?!data:)/i, "links are data: URIs only");
  assert.doesNotMatch(html, /@import|url\(\s*["']?(?!data:|#)/i, "no CSS imports or url() to files");
  assert.doesNotMatch(html, /\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource/, "no network APIs");
});
