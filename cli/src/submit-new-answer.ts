import chalk from "chalk";
import ora from "ora";
import { JSDOM } from "jsdom";

export default async function (result: string): Promise<boolean> {
  const loadingSpinner = ora(`Submitting answer ${chalk.cyan(result)}`).start();

  // TODO: NTH when have star already, check on the page for answer
  const response = await fetch(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}/answer`,
    {
      method: "POST",
      body: `level=${global.part}&answer=${result}`,
      headers: {
        accept: "text/html",
        "content-type": "application/x-www-form-urlencoded",
        cookie: `session=${process.env.USER_SESSION_COOKIE}`,
      },
    }
  );

  const responseText = await response.text();

  if (response.status !== 200) {
    loadingSpinner.fail(
      chalk.red(chalk.bold(response.status)) + "\n" + chalk.red(responseText)
    );

    return;
  }

  const dom = new JSDOM(responseText);
  const document = dom.window.document;

  let mainHtml = document.querySelector("main article p").innerHTML;
  mainHtml = mainHtml.replace(/<\/?[^>]+(>|$)/g, "");
  mainHtml = mainHtml.replace(/\[Return to Day.*?\]/g, "");
  mainHtml = mainHtml.replace(/\[Continue to.*?\]/g, "");

  if (!mainHtml.includes("That's the right answer!")) {
    loadingSpinner.fail(chalk.bgRed.bold(result));
    console.log();

    for (const line of mainHtml.split("  ")) {
      if (line.startsWith("If you're stuck")) continue;

      console.log(chalk.red(line));
    }

    return false;
  }

  loadingSpinner.succeed(chalk.bgGreen.bold(result));
  console.log();

  for (const line of mainHtml.split("  ")) {
    console.log(chalk.green(line));
  }

  return true;
}
