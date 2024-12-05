import getFolderPath from '@advent-cli/src/get-folder-path'
import chalk from 'chalk'
import { promises as fs, readFileSync } from 'fs'
import ora from 'ora'
import * as path from 'path'

export default async (): Promise<void> => {
  const loadingSpinner = ora(`Checking if part2.ts exists`).start()

  if (global.part === 1) {
    loadingSpinner.info(chalk.dim.italic('part2.ts [skipped]'))
    return
  }

  const folderPath = getFolderPath()
  const filePath = path.join(folderPath, 'part2.ts')

  // Check if part2.ts exists, duplicate part1.ts if it doesn't
  try {
    await fs.access(filePath)
    loadingSpinner.info('part2.ts already exists')
  } catch {
    const partOnePath = path.join(folderPath, 'part1.ts')
    const partOneContent = await readFileSync(partOnePath, 'utf-8')

    await fs.writeFile(filePath, partOneContent)
    loadingSpinner.succeed('part2.ts successfully created from part1.ts')
  }
}
