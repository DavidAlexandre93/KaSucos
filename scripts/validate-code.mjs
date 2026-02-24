import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname, dirname, resolve } from 'node:path';

const root = process.cwd();
const srcDir = join(root, 'src');
const entryFile = join(srcDir, 'main.jsx');
const extensions = new Set(['.js', '.jsx', '.mjs']);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) out.push(...walk(abs));
    else if (extensions.has(extname(abs))) out.push(abs);
  }
  return out;
}

const files = walk(srcDir);
const fileSet = new Set(files.map((f) => resolve(f)));

function parseImports(content) {
  const imports = [];
  const regex = /import\s+(?:[^"']+\s+from\s+)?["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(content))) imports.push(m[1]);
  return imports;
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), specifier);
  const candidates = [base, `${base}.js`, `${base}.jsx`, `${base}.mjs`, join(base, 'index.js'), join(base, 'index.jsx')];
  return candidates.find((c) => fileSet.has(resolve(c))) ?? null;
}

// Reachability from entrypoint
const reachable = new Set();
const queue = [resolve(entryFile)];
while (queue.length) {
  const current = queue.pop();
  if (reachable.has(current)) continue;
  reachable.add(current);
  const content = readFileSync(current, 'utf8');
  for (const specifier of parseImports(content)) {
    const target = resolveImport(current, specifier);
    if (target && !reachable.has(target)) queue.push(target);
  }
}

const unreachable = files.filter((f) => !reachable.has(resolve(f))).map((f) => relative(root, f));

// Duplicate blocks
function normalize(line) {
  return line.trim().replace(/\s+/g, ' ');
}

const duplicateBlocks = [];
const blockMap = new Map();
const blockSize = 8;
for (const file of files) {
  const rel = relative(root, file);
  const lines = readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i + blockSize <= lines.length; i += 1) {
    const block = lines.slice(i, i + blockSize).map(normalize).join('\n');
    if (!block || block.replace(/\W/g, '').length < 40) continue;
    const loc = `${rel}:${i + 1}`;
    const existing = blockMap.get(block) ?? [];
    existing.push(loc);
    blockMap.set(block, existing);
  }
}

for (const [_, locations] of blockMap) {
  if (locations.length > 1) duplicateBlocks.push(locations);
}

console.log('=== Code Validation Report ===');
console.log(`Scanned files: ${files.length}`);
console.log(`Reachable from src/main.jsx: ${reachable.size}`);

if (unreachable.length) {
  console.log('\nPotentially unused files (unreachable from entrypoint):');
  for (const file of unreachable) console.log(`- ${file}`);
} else {
  console.log('\nNo potentially unused source files found.');
}

if (duplicateBlocks.length) {
  console.log(`\nPotential duplicated blocks (>=${blockSize} lines): ${duplicateBlocks.length}`);
  for (const locations of duplicateBlocks.slice(0, 10)) {
    console.log(`- ${locations.join(' | ')}`);
  }
  if (duplicateBlocks.length > 10) {
    console.log(`... and ${duplicateBlocks.length - 10} more`);
  }
} else {
  console.log(`\nNo duplicated blocks with ${blockSize}+ normalized lines found.`);
}
