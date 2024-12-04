import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { exec } from "child_process";
import cleanupBeforeExit from "./cleanup-before-exit";
import ora from "ora";

export default async (): Promise<void> => {
  console.log();

  const shouldPush = await confirm({
    message: "Push changes?",
    default: true,
  }).catch(async (error) => {
    console.log();
    console.log(chalk.blue.italic(error.message));

    await cleanupBeforeExit();
    process.exit(0);
  });

  if (!shouldPush) {
    return;
  }

  console.log();

  const loadingSpinner = ora("Pushing changes").start();

  exec(
    `git push`,
    (error, stdout, stderr) => {
      loadingSpinner.clear();

      console.log(stdout);

      if (error) {
        console.error(chalk.bgRed.bold.white(" ERROR "));
        console.error(error.message || error);
      }

      if (stderr) {
        console.error(chalk.bgRed.bold.white(" STDERR "));
        console.error(stderr.toString());
      }

      process.exit();
    }
  );
};
