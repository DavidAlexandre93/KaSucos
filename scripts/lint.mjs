import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync("rg --files src scripts", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((file) => file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".mjs"));

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
  console.error("Lint violations found:\n" + violations.map((v) => `- ${v}`).join("\n"));
  process.exit(1);
}

console.log(`Lint passed for ${files.length} files.`);
