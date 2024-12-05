import fetchWithCookie from '@advent-cli/src/fetch-with-cookie'
import getAdventOfCodeYears from '@advent-cli/src/get-advent-of-code-years'
import { __ROOT_DIR } from '@advent-cli/src/get-folder-path'
import chalk from 'chalk'
import { promises as fs } from 'fs'
import { JSDOM } from 'jsdom'
import ora from 'ora'
import * as path from 'path'

// TODO: remove any
export default async (): Promise<void> => {
  const starsFilePath = path.join(__ROOT_DIR, 'stars.json')

  try {
    const stars = await fs.readFile(starsFilePath, {
      encoding: 'utf-8',
    })

    global.stars = JSON.parse(stars)

    return
  } catch {
    // nevermind
  }

  const years = getAdventOfCodeYears()
  const loadingSpinner = ora('Fetching stars').start()

  global.stars = {}
  for (const year of years) {
    loadingSpinner.text = `Fetching stars for year ${year}`

    const response = await fetchWithCookie(`https://adventofcode.com/${year}`)

    const responseText = await response.text()

    if (response.status !== 200) {
      loadingSpinner.fail(chalk.red.bold(response.status))

      throw new Error(responseText)
    }

    try {
      let totalStars = 0
      const currentStars = {}
      const dom = new JSDOM(responseText)
      const document = dom.window.document

      for (const dayEl of document.querySelectorAll('pre.calendar > a')) {
        const calendarDay = parseInt(
          dayEl.querySelector('.calendar-day').textContent,
        )

        if (dayEl.classList.contains('calendar-complete')) {
          currentStars[calendarDay] = '*'
          totalStars += 1
        }

        if (dayEl.classList.contains('calendar-verycomplete')) {
          currentStars[calendarDay] = '**'
          totalStars += 2
        }
      }

      global.stars[year] = {
        total: totalStars,
        ...currentStars,
      }
    } catch (error) {
      console.log(chalk.red(error))
    }
  }

  loadingSpinner.stop()

  await fs.writeFile(starsFilePath, JSON.stringify(global.stars, null, 2))
}
