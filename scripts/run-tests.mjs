import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function walk(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    const st = statSync(abs);

    if (st.isDirectory()) {
      files.push(...walk(abs));
      continue;
    }

    if (abs.endsWith(".test.mjs")) {
      files.push(abs);
    }
  }

  return files;
}

const coverageMode = process.argv.includes("--coverage");
const testFiles = walk("src").sort();

if (testFiles.length === 0) {
  console.error("No test files found under src.");
  process.exit(1);
}

if (coverageMode) {
  rmSync("coverage", { recursive: true, force: true });
  mkdirSync("coverage", { recursive: true });
}

const args = coverageMode
  ? [
      "--test",
      "--experimental-test-coverage",
      "--test-coverage-lines=70",
      "--test-coverage-functions=70",
      "--test-coverage-branches=60",
      "--test-coverage-include=src/**/*.js",
      "--test-coverage-include=src/**/*.jsx",
      "--test-coverage-include=src/**/*.mjs",
      ...testFiles,
    ]
  : ["--test", ...testFiles];

const result = spawnSync(process.execPath, args, {
  stdio: "inherit",
  env: coverageMode ? { ...process.env, NODE_V8_COVERAGE: "coverage" } : process.env,
});

process.exit(result.status ?? 1);
