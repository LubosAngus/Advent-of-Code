import cleanupBeforeExit from '@advent-cli/src/cleanup-before-exit'
import isDayDisabled from '@advent-cli/src/is-day-disabled'
import { select } from '@inquirer/prompts'
import chalk from 'chalk'

export default async (): Promise<void> => {
  const days = [] as {
    value: number
    name: string
    disabled: string | false
  }[]

  let defaultValue = null
  for (let day = 1; day <= 25; day++) {
    const value = day
    const stars = global.stars?.[global.year]?.[day]

    let name = value.toString().padStart(2, '0')

    if (stars) {
      name += ` ${chalk.yellow(stars)}`
    }

    if (defaultValue === null && (!stars || stars === '*')) {
      defaultValue = value
    }

    days.unshift({
      value,
      name,
      disabled: isDayDisabled(global.year, day)
        ? chalk.italic('not yet')
        : false,
    })
  }

  const selectedDay = await select({
    message: 'Day?',
    choices: days,
    loop: false,
    pageSize: 25,
    default: defaultValue,
  }).catch(async (error) => {
    console.log()
    console.log(chalk.blue.italic(error.message))

    await cleanupBeforeExit()
    process.exit(0)
  })

  global.dayInt = selectedDay
  global.day = selectedDay.toString().padStart(2, '0')
}
