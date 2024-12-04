import timer from "@advent-cli-src/timer";
import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import submitResult from "./submit-result";
import cleanupBeforeExit from "./cleanup-before-exit";

global.resultAbortController = undefined as AbortController;

const systemMessagesMap = {
  EXECUTION_START: () => {
    timer.stop("init");

    console.log(chalk.cyan.dim.italic(`Initialized in ${timer.read("init")}`));
    console.log(chalk.cyan.dim("".padStart(27, "╴")));

    timer.start("exec");
  },

  EXECUTION_END: () => {
    timer.stop("exec");
  },

  RESULT: (result: string) => {
    if (global.resultAbortController?.signal?.aborted === false) {
      global.resultAbortController.abort();
    }

    console.log();
    if (result) {
      console.log(chalk.cyan("Result is: ") + chalk.bgMagenta(result));
    } else {
      console.log(chalk.cyan("No result"));
    }
    console.log(chalk.cyan.dim.italic(`Execution took ${timer.read("exec")}`));

    if (!result) {
      return;
    }

    global.resultAbortController = new AbortController();

    // TODO: FIXME NTH - need to press ctrl + c twice to kill process on windows
    confirm(
      {
        message: "",
        default: true,
        theme: {
          prefix: "",
          style: {
            message: () => "",
            answer: () => "",
            defaultAnswer: () => "",
          },
        },
      },
      {
        signal: global.resultAbortController.signal,
      }
    )
      .then(async (value) => {
        if (value !== true) return;

        global.IS_SUBMITTING_ANSWER = true;
        await submitResult(result);
        global.IS_SUBMITTING_ANSWER = false;
      })
      .catch(async () => {
        // don't remove and leave empty, otherwise program will halt
      });

    console.log();
    console.log(
      chalk.italic.grey.dim("To submit result press ") +
        chalk.italic.cyan("↵ enter")
    );
  },
};

export type SystemMessagesKeys = keyof typeof systemMessagesMap;

export default function (message: string): void {
  const event = message.split(";")[1];
  const [eventName, data] = event.split("=");
  const functionToRun = systemMessagesMap[eventName];

  if (typeof functionToRun !== "function") {
    console.error(`No function for event ${eventName}`);
  }

  functionToRun(data);
}
