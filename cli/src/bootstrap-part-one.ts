import getFolderPath, { __ROOT_DIR } from "@advent-cli/src/get-folder-path";
import { promises as fs, readFileSync } from "fs";
import ora from "ora";
import * as path from "path";

export default async (): Promise<void> => {
  const loadingSpinner = ora(`Checking if part1.ts exists`).start();
  const folderPath = getFolderPath();
  const filePath = path.join(folderPath, "part1.ts");

  // Check if part1.ts exists, create if it doesn't
  try {
    await fs.access(filePath);
    loadingSpinner.info("part1.ts already exists");
  } catch {
    const template = await readFileSync(
      path.join(__ROOT_DIR, "solutions/template.ts"),
      "utf-8"
    );
    await fs.writeFile(filePath, template);
    loadingSpinner.succeed("part1.ts successfully created");
  }
};
