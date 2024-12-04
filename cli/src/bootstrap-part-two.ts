import getFolderPath from "@advent-cli-src/get-folder-path";
import { promises as fs, readFileSync } from "fs";
import * as path from "path";

export default async (): Promise<void> => {
  try {
    const folderPath = getFolderPath();
    const filePath = path.join(folderPath, "part2.ts");

    // Check if part2.ts exists, duplicate part1.ts if it doesn't
    try {
      await fs.access(filePath);
    } catch {
      const partOnePath = path.join(folderPath, "part1.ts");
      const partOneContent = await readFileSync(partOnePath, "utf-8");

      await fs.writeFile(filePath, partOneContent);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
