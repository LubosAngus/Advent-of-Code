import askUserPushChanges from '@advent-cli/src/ask-user-push-changes'
import cleanupBeforeExit from '@advent-cli/src/cleanup-before-exit'
import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import { exec } from 'child_process'
import ora from 'ora'
import askUserRunEslintPrettier from './ask-user-run-eslint-prettier'

export default async (): Promise<void> => {
  console.log()

  let shouldCommit = await confirm({
    message: 'Commit changes?',
    default: true,
  }).catch(async (error) => {
    console.log()
    console.log(chalk.blue.italic(error.message))

    shouldCommit = false
  })

  if (!shouldCommit) {
    await cleanupBeforeExit()

    process.exit(0)
  }

  await askUserRunEslintPrettier()

  const commitMessage = `${global.year}/${global.day} - Part ${global.part}`
  const loadingSpinner = ora(
    `Commiting with message "${commitMessage}"`,
  ).start()

  return new Promise<void>((resolve) => {
    exec(
      `git add solutions/${global.year}/${global.day} && git commit -m "${commitMessage}"`,
      async (error, stdout, stderr) => {
        loadingSpinner.stop()

        if (stdout) {
          console.log(stdout)
        }

        if (error) {
          console.error(chalk.bgRed.bold.white(' ERROR '))
          console.error(error.message || error)
        }

        if (stderr) {
          console.error(chalk.bgRed.bold.white(' STDERR '))
          console.error(stderr.toString())
        }

        await askUserPushChanges()

        resolve()
      },
    )
  })
}
