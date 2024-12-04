import { readFileSync } from "fs";

// const rawData = readFileSync('./demo.txt', 'utf-8')
const rawData = readFileSync("./input.txt", "utf-8");

function parseInput(data: string) {
  const parsedData = data.trim().split(/\r?\n/).filter(Boolean);

  const splitData = parsedData.reduce(
    (acc, item) => {
      const [left, right] = item.split("   ");

      acc.left.push(parseInt(left));
      acc.right.push(parseInt(right));

      return acc;
    },
    {
      left: [],
      right: [],
    } as {
      left: number[];
      right: number[];
    }
  );

  splitData.left.sort();
  splitData.right.sort();

  return splitData;
}

function calculateDistances(input) {
  const cache = new Map();
  let distances = 0;

  for (let index = 0; index < input.left.length; index++) {
    const leftVal = input.left[index];
    const rightVal = input.right[index];
    const cacheKey = `${leftVal}:${rightVal}`;

    if (cache.has(cacheKey)) {
      distances += cache.get(cacheKey);

      continue;
    }

    const distance = Math.abs(leftVal - rightVal);

    cache.set(cacheKey, distance);

    distances += distance;
  }

  return distances;
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData);

  return calculateDistances(input);
};
