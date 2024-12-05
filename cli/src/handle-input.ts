import fetchInput from '@advent-cli/src/fetch-input'
import getFolderPath from '@advent-cli/src/get-folder-path'
import { readFile, writeFile } from 'fs/promises'
import ora from 'ora'
import * as path from 'path'

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

  loadingSpinner.text = 'fetching input.txt from remote'

  const input = await fetchInput()

  await writeFile(inputFilePath, input)

  loadingSpinner.succeed('input.txt successfully fetched')
}
