import chalk from "chalk";

export default async (): Promise<string> => {
  const response = await fetch(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}`
  );

  const responseText = await response.text();

  if (response.status !== 200) {
    console.log(
      chalk.red.bold(response.status) + "\n" + chalk.red(responseText)
    );

    throw new Error(responseText);
  }

  const regex = /For example.*?<code>(?<demo>.*?)<\/code>/s;
  const matches = regex.exec(responseText);

  return (matches?.groups?.demo || "").trim();
};
