import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import {
  walkDir,
  isJsonnetFile,
  isLibSonnetFile,
  getJsonOutputPath,
  featuresDir,
  jsonDir,
} from "./utils";
import logger from "./log-styling";

function buildJsonnetFile(inputPath: string): void {
  const relativePath = path.relative(featuresDir, inputPath);
  const outputFile = getJsonOutputPath(inputPath, featuresDir, jsonDir);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  logger.info(`Compiling Jsonnet to JSON for: ${relativePath}`);
  try {
    execSync(`jsonnet ${inputPath} > ${outputFile}`);
  } catch (err) {
    logger.error(`Failed to compile ${relativePath}`);
    throw err;
  }
}

logger.heading("Generating features JSON files from Jsonnet definitions...");
logger.blank();

if (!fs.existsSync(featuresDir)) {
  logger.warn(`Features directory missing: ${featuresDir}`);
  process.exit(0);
}

logger.info("Deleting existing docs...");
fs.rmSync(jsonDir, { recursive: true, force: true });

walkDir(featuresDir, (filePath: string) => {
  if (isJsonnetFile(filePath)) {
    buildJsonnetFile(filePath);
  } else if (!isLibSonnetFile(filePath)) {
    logger.warn(
      `Skipping unsupported file: ${path.relative(featuresDir, filePath)}`
    );
  }
});

logger.blank();
logger.success("Jsonnet files transformed to JSON successfully!");
