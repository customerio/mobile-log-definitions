// TODO Add description

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import {
  walkDir,
  isJsonnetFile,
  isLibSonnetFile,
  getJsonOutputPath,
} from "./utils.js";
import logger from "./log-styling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, "../features");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/json");

function buildJsonnetFile(inputPath) {
  const relativePath = path.relative(INPUT_DIR, inputPath);
  const outputFile = getJsonOutputPath(inputPath, INPUT_DIR, OUTPUT_DIR);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  logger.info(`Compiling Jsonnet to JSON for: ${relativePath}`);
  try {
    execSync(`jsonnet ${inputPath} > ${outputFile}`);
  } catch (err) {
    log.error(`Failed to compile ${relativePath}`);
    throw err;
  }
}

logger.heading("Generating features JSON files from Jsonnet definitions...");
logger.blank();

if (!fs.existsSync(INPUT_DIR)) {
  logger.warn(`Features directory missing: ${INPUT_DIR}`);
  process.exit(0);
}

walkDir(INPUT_DIR, (filePath) => {
  if (isJsonnetFile(filePath)) {
    buildJsonnetFile(filePath);
  } else if (!isLibSonnetFile(filePath)) {
    logger.warn(
      `Skipping unsupported file: ${path.relative(INPUT_DIR, filePath)}`
    );
  }
});

logger.blank();
logger.success("Jsonnet files transformed to JSON successfully!");
