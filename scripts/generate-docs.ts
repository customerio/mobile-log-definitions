import fs from "fs";
import path from "path";
import logger from "./log-styling";
import {
  walkDir2,
  isJsonFile,
  getMermaidOutputPath,
  getDocsFilePath,
  docsDir,
  jsonDir,
  diagramsDir,
} from "./utils";
import { LogPoint } from "./types";

function generateLogExamples(data: LogPoint[]): string[] {
  // Step 1: Create a map that maps an id to its LogPoint object
  const logMap = new Map<string, LogPoint>();
  data.forEach((item) => logMap.set(item.id, item));

  // Step 2: Start from the first object
  const logs: string[] = [];
  let current: LogPoint = data[0];

  // Step 3: Follow next/success and collect logs
  while (current) {
    logs.push(`[${current.tag}] ${current.log}`);

    const nextId = current.success || current.next;
    if (!nextId) break;

    const next = logMap.get(nextId);
    if (!next) break;

    current = next;
  }

  return logs;
}

function formatTableRow(log: LogPoint): string {
  let description = log.label;
  if (log.description) {
    description += ` -> ${log.description}`;
  }
  return [log.id, log.tag, description, log.log].join(" | ");
}

function generateMarkdown(
  featureName: string,
  logData: LogPoint[],
  diagramPath: string
): string {
  const title = `# ${
    featureName.charAt(0).toUpperCase() + featureName.slice(1)
  } Logs`;
  const tableHeader = `| ID | Tag | Description | log |
|----|---------|-------------------|---------|`;
  const tableRows = logData.map(formatTableRow).join("\n");

  let mermaidBlock = "";
  if (diagramPath) {
    if (fs.existsSync(diagramPath)) {
      const mermaidContent = fs.readFileSync(diagramPath, "utf-8");
      mermaidBlock = `\n\n## Flow Diagram\n\n\`\`\`mermaid\n${mermaidContent}\n\`\`\`\n`;
    } else {
      logger.warn(
        `No diagram found for feature: ${featureName} at ${diagramPath}`
      );
    }
  }

  logger.info(`Generating log examples for feature: ${featureName}`);

  const exampleLogs = generateLogExamples(logData).join("\n");
  let exampleContent = "Here's an example of the logs in the happy scenario:\n";
  exampleContent += "```\n";
  exampleContent += exampleLogs;
  exampleContent += "\n```";

  return `${title}\n\n${mermaidBlock}${tableHeader}\n${tableRows}\n\n\n${exampleContent}`;
}

function appendToMap(key: string, value: string) {
  if (!map.has(key)) {
    map.set(key, [value]);
  } else {
    map.get(key)!.push(value);
  }
}

function generateIndexPage(map: Map<string, string[]>) {
  logger.heading("Generating main docs README file");

  let content = "# Customer.io Log Documentation\n\n";
  content += `Below is the documentation pages for all features:\n\n`;

  for (const [key, values] of map.entries()) {
    const cleanedUpKey = path.basename(key);
    content += `## ${cleanedUpKey}\n\n`;
    for (const value of values) {
      const name = value.replace(/\.md$/, "");
      content += `- [${name}](${value})\n`;
    }
    content += `\n`;
  }

  const indexPagePath = path.join(docsDir, "README.md");
  fs.writeFileSync(indexPagePath, content);
  logger.success("Generated main docs README file successfully!");
}

logger.heading("Generating markdown docs...");
logger.blank();

logger.info("Deleting existing docs...");
fs.rmSync(docsDir, { recursive: true, force: true });

const map = new Map<string, string[]>();

walkDir2(jsonDir, (dir: string, fileName: string) => {
  const filePath = path.join(dir, fileName);
  if (isJsonFile(filePath)) {
    const featureName = path.basename(filePath, ".json");
    const docsFilePath = getDocsFilePath(filePath);
    const diagramPath = getMermaidOutputPath(filePath, jsonDir, diagramsDir);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonContent: LogPoint[] = JSON.parse(fileContent);

    const markdown = generateMarkdown(featureName, jsonContent, diagramPath);
    fs.mkdirSync(path.dirname(docsFilePath), { recursive: true });
    fs.writeFileSync(docsFilePath, markdown);

    appendToMap(dir, `${featureName}.md`);
  } else {
    logger.warn(
      `Skipping unsupported file: ${path.relative(jsonDir, filePath)}`
    );
  }
});

generateIndexPage(map);

logger.success(`Generated docs successfully!`);
