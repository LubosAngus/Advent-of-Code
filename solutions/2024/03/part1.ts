import { readFileSync } from "fs";

// const rawData = readFileSync("./demo.txt", "utf-8");
const rawData = readFileSync("./input.txt", "utf-8");

export default async (): Promise<string | number> => {
  return [...rawData.matchAll(/mul\((\d+),(\d+)\)/g)].reduce((acc, match) => {
    const multiplication = parseInt(match[1]) * parseInt(match[2]);

    return acc + multiplication;
  }, 0);
};
