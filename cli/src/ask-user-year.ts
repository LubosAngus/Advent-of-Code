import cleanupBeforeExit from '@advent-cli/src/cleanup-before-exit'
import getAdventOfCodeYears from '@advent-cli/src/get-advent-of-code-years'
import { select } from '@inquirer/prompts'
import chalk from 'chalk'

export default async (): Promise<void> => {
  const years = getAdventOfCodeYears().map((year) => {
    const value = year

    let name = value.toString()

    if (global.stars[year]?.total !== undefined) {
      name += ` ${chalk.yellow(
        `${global.stars[year].total.toString().padStart(2, ' ')}*`,
      )}`
    }

    return {
      name,
      value,
    }
  })

  const selectedYear = await select({
    message: 'Year?',
    choices: years,
    loop: false,
    pageSize: 25,
    theme: {
      helpMode: 'never',
    },
  }).catch(async (error) => {
    console.log()
    console.log(chalk.blue.italic(error.message))

    await cleanupBeforeExit()
    process.exit(0)
  })

  global.yearInt = selectedYear
  global.year = selectedYear.toString()
}
