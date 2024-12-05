import fetchInput from '@advent-cli/src/fetch-input'
import getFolderPath from '@advent-cli/src/get-folder-path'
import { readFile, writeFile } from 'fs/promises'
import ora from 'ora'
import * as path from 'path'
import { hasCache, readCache, writeCache } from './cache'

export default async (): Promise<void> => {
  const loadingSpinner = ora(`Getting input`).start()
  const folderPath = getFolderPath()
  const inputFilePath = path.join(folderPath, 'input.txt')
  let inputExists = true

  try {
    const inputContents = await readFile(inputFilePath, 'utf-8')
    inputExists = !!inputContents
  } catch {
    inputExists = false
  }

  if (inputExists) {
    loadingSpinner.info('input.txt already exists')
    return
  }

  const cacheKey = `input__${global.year}__${global.day}`
  if (await hasCache(cacheKey)) {
    const input = (await readCache(cacheKey)) as string

    await writeFile(inputFilePath, input)

    loadingSpinner.info('input.txt served from cache')

    return
  }

  loadingSpinner.text = 'fetching input.txt from remote'

  const input = await fetchInput()

  await writeFile(inputFilePath, input)
  await writeCache(cacheKey, input)

  loadingSpinner.succeed('input.txt successfully fetched')
}
