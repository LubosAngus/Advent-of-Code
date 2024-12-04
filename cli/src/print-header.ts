import chalk from "chalk";

export default (isInitial: boolean = false): void => {
  const filePath = `solutions/${global.year}/${global.day}/${global.file}`;
  const message = ` Save ${filePath} to execute `;

  console.log(chalk.bgCyan.black.bold(message));
};
