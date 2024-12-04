import { readFileSync } from "fs";

const data = readFileSync("./demo.txt", "utf-8");
// const data = readFileSync('./input.txt', 'utf-8')

export default async (): Promise<string> => {
  console.log(data);

  return "";
};
