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
 * Converts a .jsonnet input path to a .json output path.
 */
export function getOutputPath(
  inputPath: string,
  inputRoot: string,
  outputRoot: string
) {
  const relativePath = path.relative(inputRoot, inputPath);
  return path.join(outputRoot, relativePath.replace(/\.jsonnet$/, ".json"));
}
