import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const SOURCE_DIRS = ["src", "scripts"];
const VALID_EXTENSIONS = new Set([".js", ".jsx", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist"]);

function walk(dir) {
  const files = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        files.push(...walk(join(dir, entry.name)));
      }
      continue;
    }

    if (VALID_EXTENSIONS.has(extname(entry.name))) {
      files.push(join(dir, entry.name));
    }
  }

  return files;
}

const files = SOURCE_DIRS.flatMap((dir) => walk(dir));
let changedFiles = 0;

for (const file of files) {
  const original = readFileSync(file, "utf8");
  const fixed = original
    .split("\n")
    .map((line) => line.replace(/\t/g, "  ").replace(/[ \t]+$/g, ""))
    .join("\n");

  if (fixed !== original) {
    writeFileSync(file, fixed, "utf8");
    changedFiles += 1;
  }
}

console.log(`Autofix completed. Updated ${changedFiles} file(s).`);
