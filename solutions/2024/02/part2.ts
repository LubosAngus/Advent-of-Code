import { readFileSync } from "fs";

// const rawData = readFileSync("./demo.txt", "utf-8");
const rawData = readFileSync('./input.txt', 'utf-8')

function parseInput(data: string) {
  return data.split("\n").map((row) => row.split(" ").map(Number));
}

function isRowSafe(row) {
  const diffRule = {
    min: 1,
    max: 3,
  };
  let lastDirection: "up" | "down";
  let lastNum: number = row[0];

  for (let index = 1; index < row.length; index++) {
    const currNum = row[index];
    const currDirection = lastNum < currNum ? "up" : "down";

    if (lastDirection === undefined) {
      lastDirection = currDirection;
    }

    if (lastDirection !== currDirection) {
      return;
    }

    const numDiff = Math.abs(lastNum - currNum);

    if (numDiff < diffRule.min || numDiff > diffRule.max) {
      return;
    }

    lastNum = currNum;
  }

  return true;
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData);

  let safeRows = 0;

  for (const row of input) {
    for (let i = 0; i < row.length; i++) {
      const subsetRow = [...row]
      subsetRow.splice(i, 1)

      if (!isRowSafe(subsetRow)) continue;

      safeRows++;
      break
    }
  }

  return safeRows;
};
