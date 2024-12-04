import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { exec } from "child_process";
import cleanupBeforeExit from "./cleanup-before-exit";

export default async (): Promise<void> => {
  console.log();

  const commitAndPush = await confirm({
    message: "Do you want to commit and push?",
    default: true,
  }).catch(async (error) => {
    console.log();
    console.log(chalk.blue.italic(error.message));

    await cleanupBeforeExit();
    process.exit(0);
  });

  if (!commitAndPush) {
    return;
  }

  const commitMessage = `${global.year}/${global.day}/${global.file}`;

  exec(
    `git add solutions/${global.year}/${global.day} && git commit -m "${commitMessage}" && git push`,
    (error, stdout, stderr) => {
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
