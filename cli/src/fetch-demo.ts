import chalk from "chalk";
import fetchWithCookie from "./fetch-with-cookie";

export default async (): Promise<string[]> => {
  const response = await fetchWithCookie(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}`
  );

  const responseText = await response.text();

  if (response.status !== 200) {
    console.log(chalk.red.bold(response.status));

    throw new Error(responseText);
  }

  const regex = /For example.*?<code>(.*?)<\/code>/gs;

  return [...responseText.matchAll(regex)].map((match) => {
    return match[1].trim();
  });
};
