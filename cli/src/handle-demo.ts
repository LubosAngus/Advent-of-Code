import getFolderPath from "@advent-cli-src/get-folder-path";
import * as path from "path";
import fetchDemo from "./fetch-demo";
import ora from "ora";
import chalk from "chalk";
import { readFile, writeFile } from "fs/promises";

export default async (): Promise<void> => {
  const loadingSpinner = ora(`Checking if demo.txt exists`).start();
  const folderPath = getFolderPath();
  const demoFilePath = path.join(folderPath, "demo.txt");
  let demoExists = true;

  try {
    const demoContents = await readFile(demoFilePath, "utf-8")
    demoExists = !!demoContents
  } catch {
    demoExists = false;
  }

  if (demoExists) {
    loadingSpinner.info("demo.txt already exists");
    return;
  }

  loadingSpinner.text = 'fetching demo.txt from remote'

  const demo = await fetchDemo();

  await writeFile(demoFilePath, demo);

  if (demo === '') {
    loadingSpinner.warn(chalk.yellow("demo.txt not found"));
  } else {
    loadingSpinner.succeed("demo.txt successfully fetched");
  }
};
