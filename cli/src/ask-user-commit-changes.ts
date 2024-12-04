import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { exec } from "child_process";
import cleanupBeforeExit from "./cleanup-before-exit";
import ora from "ora";
import askUserPushChanges from "./ask-user-push-changes";
import sleep from "@advent-utils/sleep";

export default async (): Promise<void> => {
  console.log();

  const shouldCommit = await confirm({
    message: "Commit changes?",
    default: true,
  }).catch(async (error) => {
    console.log();
    console.log(chalk.blue.italic(error.message));

    await cleanupBeforeExit();
    process.exit(0);
  });

  if (!shouldCommit) {
    return;
  }

  const commitMessage = `${global.year}/${global.day} - Part ${global.part}`;
  const loadingSpinner = ora(
    `Commiting with message "${commitMessage}"`
  ).start();

  exec(
    // `git add solutions/${global.year}/${global.day} && git commit -m "${commitMessage}"`,
    `git add solutions/${global.year}/${global.day}`,
    async (error, stdout, stderr) => {
      loadingSpinner.stop();

      if (stdout) {
        console.log(stdout);
      }

      if (error) {
        console.error(chalk.bgRed.bold.white(" ERROR "));
        console.error(error.message || error);
      }

      if (stderr) {
        console.error(chalk.bgRed.bold.white(" STDERR "));
        console.error(stderr.toString());
      }

      await askUserPushChanges();
    }
  );
};
