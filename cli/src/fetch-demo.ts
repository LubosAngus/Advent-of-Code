import truncateString from '@advent-utils/truncate-string'
import { checkbox } from '@inquirer/prompts'
import chalk from 'chalk'
import { JSDOM } from 'jsdom'
import { type Ora } from 'ora'
import cleanupBeforeExit from './cleanup-before-exit'
import fetchWithCookie from './fetch-with-cookie'

export default async (loadingSpinner: Ora): Promise<string[]> => {
  const response = await fetchWithCookie(
    `https://adventofcode.com/${global.year}/day/${global.dayInt}`,
  )

  const responseText = await response.text()

  if (response.status !== 200) {
    console.log(chalk.red.bold(response.status))

    throw new Error(responseText)
  }

  const dom = new JSDOM(responseText)
  const document = dom.window.document
  const possibleDemos = [...document.querySelectorAll('pre code')]
    .map((item) => {
      return item.innerHTML.trim()
    })
    .filter((item, index, self) => {
      return self.indexOf(item) === index
    })

  if (possibleDemos.length > 1) {
    loadingSpinner.stop()

    const selectedDemos = await checkbox({
      message: 'Which demos?',
      choices: possibleDemos.map((item) => ({
        value: item,
        name: truncateString(item.split('\n')[0], 24),
        description: '\n' + item,
      })),
      required: true,
      loop: false,
      pageSize: 999,
      theme: {
        helpMode: 'never',
      },
    }).catch(async () => {
      await cleanupBeforeExit()
      process.exit(0)
    })

    return selectedDemos
  }

  return possibleDemos
}
