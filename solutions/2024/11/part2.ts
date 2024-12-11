/**
 * This one, I couldn't figure out by myself.
 * So I went online to look for clues. It's so obvious now!
 *
 * Instead of blinking the whole input, just blink specific numbers.
 */

import { readFileSync } from 'fs'

// const inputName = 'demo'
// const inputName = 'demo1'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = number[]
type Memo = Map<string, number>

function parseInput(data: string): Input {
  return data.split(' ').map(Number)
}

function blink(number: number, blinksCount: number, memo: Memo): number {
  const memoKey = `${number};${blinksCount}`

  if (memo.has(memoKey)) {
    return memo.get(memoKey)
  }

  if (blinksCount === 0) {
    return 1
  }

  const item = number
  const itemString = item.toString()

  let result = 0
  if (item === 0) {
    result = blink(1, blinksCount - 1, memo)
  } else if (itemString.length % 2 === 0) {
    const newNumbers = [
      Number(itemString.substring(0, itemString.length / 2)),
      Number(itemString.substring(itemString.length / 2, itemString.length)),
    ]

    for (const newNumber of newNumbers) {
      result += blink(newNumber, blinksCount - 1, memo)
    }
  } else {
    result = blink(number * 2024, blinksCount - 1, memo)
  }

  memo.set(memoKey, result)

  return result
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const blinksCount = 75
  const memo: Memo = new Map()

  let result = 0
  for (let index = 0; index < input.length; index++) {
    result += blink(input[index], blinksCount, memo)
  }

  return result
}
