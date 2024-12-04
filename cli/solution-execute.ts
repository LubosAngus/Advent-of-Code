import { type SystemMessagesKeys } from "@advent-cli-src/process-system-message";

function printSystemEvent(name: SystemMessagesKeys, data: string = "") {
  const systemEventName = process.argv[3];

  console.log(`${systemEventName};${name}=${data}`);
}

(async () => {
  const scriptFilePath = process.argv[2];
  const fileToExecute = await import(scriptFilePath);

  printSystemEvent("EXECUTION_START");

  const result = await fileToExecute.default();

  printSystemEvent("EXECUTION_END");
  printSystemEvent("RESULT", result?.toString());
})();
