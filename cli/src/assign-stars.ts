import * as path from "path";
import { __ROOT_DIR } from "@advent-cli-src/get-folder-path";
import { promises as fs } from "fs";

export default async (): Promise<void> => {
  const starsFilePath = path.join(__ROOT_DIR, "stars.json");
  const year = global.year;
  const day = global.day;
  const newValue = global.part;

  let stars = {
    [year]: {
      total: 0,
    },
  };

  try {
    const starsRaw = await fs.readFile(starsFilePath, {
      encoding: "utf-8",
    });

    stars = JSON.parse(starsRaw);
  } catch {
    // nevermind
  }

  let newTotal = stars[year].total;

  let oldValue = 0;
  if (stars[year][day]) {
    oldValue = stars[year][day];
  }

  newTotal += newValue - oldValue;

  stars[year].total = newTotal;
  stars[year][day] = "".padStart(newValue, "*");

  await fs.writeFile(starsFilePath, JSON.stringify(stars, null, 2));
};
