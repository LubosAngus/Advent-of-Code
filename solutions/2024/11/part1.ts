import { readFileSync } from 'fs'

// const inputName = 'demo'
// const inputName = 'demo1'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = number[]

function parseInput(data: string): Input {
  return data.split(' ').map(Number)
}

function blink(input: Input): void {
  for (let index = 0; index < input.length; index++) {
    const item = input[index]
    const itemString = item.toString()

    if (item === 0) {
      input[index] = 1

      continue
    } else if (itemString.length % 2 === 0) {
      const newNumbers = [
        Number(itemString.substring(0, itemString.length / 2)),
        Number(itemString.substring(itemString.length / 2, itemString.length)),
      ]

      input.splice(index, 1, ...newNumbers)

      index++
    } else {
      input[index] = item * 2024
    }
  }
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const blinksCount = 25

  for (let index = 0; index < blinksCount; index++) {
    blink(input)
  }

  return input.length
}
