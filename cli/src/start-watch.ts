import clearConsole from "@advent-cli-src/clear-console";
import getFolderPath, { __ROOT_DIR } from "@advent-cli-src/get-folder-path";
import printHeader from "@advent-cli-src/print-header";
import timer from "@advent-cli-src/timer";
import chalk from "chalk";
import { type ChildProcessWithoutNullStreams, spawn } from "child_process";
import chokidar from "chokidar";
import * as path from "path";
import { pathToFileURL } from "url";
import kill from "tree-kill";
import processSystemMessage from "@advent-cli-src/process-system-message";

let runningProcess: ChildProcessWithoutNullStreams | null = null;
const SYSTEM_MESSAGE_KEY = "__SYSTEM_EVENT__";

export default async (): Promise<void> => {
  const folderPath = getFolderPath();
  const filePath = path.join(folderPath, global.file);

  async function runScript() {
    if (global.IS_SUBMITTING_ANSWER === true) {
      return;
    }

    if (global.resultAbortController?.signal?.aborted === false) {
      global.resultAbortController.abort();
    }

    timer.start("init");

    if (runningProcess !== null) {
      kill(runningProcess.pid);
    }

    clearConsole();
    printHeader();

    const args = [];

    args.push(path.join(__ROOT_DIR, `cli/solution-execute.ts`));
    args.push(pathToFileURL(filePath).href);
    args.push(SYSTEM_MESSAGE_KEY);

    const childProcess = spawn("tsx", args, {
      shell: true,
      cwd: folderPath,
    });

    runningProcess = childProcess;

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

  // Watch for file changes
  const watcher = chokidar.watch(filePath, {
    persistent: true,
  });

  watcher.on("change", () => {
    runScript();
  });

  global.WATCHER = watcher;

  printHeader(true)
};
