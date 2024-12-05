import fetchDemo from '@advent-cli/src/fetch-demo'
import getFolderPath from '@advent-cli/src/get-folder-path'
import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import { readFile, writeFile } from 'fs/promises'
import ora from 'ora'
import * as path from 'path'
import { hasCache, readCache, writeCache } from './cache'

/**
 * We need to serve demo every time, because examples can
 */
export default async (): Promise<void> => {
  const loadingSpinner = ora(`Getting demo input`).start()
  const folderPath = getFolderPath()

  const cacheKey = `demo__${global.year}__${global.day}__${
    global.hasStarCurrentDay ? 'has-star' : 'no-star'
  }`

  let cacheHit = false
  let demos

  if (await hasCache(cacheKey)) {
    cacheHit = true
    demos = await readCache(cacheKey)
  } else {
    demos = await fetchDemo(loadingSpinner)
  }

  for (let index = 0; index < demos.length; index++) {
    const fileName = `demo${index > 0 ? index : ''}`
    const newDemoFilePath = path.join(folderPath, `${fileName}.txt`)
    const newDemoContents = demos[index]

    try {
      const oldDemoContents = await readFile(newDemoFilePath, 'utf-8')

      if (newDemoContents !== oldDemoContents) {
        loadingSpinner.stop()

        let shouldOverwrite = await confirm({
          message: chalk.blue(`${fileName}.txt already exists, rewrite it?`),
        }).catch(() => {
          shouldOverwrite = false
        })

        if (!shouldOverwrite) {
          continue
        }
      }
    } catch {
      // nevermind
    }

    await writeFile(newDemoFilePath, newDemoContents)
  }

  if (demos.length === 0) {
    loadingSpinner.warn(chalk.yellow('No demo found'))
  } else {
    if (cacheHit) {
      loadingSpinner.info(`${demos.length} demos served from cache`)
    } else {
      loadingSpinner.succeed(`${demos.length} demos successfully added`)
      await writeCache(cacheKey, demos)
    }
  }
}
