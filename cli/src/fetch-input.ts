import ora from "ora";
import chalk from "chalk";

export default async (): Promise<string | false> => {
  const loadingSpinner = ora(
    `Fetching input.txt for day ${global.day}`
  ).start();

  const response = await fetch(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}/input`,
    {
      headers: {
        cookie: `session=${process.env.USER_SESSION_COOKIE}`,
      },
    }
  );

  const responseText = await response.text();

  if (response.status !== 200) {
    loadingSpinner.fail(
      chalk.red(chalk.bold(response.status)) + "\n" + chalk.red(responseText)
    );

    return false;
  }

  loadingSpinner.succeed(chalk.green("input.txt successfully fetched"));

  return responseText;
};
