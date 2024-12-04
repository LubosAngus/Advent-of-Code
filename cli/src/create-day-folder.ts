import getFolderPath from "@advent-cli-src/get-folder-path";
import { promises as fs } from "fs";

export default async (): Promise<void> => {
  try {
    const folderPath = getFolderPath();

    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
