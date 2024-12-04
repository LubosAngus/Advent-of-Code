import chalk from "chalk";

export default (): void => {
  console.log(
    chalk.bgCyan.black.bold(
      ` Watching ${global.year}/${global.day}/${global.file} `
    )
  );
};
