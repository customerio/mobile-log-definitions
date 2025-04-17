import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import log from "./log-styling.js";
import { walkDir, isJsonnetFile, getOutputPath } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, "../features");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/json");

let missingFiles = [];

walkDir(INPUT_DIR, (inputPath) => {
  if (isJsonnetFile(inputPath)) {
    const relativePath = path.relative(INPUT_DIR, inputPath);
    const expectedOutputPath = getOutputPath(inputPath, INPUT_DIR, OUTPUT_DIR);

    if (!fs.existsSync(expectedOutputPath)) {
      missingFiles.push(relativePath);
    }
  }
});

if (missingFiles.length === 0) {
  log.success("All Jsonnet files have corresponding generated JSON files!");
  process.exit(0);
} else {
  log.error(
    "Missing generated JSON files for the following Jsonnet definitions:"
  );
  missingFiles.forEach((file) => {
    log.error(`  - ${file}`);
  });
  process.exit(1);
}
