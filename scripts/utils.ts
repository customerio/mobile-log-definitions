import fs from "fs";
import path from "path";

/**
 * Recursively walks a directory and calls a callback for every file.
 */
export function walkDir(dir: string, callback: (filePath: string) => void) {
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
 * Recursively walks a directory and calls a callback for every file with directory path and file name.
 */
export function walkDir2(dir: string, callback: (dir: string, fileName: string) => void) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir2(fullPath, callback);
    } else {
      callback(dir, entry.name);
    }
  });
}

/**
 * Determines if a file is a valid Jsonnet file
 */
export function isJsonnetFile(filePath: string) {
  return filePath.endsWith(".jsonnet");
}

/**
 * Determines if a file is a valid libsonnet file
 */
export function isLibSonnetFile(file: string) {
  return file.endsWith(".libsonnet");
}

/**
 * Determines if a file is a valid JSON file
 */
export function isJsonFile(file: string) {
  return file.endsWith(".json");
}

/**
 * Converts a .jsonnet input path to a .json output path.
 */
export function getJsonOutputPath(
  inputPath: string,
  inputRoot: string,
  outputRoot: string
) {
  const relativePath = path.relative(inputRoot, inputPath);
  return path.join(outputRoot, relativePath.replace(/\.jsonnet$/, ".json"));
}

/**
 * Converts a .json input path to a .mmd output path.
 */
export function getMermaidOutputPath(
  inputPath: string,
  inputRoot: string,
  outputRoot: string
) {
  const relativePath = path.relative(inputRoot, inputPath);
  return path.join(outputRoot, relativePath.replace(/\.json$/, ".mmd"));
}
