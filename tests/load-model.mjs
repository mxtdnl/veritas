import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const INDEX = join(dirname(fileURLToPath(import.meta.url)), "..", "index.html");

export function extractBlock(html, name) {
  const start = `/* ${name}:START */`;
  const end = `/* ${name}:END */`;
  const s = html.indexOf(start);
  if (s === -1) throw new Error(`Marker missing in index.html: ${start}`);
  const e = html.indexOf(end);
  if (e === -1) throw new Error(`Marker missing in index.html: ${end}`);
  if (e < s) throw new Error(`Markers out of order for ${name}: END precedes START`);
  return html.slice(s + start.length, e);
}

export function loadSource(path = INDEX) {
  const html = readFileSync(path, "utf8");
  return { html, content: extractBlock(html, "CONTENT"), model: extractBlock(html, "MODEL") };
}

export function loadModel(path = INDEX) {
  const { content, model } = loadSource(path);
  const context = vm.createContext({});
  return vm.runInContext(`${content}\n${model}\n({ CONTENT, MODEL });`, context, {
    filename: "index.html",
  });
}

// DESIGN is a DOM-free sub-block of APP (component builders); it depends on CONTENT and MODEL.
export function loadDesign(path = INDEX) {
  const { html, content, model } = loadSource(path);
  const design = extractBlock(html, "DESIGN");
  const context = vm.createContext({});
  return vm.runInContext(`${content}\n${model}\n${design}\n({ CONTENT, MODEL, DESIGN });`, context, {
    filename: "index.html",
  });
}
