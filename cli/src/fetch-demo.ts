import ora from "ora";
import chalk from "chalk";

export default async (): Promise<string | false> => {
  const loadingSpinner = ora(`Fetching demo.txt for day ${global.day}`).start();

  const response = await fetch(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}`
  );

  const responseText = await response.text();

  if (response.status !== 200) {
    loadingSpinner.fail(
      chalk.red(chalk.bold(response.status)) + "\n" + chalk.red(responseText)
    );

    return false;
  }

  const regex = /For example:.*?<code>(?<demo>.*?)<\/code>/s;
  const matches = regex.exec(responseText);

  loadingSpinner.succeed(chalk.green("demo.txt successfully fetched"));

  return matches?.groups?.demo ?? false;
};
