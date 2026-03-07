import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const SOURCE_DIRS = ["src", "scripts", ".github/workflows"];
const VALID_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".yml"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "coverage"]);

const writeMode = process.argv.includes("--write");
const checkMode = process.argv.includes("--check");

if (!writeMode && !checkMode) {
  console.error("Use --check or --write.");
  process.exit(1);
}

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

function normalize(content) {
  const hasFinalNewline = content.endsWith("\n");
  const normalized = content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n");

  return hasFinalNewline || normalized.length === 0 ? normalized : `${normalized}\n`;
}

const files = SOURCE_DIRS.flatMap((dir) => walk(dir));
const changed = [];

for (const file of files) {
  const original = readFileSync(file, "utf8");
  const formatted = normalize(original);

  if (formatted !== original) {
    changed.push(file);

    if (writeMode) {
      writeFileSync(file, formatted, "utf8");
    }
  }
}

if (checkMode && changed.length > 0) {
  console.error("Formatting issues found:");
  for (const file of changed) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

if (writeMode) {
  console.log(`Formatting applied to ${changed.length} file(s).`);
} else {
  console.log(`Formatting check passed for ${files.length} file(s).`);
}
