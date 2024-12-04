import { readFileSync } from "fs";

const rawData = readFileSync('./demo.txt', 'utf-8')
// const rawData = readFileSync('./input.txt', 'utf-8')

function parseInput(data: string) {
  return data
    .split('\n')
    .map((row) => row.split(' ').map(Number))
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  console.log(input);

  return "";
};
