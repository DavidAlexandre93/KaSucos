import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const COVERAGE_DIR = "coverage";

function walk(dir) {
  const files = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(abs));
      continue;
    }

    files.push(abs);
  }

  return files;
}

let files;

try {
  files = walk(COVERAGE_DIR);
} catch (error) {
  console.error(`Coverage directory \"${COVERAGE_DIR}\" was not found.`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const coverageFiles = files.filter((file) => file.endsWith(".json"));

if (coverageFiles.length === 0) {
  console.error("No coverage JSON files were generated.");
  process.exit(1);
}

const emptyFiles = coverageFiles.filter((file) => statSync(file).size === 0);

if (emptyFiles.length > 0) {
  console.error("Some coverage JSON files are empty:");
  for (const file of emptyFiles) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(`Coverage artifacts validated (${coverageFiles.length} JSON file(s)).`);
