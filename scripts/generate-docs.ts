import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./log-styling";
import { walkDir2, isJsonFile, getMermaidOutputPath } from "./utils";
import { LogPoint } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featuresJsonDir = path.resolve(__dirname, "../generated/json");
const diagramsDir = path.resolve(__dirname, "../generated/mermaid");
const docsDir = path.resolve(__dirname, "../docs");

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

  return `${title}\n\n${mermaidBlock}${tableHeader}\n${tableRows}\n`;
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

if (!fs.existsSync(docsDir)) {
  logger.info(`Docs directory doesn't exist, creating dir: ${docsDir}`);
  fs.mkdirSync(docsDir);
}

const map = new Map<string, string[]>();

walkDir2(featuresJsonDir, (dir: string, fileName: string) => {
  const filePath = path.join(dir, fileName);
  logger.info(`dir: ${dir} file: ${fileName}`);
  if (isJsonFile(filePath)) {
    const featureName = path.basename(filePath, ".json");
    const diagramPath = getMermaidOutputPath(
      filePath,
      featuresJsonDir,
      diagramsDir
    );
    const outputPath = path.join(docsDir, `${featureName}.md`);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonContent: LogPoint[] = JSON.parse(fileContent);

    const markdown = generateMarkdown(featureName, jsonContent, diagramPath);
    fs.writeFileSync(outputPath, markdown);

    appendToMap(dir, `${featureName}.md`);

    logger.success(`Generated docs successfully!`);
  } else {
    logger.warn(
      `Skipping unsupported file: ${path.relative(featuresJsonDir, filePath)}`
    );
  }
});

generateIndexPage(map);
