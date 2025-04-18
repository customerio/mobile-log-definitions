import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { walkDir, isJsonFile, getMermaidOutputPath } from "./utils";
import logger from "./log-styling";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, "../generated/json");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/mermaid");

type Event = {
  id: string;
  label: string;
  next?: string;
  success?: string;
  error?: string;
};

function toMermaid(events: Event[]): string {
  const lines: string[] = ["graph TD"];

  for (const event of events) {
    const { id, label, next, success, error } = event;

    lines.push(`${id}["${label}"]`);
    if (next) {
      lines.push(`${id} --> ${next}`);
    }
    if (success) {
      lines.push(`${id} -->|Success| ${success}`);
    }
    if (error) {
      lines.push(`${id} -->|Error| ${error}`);
    }
  }

  return lines.join("\n");
}

function generateDiagram(filePath: string): void {
  const relativePath = path.relative(INPUT_DIR, filePath);
  logger.info(`Generating diagram for: ${relativePath}`);

  const outputFile = getMermaidOutputPath(filePath, INPUT_DIR, OUTPUT_DIR);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  const events: Event[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const output = toMermaid(events);

  fs.writeFileSync(outputFile, output);
}

if (!fs.existsSync(INPUT_DIR)) {
  logger.warn(`Generated directory is missing: ${INPUT_DIR}`);
  process.exit(0);
}

logger.heading("Generating Mermaid diagrams from JSON files...");
logger.blank();

walkDir(INPUT_DIR, (filePath: string) => {
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
