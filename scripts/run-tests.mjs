import { readdirSync, statSync } from "node:fs";
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

const testFiles = walk("src").sort();

if (testFiles.length === 0) {
  console.error("No test files found under src.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
