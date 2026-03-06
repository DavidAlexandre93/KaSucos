import { readFileSync, readdirSync } from "node:fs";
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
const violations = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    if (/\t/.test(lines[i])) {
      violations.push(`${file}:${i + 1} contains tab indentation`);
      break;
    }
  }

  for (let i = 0; i < lines.length; i += 1) {
    if (/[ \t]+$/.test(lines[i])) {
      violations.push(`${file}:${i + 1} contains trailing whitespace`);
      break;
    }
  }
}

if (violations.length) {
  console.error(`Lint violations found:\n${violations.map((violation) => `- ${violation}`).join("\n")}`);
  process.exit(1);
}

console.log(`Lint passed for ${files.length} files.`);
