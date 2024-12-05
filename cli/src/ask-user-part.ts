import cleanupBeforeExit from '@advent-cli/src/cleanup-before-exit'
import { select } from '@inquirer/prompts'
import chalk from 'chalk'

export default async (): Promise<void> => {
  let part = 1

  const stars = global.stars?.[global.year]?.[global.dayInt]
  if (stars) {
    part = await select({
      message: 'Which part?',
      choices: [
        {
          value: 2,
          name: `Part 2 ${stars === '**' ? chalk.yellow('*') : ''}`,
        },
        {
          value: 1,
          name: `Part 1 ${chalk.yellow('*')}`,
        },
      ],
      loop: false,
      default: 2,
    }).catch(async (error) => {
      console.log()
      console.log(chalk.blue.italic(error.message))

      await cleanupBeforeExit()
      process.exit(0)
    })
  } else {
    console.log(
      chalk.blue('ℹ') + chalk.bold(' No stars, so going with part1.ts'),
    )
  }

  const file = `part${part}.ts`

  global.part = part
  global.file = file

  global.hasStarCurrentDay = !!stars
  global.hasStarCurrentPart =
    (stars && part === 1) || (stars === '**' && part === 2)
}
