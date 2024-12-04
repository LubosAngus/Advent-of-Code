import getFolderPath, { __ROOT_DIR } from "@advent-cli-src/get-folder-path";
import { promises as fs, readFileSync } from "fs";
import * as path from "path";

export default async (): Promise<void> => {
  try {
    const folderPath = getFolderPath();
    const filePath = path.join(folderPath, "part1.ts");

    // Check if part1.ts exists, create if it doesn't
    try {
      await fs.access(filePath);
    } catch {
      const template = await readFileSync(
        path.join(__ROOT_DIR, "solutions/template.ts"),
        "utf-8"
      );

      await fs.writeFile(filePath, template);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
