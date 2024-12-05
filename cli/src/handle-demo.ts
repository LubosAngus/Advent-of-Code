import fetchDemo from '@advent-cli/src/fetch-demo'
import getFolderPath from '@advent-cli/src/get-folder-path'
import chalk from 'chalk'
import { writeFile } from 'fs/promises'
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
  let demo

  if (await hasCache(cacheKey)) {
    cacheHit = true
    demo = await readCache(cacheKey)
  } else {
    demo = await fetchDemo()
  }

  for (let index = 0; index < demo.length; index++) {
    const demoItem = demo[index]
    const fileName = `demo${index > 0 ? index : ''}`
    const newDemoFilePath = path.join(folderPath, `${fileName}.txt`)

    await writeFile(newDemoFilePath, demoItem)
  }

  if (demo.length === 0) {
    loadingSpinner.warn(chalk.yellow('No demo found'))
  } else {
    if (cacheHit) {
      loadingSpinner.info(`${demo.length} demos served from cache`)
    } else {
      loadingSpinner.succeed(`${demo.length} demos successfully fetched`)
      await writeCache(cacheKey, demo)
    }
  }
}
