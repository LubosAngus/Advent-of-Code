import chalk from "chalk";
import ora from "ora";
import { JSDOM } from "jsdom";
import fetchWithCookie from "./fetch-with-cookie";

export default async function (result: string): Promise<boolean> {
  const loadingSpinner = ora(`Submitting answer ${chalk.cyan(result)}`).start();

  const response = await fetchWithCookie(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}`
  );

  const responseText = await response.text();

  if (response.status !== 200) {
    loadingSpinner.fail(
      chalk.red.bold(response.status) + "\n" + chalk.red(responseText)
    );

    return;
  }

  const dom = new JSDOM(responseText);
  const document = dom.window.document;

  const answers = [
    ...document.querySelectorAll("main article.day-desc + p code"),
  ].map((answerEl) => {
    return answerEl.innerHTML;
  });

  const correctAnswer = answers[global.part - 1];

  if (correctAnswer !== result) {
    loadingSpinner.fail(chalk.bgRed.bold(result));
    console.log();

    console.log(chalk.red("That is not correct answer!"));
    console.log(
      chalk.red("Correct answer is ") + chalk.bgGreen.bold(correctAnswer)
    );

    return false;
  }

  loadingSpinner.succeed(chalk.bgGreen.bold(result));
  console.log();

  console.log(chalk.green("That is correct answer!"));

  return true;
}
