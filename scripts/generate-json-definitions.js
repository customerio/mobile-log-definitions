// TODO Add description

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import {
  walkDir,
  isJsonnetFile,
  isLibSonnetFile,
  getOutputPath,
} from "./utils.js";
import log from "./log-styling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, "../features");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/json");

function buildJsonnetFile(inputPath) {
  const relativePath = path.relative(INPUT_DIR, inputPath);
  const outputFile = getOutputPath(inputPath, INPUT_DIR, OUTPUT_DIR);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  log.info(`Compiling Jsonnet to JSON for: ${relativePath}`);
  try {
    execSync(`jsonnet ${inputPath} > ${outputFile}`);
  } catch (err) {
    log.error(`Failed to compile ${relativePath}`);
    throw err;
  }
}

log.heading("Generating features JSON files from Jsonnet definitions...");
log.blank();

walkDir(INPUT_DIR, (filePath) => {
  if (isJsonnetFile(filePath)) {
    buildJsonnetFile(filePath);
  } else if (!isLibSonnetFile(filePath)) {
    log.warn(
      `Skipping unsupported file: ${path.relative(INPUT_DIR, filePath)}`
    );
  }
});

log.blank();
log.success("Jsonnet files transformed to JSON successfully!");
