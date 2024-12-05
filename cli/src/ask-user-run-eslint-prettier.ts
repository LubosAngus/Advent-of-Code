import cleanupBeforeExit from '@advent-cli/src/cleanup-before-exit'
import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import { exec } from 'child_process'
import ora from 'ora'

export default async (): Promise<void> => {
  const runEslintAndPrettier = await confirm({
    message: 'Run ESLint and Prettier?',
    default: false,
  }).catch(async (error) => {
    console.log()
    console.log(chalk.blue.italic(error.message))

    await cleanupBeforeExit()
    process.exit(0)
  })

  if (!runEslintAndPrettier) {
    return
  }

  const loadingSpinner = ora(`Running ESLint and Prettier fix`).start()

  return new Promise<void>((resolve) => {
    exec(
      `npm run lint:fix && npm run format:fix`,
      async (error, stdout, stderr) => {
        loadingSpinner.stop()

        // if (stdout) {
        //   console.log(stdout)
        // }

        if (error) {
          console.error(chalk.bgRed.bold.white(' ERROR '))
          console.error(error.message || error)
        }

        if (stderr) {
          console.error(chalk.bgRed.bold.white(' STDERR '))
          console.error(stderr.toString())
        }

        resolve()
      },
    )
  })
}
