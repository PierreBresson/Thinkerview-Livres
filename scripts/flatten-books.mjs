#!/usr/bin/env node
// Collect every book from books/*.json (except _template.json) into a flat array in all-books.json.
// Usage: node scripts/flatten-books.mjs [output]   (default output: all-books.json)

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const booksDir = path.join(root, "books");
const output = path.resolve(root, process.argv[2] ?? "all-books.json");

const files = (await readdir(booksDir))
  .filter((f) => f.endsWith(".json") && f !== "_template.json")
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const books = [];
for (const file of files) {
  const raw = await readFile(path.join(booksDir, file), "utf8");
  try {
    for (const person of JSON.parse(raw).people ?? []) {
      books.push(...(person.books ?? []));
    }
  } catch (err) {
    console.error(`Invalid JSON in books/${file}: ${err.message}`);
    process.exit(1);
  }
}

await writeFile(output, JSON.stringify(books, null, 4) + "\n");
console.log(`Wrote ${books.length} books from ${files.length} files into ${path.relative(root, output)}`);
