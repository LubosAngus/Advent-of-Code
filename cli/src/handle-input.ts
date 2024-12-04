import getFolderPath from "@advent-cli-src/get-folder-path";
import { promises as fs } from "fs";
import * as path from "path";
import fetchInput from "./fetch-input";

export default async (): Promise<void> => {
  const folderPath = getFolderPath();
  const inputFilePath = path.join(folderPath, "input.txt");
  let inputExists = true;

  try {
    await fs.access(inputFilePath);
  } catch {
    inputExists = false;
  }

  if (inputExists) {
    return;
  }

  const input = await fetchInput();

  if (!input) {
    throw new Error("Some input error");
  }

  await fs.writeFile(inputFilePath, input.trim());
};
