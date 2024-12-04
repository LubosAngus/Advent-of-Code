import getFolderPath from "@advent-cli/src/get-folder-path";
import { promises as fs } from "fs";
import ora from "ora";

export default async (): Promise<void> => {
  const loadingSpinner = ora(`Checking if folder for day exists`).start();
  const folderPath = getFolderPath();

  try {
    await fs.access(folderPath);
    loadingSpinner.info("Day folder already exists");
  } catch {
    await fs.mkdir(folderPath, { recursive: true });
    loadingSpinner.succeed("Day folder successfully created");
  }
};
