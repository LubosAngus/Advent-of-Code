import getFolderPath from "@advent-cli/src/get-folder-path";
import * as path from "path";
import fetchInput from "@advent-cli/src/fetch-input";
import ora from "ora";
import { readFile, writeFile } from "fs/promises";

export default async (): Promise<void> => {
  const loadingSpinner = ora(`Checking if input.txt exists`).start();
  const folderPath = getFolderPath();
  const inputFilePath = path.join(folderPath, "input.txt");
  let inputExists = true;

  try {
    const inputContents = await readFile(inputFilePath, "utf-8");
    inputExists = !!inputContents;
  } catch {
    inputExists = false;
  }

  if (inputExists) {
    loadingSpinner.info("input.txt already exists");
    return;
  }

  loadingSpinner.text = "fetching input.txt from remote";

  const input = await fetchInput();

  await writeFile(inputFilePath, input);

  loadingSpinner.succeed("input.txt successfully fetched");
};
