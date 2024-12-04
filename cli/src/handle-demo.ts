import getFolderPath from "@advent-cli-src/get-folder-path";
import { promises as fs } from "fs";
import * as path from "path";
import fetchDemo from "./fetch-demo";

export default async (): Promise<void> => {
  const folderPath = getFolderPath();
  const demoFilePath = path.join(folderPath, "demo.txt");
  let demoExists = true;

  try {
    await fs.access(demoFilePath);
  } catch {
    demoExists = false;
  }

  if (demoExists) {
    return;
  }

  const demo = await fetchDemo();

  if (!demo) {
    throw new Error("Some demo error");
  }

  await fs.writeFile(demoFilePath, demo.trim());
};
