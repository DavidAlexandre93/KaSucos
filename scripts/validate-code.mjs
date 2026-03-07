import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname, dirname, resolve } from "node:path";

const root = process.cwd();
const srcDir = join(root, "src");
const entryFile = join(srcDir, "main.jsx");
const extensions = [".js", ".jsx", ".mjs"];
const extensionSet = new Set(extensions);
const aliasPrefix = "@/";

function walk(dir) {
  const out = [];

  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);

    if (st.isDirectory()) {
      out.push(...walk(abs));
      continue;
    }

    if (extensionSet.has(extname(abs))) {
      out.push(abs);
    }
  }

  return out;
}

const files = walk(srcDir);
const fileSet = new Set(files.map((file) => resolve(file)));

function parseImports(content) {
  const imports = [];
  const regex = /import\s+(?:[^"']+\s+from\s+)?["']([^"']+)["']/g;
  let match;

  while ((match = regex.exec(content))) {
    imports.push(match[1]);
  }

  return imports;
}

function resolveByCandidates(basePath) {
  const candidates = [
    basePath,
    ...extensions.map((ext) => `${basePath}${ext}`),
    ...extensions.map((ext) => join(basePath, `index${ext}`)),
  ];

  return candidates.find((candidate) => fileSet.has(resolve(candidate))) ?? null;
}

function resolveImport(fromFile, specifier) {
  if (specifier.startsWith(aliasPrefix)) {
    return resolveByCandidates(join(srcDir, specifier.slice(aliasPrefix.length)));
  }

  if (!specifier.startsWith(".")) {
    return null;
  }

  return resolveByCandidates(resolve(dirname(fromFile), specifier));
}

function collectReachable(seedFiles) {
  const reachable = new Set();
  const queue = seedFiles.map((file) => resolve(file));

  while (queue.length) {
    const current = queue.pop();

    if (reachable.has(current) || !fileSet.has(current)) {
      continue;
    }

    reachable.add(current);
    const content = readFileSync(current, "utf8");

    for (const specifier of parseImports(content)) {
      const target = resolveImport(current, specifier);
      if (target && !reachable.has(target)) {
        queue.push(target);
      }
    }
  }

  return reachable;
}

const appReachable = collectReachable([entryFile]);

const testFiles = files.filter((file) => file.endsWith(".test.mjs"));
const testReachable = collectReachable(testFiles);

const unreachableFromApp = files.filter((file) => !appReachable.has(resolve(file)));
const unreachableFromEverywhere = files.filter(
  (file) => !appReachable.has(resolve(file)) && !testReachable.has(resolve(file)),
);

function normalize(line) {
  return line.trim().replace(/\s+/g, " ");
}

const duplicateBlocks = [];
const blockMap = new Map();
const blockSize = 8;

for (const file of files.filter((file) => !file.endsWith(".test.mjs"))) {
  const rel = relative(root, file);
  const lines = readFileSync(file, "utf8").split("\n");

  for (let i = 0; i + blockSize <= lines.length; i += 1) {
    const block = lines.slice(i, i + blockSize).map(normalize).join("\n");
    if (!block || block.replace(/\W/g, "").length < 40) continue;

    const location = `${rel}:${i + 1}`;
    const existing = blockMap.get(block) ?? [];
    existing.push(location);
    blockMap.set(block, existing);
  }
}

for (const locations of blockMap.values()) {
  if (locations.length > 1) {
    duplicateBlocks.push(locations);
  }
}

console.log("=== Code Validation Report ===");
console.log(`Scanned files: ${files.length}`);
console.log(`Reachable from src/main.jsx: ${appReachable.size}`);
console.log(`Reachable from test files: ${testReachable.size}`);

if (unreachableFromApp.length) {
  console.log("\nPotentially unused files (unreachable from app entrypoint):");
  for (const file of unreachableFromApp.map((file) => relative(root, file))) {
    console.log(`- ${file}`);
  }
} else {
  console.log("\nNo potentially unused source files found from app entrypoint.");
}

if (unreachableFromEverywhere.length) {
  console.log("\nPotentially dead files (unreachable from app and tests):");
  for (const file of unreachableFromEverywhere.map((file) => relative(root, file))) {
    console.log(`- ${file}`);
  }
} else {
  console.log("\nNo potentially dead source files found (considering app + tests).");
}

if (duplicateBlocks.length) {
  console.log(`\nPotential duplicated blocks (>=${blockSize} lines): ${duplicateBlocks.length}`);
  for (const locations of duplicateBlocks.slice(0, 10)) {
    console.log(`- ${locations.join(" | ")}`);
  }

  if (duplicateBlocks.length > 10) {
    console.log(`... and ${duplicateBlocks.length - 10} more`);
  }
} else {
  console.log(`\nNo duplicated blocks with ${blockSize}+ normalized lines found.`);
}
