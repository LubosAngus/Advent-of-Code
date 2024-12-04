import clearConsole from "@advent-cli-src/clear-console";
import createDayFolder from "@advent-cli-src/create-day-folder";
import bootstarpPartOne from "@advent-cli-src/bootstrap-part-one";
import askUserYear from "@advent-cli-src/ask-user-year";
import askUserDay from "@advent-cli-src/ask-user-day";
import handleInput from "@advent-cli-src/handle-input";
import handleDemo from "@advent-cli-src/handle-demo";
import fetchStars from "@advent-cli-src/fetch-stars";
import startWatch from "@advent-cli-src/start-watch";
import cleanupBeforeExit from "@advent-cli-src/cleanup-before-exit";

// on exit close watcher
process.on("SIGINT", async () => {
  await cleanupBeforeExit();

  process.exit(0);
});

clearConsole();

await fetchStars();

// Ask user which year and day
await askUserYear();
await askUserDay();

// Check if folder exists, create if it doesn't
await createDayFolder();

// Bootstrap part 1 from template
await bootstarpPartOne();

// If input doesn't exists, fetch it from the internet
await handleInput();

// If demo doesn't exists, fetch it from the internet
await handleDemo();

await startWatch();
