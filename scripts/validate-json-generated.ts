import fs from "fs";
import path from "path";
import logger from "./log-styling";
import {
  walkDir,
  isJsonnetFile,
  getJsonOutputPath,
  featuresDir,
  jsonDir,
  diagramsDir,
  docsDir,
  getMermaidOutputPath,
  getDocsFilePath,
} from "./utils";

const requiredDirs = [featuresDir, jsonDir, diagramsDir, docsDir];

requiredDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    logger.warn(`Directory missing: ${dir}`);
    process.exit(0);
  }
});

const missingJsonFiles: string[] = [];
const missingDiagramFiles: string[] = [];
const missingDocsFiles: string[] = [];

walkDir(featuresDir, (inputPath: string) => {
  if (isJsonnetFile(inputPath)) {
    const relativePath = path.relative(featuresDir, inputPath);
    const expectedJsonPath = getJsonOutputPath(inputPath, featuresDir, jsonDir);
    const expectedMermaidPath = getMermaidOutputPath(
      expectedJsonPath,
      jsonDir,
      diagramsDir
    );
    const expectedDocsPath = getDocsFilePath(expectedJsonPath);

    if (!fs.existsSync(expectedJsonPath)) {
      missingJsonFiles.push(relativePath);
    }
    if (!fs.existsSync(expectedMermaidPath)) {
      missingDiagramFiles.push(relativePath);
    }
    if (!fs.existsSync(expectedDocsPath)) {
      missingDocsFiles.push(relativePath);
    }
  }
});

if (
  missingJsonFiles.length === 0 &&
  missingDiagramFiles.length === 0 &&
  missingDocsFiles.length === 0
) {
  logger.success("All Jsonnet files have corresponding generated JSON files!");
  process.exit(0);
} else {
  if (missingJsonFiles.length > 0) {
    logger.error(
      "Missing generated JSON files for the following Jsonnet definitions:"
    );
    logger.info("This likely means you need to run 'npm run generateJson'");
    missingJsonFiles.forEach((file: string) => {
      logger.error(`  - ${file}`);
    });
  }

  if (missingDiagramFiles.length > 0) {
    logger.error(
      "Missing generated diagram files for the following Jsonnet definitions:"
    );
    logger.info("This likely means you need to run 'npm run generateDiagrams'");
    missingDiagramFiles.forEach((file: string) => {
      logger.error(`  - ${file}`);
    });
  }

  if (missingDocsFiles.length > 0) {
    logger.error(
      "Missing generated docs files for the following Jsonnet definitions:"
    );
    logger.info(
      "This likely means you need to run 'npm run generateMarkdownDocs'"
    );
    missingDocsFiles.forEach((file: string) => {
      logger.error(`  - ${file}`);
    });
  }

  process.exit(1);
}
