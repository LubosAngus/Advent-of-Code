import chalk from "chalk";
import fetchWithCookie from "./fetch-with-cookie";

export default async (): Promise<string> => {
  const response = await fetchWithCookie(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}/input`
  );

  const responseText = await response.text();

  if (response.status !== 200) {
    console.log(
      chalk.red.bold(response.status) + "\n" + chalk.red(responseText)
    );

    throw new Error(responseText);
  }

  return responseText.trim();
};
