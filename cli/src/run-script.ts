import clearConsole from "@advent-cli-src/clear-console";
import timer from "@advent-cli-src/timer";
import chalk from "chalk";
import { type ChildProcessWithoutNullStreams, spawn } from "child_process";
import { pathToFileURL } from "url";
import kill from "tree-kill";
import processSystemMessage from "@advent-cli-src/process-system-message";
import printHeader from "./print-header";
import path from "path";
import getFolderPath, { __ROOT_DIR } from "./get-folder-path";

let childProcess: ChildProcessWithoutNullStreams | null = null;
const SYSTEM_MESSAGE_KEY = "__SYSTEM_EVENT__";

export default async function (): Promise<void> {
  if (global.IS_SUBMITTING_ANSWER === true) {
    return;
  }

  if (global.resultAbortController?.signal?.aborted === false) {
    global.resultAbortController.abort();
  }

  timer.start("init");

  const folderPath = getFolderPath();
  const filePath = path.join(folderPath, global.file);

  if (childProcess !== null) {
    kill(childProcess.pid);
  }

  clearConsole();
  printHeader();

  const args = [];

  args.push(path.join(__ROOT_DIR, `cli/solution-execute.ts`));
  args.push(pathToFileURL(filePath).href);
  args.push(SYSTEM_MESSAGE_KEY);

  childProcess = spawn("tsx", args, {
    shell: true,
    cwd: folderPath,
  });

  childProcess.stdout.on("data", (data) => {
    const messages = data.toString().split("\n");

    for (const message of messages) {
      if (!message) continue;

      if (message.startsWith(SYSTEM_MESSAGE_KEY)) {
        processSystemMessage(message);

        continue;
      }

      console.log(message);
    }
  });

  childProcess.stderr.on("data", (data) => {
    console.error(chalk.bgRed.bold.white(" STDERR "));
    console.error(data.toString());
  });

  childProcess.on("error", (error) => {
    console.error(chalk.bgRed.bold.white(" ERROR "));
    console.error(error.message || error);
  });
}
