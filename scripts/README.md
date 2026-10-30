# Scripts

## merge-books.mjs

Merges every `books/*.json` file (except `_template.json`) into a single `books.json` at the repo root.

Run from the repo root:

```bash
node scripts/merge-books.mjs
```

Optional: pass another output path.

```bash
node scripts/merge-books.mjs dist/all.json
```

Output is an array sorted by episode number. Each entry has an `id` (the file name) and that file's `people` content. Only Node is needed, with no packages to install.

## flatten-books.mjs

Collects every book from `books/*.json` (except `_template.json`) into a single flat array in `all-books.json` at the repo root, with no episode or person info.

```bash
node scripts/flatten-books.mjs
```

Optional: pass another output path.

```bash
node scripts/flatten-books.mjs dist/books-only.json
```

Books are listed in episode order. Duplicates are kept as they are.
