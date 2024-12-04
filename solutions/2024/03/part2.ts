import { readFileSync } from "fs";

// const rawData = readFileSync("./demo1.txt", "utf-8");
const rawData = readFileSync("./input.txt", "utf-8");

export default async (): Promise<string | number> => {
  let result = 0;

  const instructions = [
    ...rawData.matchAll(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g),
  ].map((match) => {
    return match[0];
  });

  let isEnabled = true;

  for (const instruction of instructions) {
    if (instruction === "don't()") {
      isEnabled = false;

      continue;
    }

    if (instruction === "do()") {
      isEnabled = true;

      continue;
    }

    if (!isEnabled) {
      continue;
    }

    const matches = /mul\((\d+),(\d+)\)/g.exec(instruction);

    result += parseInt(matches[1]) * parseInt(matches[2]);
  }

  return result;
};
