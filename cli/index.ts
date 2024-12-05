import askUserDay from '@advent-cli/src/ask-user-day'
import askUserPart from '@advent-cli/src/ask-user-part'
import askUserYear from '@advent-cli/src/ask-user-year'
import bootstrapPartOne from '@advent-cli/src/bootstrap-part-one'
import bootstrapPartTwo from '@advent-cli/src/bootstrap-part-two'
import cleanupBeforeExit from '@advent-cli/src/cleanup-before-exit'
import clearConsole from '@advent-cli/src/clear-console'
import createDayFolder from '@advent-cli/src/create-day-folder'
import fetchStars from '@advent-cli/src/fetch-stars'
import handleDemo from '@advent-cli/src/handle-demo'
import handleInput from '@advent-cli/src/handle-input'
import startWatch from '@advent-cli/src/start-watch'
import chalk from 'chalk'

// on exit close watcher
process.on('SIGINT', async () => {
  await cleanupBeforeExit()

  process.exit(0)
})

clearConsole()

await fetchStars()

// Ask user which year, day and part
await askUserYear()
await askUserDay()
await askUserPart()

console.log(chalk.cyan.dim(''.padStart(44, '╴')))

// Check if folder exists, create if it doesn't
await createDayFolder()

// Bootstrap parts from template
await bootstrapPartOne()
await bootstrapPartTwo()

// If input doesn't exists, fetch it from the internet
await handleInput()

// If demo doesn't exists, fetch it from the internet
await handleDemo()

console.log(chalk.cyan.dim(''.padStart(44, '╴')))

// Start watching user-selected file
await startWatch()
