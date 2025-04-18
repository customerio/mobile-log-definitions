import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { walkDir, isJsonFile, getMermaidOutputPath } from "./utils.js";
import logger from "./log-styling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT_DIR = path.resolve(__dirname, "../generated/json");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/mermaid");

function toMermaid(events) {
  const lines = ["graph TD"];

  for (const event of events) {
    const id = event.id;
    const label = event.label;


    lines.push(`${id}["${label}"]`);
    if (event.next) {
      lines.push(`${id} --> ${event.next}`);
    }
    if (event.success) {
      lines.push(`${id} -->|Success| ${event.success}`);
    }
    if (event.error) {
      lines.push(`${id} -->|Error| ${event.error}`);
    }
  }

  return lines.join("\n");
}

function generateDiagram(filePath) {
  const relativePath = path.relative(INPUT_DIR, filePath);
  logger.info(`Generating diagram for: ${relativePath}`);

  const outputFile = getMermaidOutputPath(filePath, INPUT_DIR, OUTPUT_DIR);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  const events = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const output = toMermaid(events);

  fs.writeFileSync(outputFile, output);
}

if (!fs.existsSync(INPUT_DIR)) {
  logger.warn(`Generated directory is missing: ${INPUT_DIR}`);
  process.exit(0);
}

logger.heading("Generating Mermaid diagrams from JSON files...");
logger.blank();

walkDir(INPUT_DIR, (filePath) => {
  if (isJsonFile(filePath)) {
    generateDiagram(filePath);
  } else {
    logger.warn(
      `Skipping unsupported file: ${path.relative(INPUT_DIR, filePath)}`
    );
  }
});

logger.blank();
logger.success("Mermaid diagrams generated successfully!");
