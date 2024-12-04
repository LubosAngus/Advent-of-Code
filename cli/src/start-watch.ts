import getFolderPath from "@advent-cli/src/get-folder-path";
import printHeader from "@advent-cli/src/print-header";
import chokidar from "chokidar";
import * as path from "path";
import runScript from "@advent-cli/src/run-script";

export default async (): Promise<void> => {
  const folderPath = getFolderPath();
  const filePath = path.join(folderPath, global.file);

  // Watch for file changes
  const watcher = chokidar.watch(filePath, {
    persistent: true,
  });

  watcher.on("change", () => {
    runScript();
  });

  global.WATCHER = watcher;

  printHeader(true);
};
