import fs from "fs";
import path from "path";
import { walkDir, isJsonFile, getMermaidOutputPath, diagramsDir, jsonDir } from "./utils";
import logger from "./log-styling";

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
  const relativePath = path.relative(jsonDir, filePath);
  logger.info(`Generating diagram for: ${relativePath}`);

  const outputFile = getMermaidOutputPath(filePath, jsonDir, diagramsDir);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  const events: Event[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const output = toMermaid(events);

  fs.writeFileSync(outputFile, output);
}

if (!fs.existsSync(jsonDir)) {
  logger.warn(`Generated directory is missing: ${jsonDir}`);
  logger.info("This likely means you need to run 'npm run generateJson'");
  process.exit(0);
}

logger.heading("Generating Mermaid diagrams from JSON files...");
logger.blank();

logger.info('Deleting existing diagrams...');
fs.rmSync(diagramsDir, { recursive: true, force: true });

walkDir(jsonDir, (filePath: string) => {
  if (isJsonFile(filePath)) {
    generateDiagram(filePath);
  } else {
    logger.warn(
      `Skipping unsupported file: ${path.relative(jsonDir, filePath)}`
    );
  }
});

logger.blank();
logger.success("Mermaid diagrams generated successfully!");
