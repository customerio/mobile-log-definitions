import chalk from "chalk";

const log = {
  heading: (msg) => {
    console.log(chalk.bold.cyan(`\n🚀 ${msg}`));
  },
  info: (msg) => {
    console.log(chalk.cyan("ℹ️  " + msg));
  },
  success: (msg) => {
    console.log(chalk.green("✅ " + msg));
  },
  warn: (msg) => {
    console.log(chalk.yellow("⚠️  " + msg));
  },
  error: (msg) => {
    console.log(chalk.red("❌ " + msg));
  },
  blank: () => {
    console.log("");
  },
};

export default log;
