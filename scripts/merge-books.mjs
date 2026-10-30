#!/usr/bin/env node
// Merge every books/*.json (except _template.json) into a single books.json.
// Usage: node scripts/merge-books.mjs [output]   (default output: books.json)

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const booksDir = path.join(root, "books");
const output = path.resolve(root, process.argv[2] ?? "books.json");

const files = (await readdir(booksDir))
  .filter((f) => f.endsWith(".json") && f !== "_template.json")
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const episodes = [];
for (const file of files) {
  const raw = await readFile(path.join(booksDir, file), "utf8");
  try {
    episodes.push({ id: path.basename(file, ".json"), ...JSON.parse(raw) });
  } catch (err) {
    console.error(`Invalid JSON in books/${file}: ${err.message}`);
    process.exit(1);
  }
}

await writeFile(output, JSON.stringify(episodes, null, 4) + "\n");
console.log(`Merged ${episodes.length} files into ${path.relative(root, output)}`);
