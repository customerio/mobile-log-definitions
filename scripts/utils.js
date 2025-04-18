import fs from "fs";
import path from "path";

/**
 * Recursively walks a directory and calls a callback for every file.
 */
export function walkDir(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

/**
 * Determines if a file is a valid Jsonnet file
 */
export function isJsonnetFile(filePath) {
  return filePath.endsWith(".jsonnet");
}

/**
 * Determines if a file is a valid libsonnet file
 */
export function isLibSonnetFile(file) {
  return file.endsWith(".libsonnet");
}

/**
 * Determines if a file is a valid JSON file
 */
export function isJsonFile(file) {
  return file.endsWith(".json");
}

/**
 * Converts a .jsonnet input path to a .json output path.
 */
export function getJsonOutputPath(inputPath, inputRoot, outputRoot) {
  const relativePath = path.relative(inputRoot, inputPath);
  return path.join(outputRoot, relativePath.replace(/\.jsonnet$/, ".json"));
}

/**
 * Converts a .json input path to a .mmd output path.
 */
export function getMermaidOutputPath(inputPath, inputRoot, outputRoot) {
  const relativePath = path.relative(inputRoot, inputPath);
  return path.join(outputRoot, relativePath.replace(/\.json$/, ".mmd"));
}