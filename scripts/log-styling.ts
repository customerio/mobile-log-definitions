import chalk from "chalk";

const logger = {
  heading: (msg: string) => {
    console.log(chalk.bold.cyan(`\n🚀 ${msg}`));
  },
  info: (msg: string) => {
    console.log(chalk.cyan("ℹ️  " + msg));
  },
  success: (msg: string) => {
    console.log(chalk.green("✅ " + msg));
  },
  warn: (msg: string) => {
    console.log(chalk.yellow("⚠️  " + msg));
  },
  error: (msg: string) => {
    console.log(chalk.red("❌ " + msg));
  },
  blank: () => {
    console.log("");
  },
};

export default logger;
