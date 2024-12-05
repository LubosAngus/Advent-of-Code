import truncateString from '@advent-utils/truncate-string'
import { checkbox } from '@inquirer/prompts'
import chalk from 'chalk'
import { readdir, readFile } from 'fs/promises'
import { JSDOM } from 'jsdom'
import { type Ora } from 'ora'
import path from 'path'
import cleanupBeforeExit from './cleanup-before-exit'
import fetchWithCookie from './fetch-with-cookie'
import getFolderPath from './get-folder-path'

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
  const possibleDemos = new Set(
    [...document.querySelectorAll('pre code')].map((item) => {
      return item.textContent.trim()
    }),
  )

  if (possibleDemos.size > 1) {
    const existingDemos = new Map<string, string>()

    try {
      const folderPath = getFolderPath()
      const files = await readdir(folderPath)
      const demoFilesNames = files.filter((file) => {
        return file.match(/demo(?:\d+)?\.txt/)
      })

      const filesPromises = demoFilesNames.map((file) =>
        readFile(path.join(folderPath, file), 'utf-8'),
      )

      const demoFiles = await Promise.all(filesPromises)

      for (let i = 0; i < demoFiles.length; i++) {
        const demoFile = demoFiles[i].trim()

        if (!possibleDemos.has(demoFile)) {
          continue
        }

        existingDemos.set(demoFile, demoFilesNames[i])
      }
    } catch {
      // nevermind
    }

    loadingSpinner.stop()

    const selectedDemos = await checkbox({
      message: 'Which demos?',
      choices: [...possibleDemos.values()].map((item) => ({
        value: item,
        name: truncateString(item.split('\n')[0], 14).padEnd(15, ' '),
        description: '\n' + item,
        checked: existingDemos.has(item),
        disabled: existingDemos.has(item)
          ? chalk.italic(existingDemos.get(item))
          : false,
      })),
      required: existingDemos.size === 0,
      loop: false,
      pageSize: 999,
      theme: {
        helpMode: 'never',
      },
    }).catch(async () => {
      await cleanupBeforeExit()
      process.exit(0)
    })

    return [...existingDemos.keys(), ...selectedDemos]
  }

  return [...possibleDemos.values()]
}
