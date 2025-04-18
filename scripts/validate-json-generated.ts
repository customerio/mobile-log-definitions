import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./log-styling";
import { walkDir, isJsonnetFile, getJsonOutputPath } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, "../features");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/json");

if (!fs.existsSync(INPUT_DIR)) {
  logger.warn(`Features directory missing: ${INPUT_DIR}`);
  process.exit(0);
}

const missingFiles: string[] = [];

walkDir(INPUT_DIR, (inputPath: string) => {
  if (isJsonnetFile(inputPath)) {
    const relativePath = path.relative(INPUT_DIR, inputPath);
    const expectedOutputPath = getJsonOutputPath(inputPath, INPUT_DIR, OUTPUT_DIR);

    if (!fs.existsSync(expectedOutputPath)) {
      missingFiles.push(relativePath);
    }
  }
});

if (missingFiles.length === 0) {
  logger.success("All Jsonnet files have corresponding generated JSON files!");
  process.exit(0);
} else {
  logger.error("Missing generated JSON files for the following Jsonnet definitions:");
  logger.info("This likely means you need to run 'npm run buildJson'");
  missingFiles.forEach((file: string) => {
    logger.error(`  - ${file}`);
  });
  process.exit(1);
}
