import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync("rg --files src scripts", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((file) => file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".mjs"));

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
