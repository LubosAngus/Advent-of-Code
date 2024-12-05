import fetchWithCookie from '@advent-cli/src/fetch-with-cookie'
import chalk from 'chalk'
import { JSDOM } from 'jsdom'
import ora from 'ora'
import { hasCache, readCache, writeCache } from './cache'

export default async function (result: string): Promise<boolean> {
  const loadingSpinner = ora(`Submitting answer ${chalk.cyan(result)}`).start()

  const cacheKey = `answers__${global.year}__${global.day}`
  let answers

  if (await hasCache(cacheKey)) {
    answers = await readCache(cacheKey)

    console.log(chalk.dim.italic('[cached]'))
  } else {
    const response = await fetchWithCookie(
      `https://adventofcode.com/${global.year}/day/${global.dayInt}`,
    )

    const responseText = await response.text()

    if (response.status !== 200) {
      loadingSpinner.fail(chalk.red.bold(response.status))

      throw new Error(responseText)
    }

    const dom = new JSDOM(responseText)
    const document = dom.window.document

    answers = [
      ...document.querySelectorAll('main article.day-desc + p code'),
    ].map((answerEl) => {
      return answerEl.innerHTML
    })

    await writeCache(cacheKey, answers)
  }

  const correctAnswer = answers[global.part - 1]

  if (correctAnswer !== result) {
    loadingSpinner.fail(chalk.bgRed.bold(result))
    console.log()

    console.log(chalk.red('That is not correct answer!'))
    console.log(
      chalk.red('Correct answer is ') + chalk.bgGreen.bold(correctAnswer),
    )

    return false
  }

  loadingSpinner.succeed(chalk.bgGreen.bold(result))
  console.log()

  console.log(chalk.green('That is correct answer!'))

  return true
}
