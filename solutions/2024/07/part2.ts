/**
 * Not my original solution!
 * My original solution was a bit slow, took 3.5 seconds to execute.
 *
 * I went online to look for speed optimizations techniques in others
 * solutions and I found, that going backwards is way quicker.
 *
 * Now this code executes in ~30ms.
 */

import chalk from 'chalk'
import { readFileSync } from 'fs'

// const inputName = 'demo_tmp'
// const inputName = 'demo'
const inputName = 'input'

const DEBUG_LOG = false as boolean

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = {
  testValue: number
  numbers: number[]
}[]

function parseInput(data: string): Input {
  return data.split('\n').map((row) => {
    const [testValue, numbers] = row.split(': ')

    return {
      testValue: Number(testValue),
      numbers: numbers.split(' ').map(Number),
    }
  })
}

function debugLog(testValue: number, numbers: number[]): void {
  if (!DEBUG_LOG) return

  let toLog = chalk.blue(testValue)

  for (let i = testValue.toString().length; i < 15; i++) {
    toLog += chalk.dim.gray('.')
  }

  toLog += chalk.yellow(`[${numbers.join(',')}]`)

  console.log(toLog)
}

function isPossible(testValue: number, numbers: number[]): boolean {
  debugLog(testValue, numbers)

  if (numbers.length === 0 || testValue <= 0) {
    return numbers.length === 0 && testValue === 0
  }

  // Addition
  if (isPossible(testValue - numbers[0], numbers.slice(1))) {
    return true
  }

  // Multiplication
  if (
    testValue % numbers[0] === 0 &&
    isPossible(testValue / numbers[0], numbers.slice(1))
  ) {
    return true
  }

  // Concatenation
  if (testValue.toString().endsWith(numbers[0].toString())) {
    const regex = new RegExp(`${numbers[0]}$`)
    const newTestValue = Number(testValue.toString().replace(regex, ''))

    if (isPossible(newTestValue, numbers.slice(1))) {
      return true
    }
  }

  return false
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  let result = 0

  for (const { testValue, numbers } of input) {
    const isRowPossible = isPossible(testValue, numbers.reverse())

    if (DEBUG_LOG) {
      console.log(
        isRowPossible ? chalk.green('possible') : chalk.red('not possible'),
      )
      console.log(' ')
    }

    if (!isRowPossible) {
      continue
    }

    result += testValue
  }

  return result
}
