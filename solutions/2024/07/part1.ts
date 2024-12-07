import { readFileSync } from 'fs'

// const inputName = 'demo'
const inputName = 'input'

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

function isPossible(testValue: number, numbers: number[]): boolean {
  if (numbers.length === 1) {
    return numbers[0] === testValue
  }

  if (numbers[0] > testValue) {
    return false
  }

  const numbersCopy = [...numbers]
  const [num1, num2] = numbersCopy.splice(0, 2)

  const numbersSum = num1 + num2
  if (isPossible(testValue, [numbersSum, ...numbersCopy])) {
    return true
  }

  const numbersMultiple = num1 * num2
  if (isPossible(testValue, [numbersMultiple, ...numbersCopy])) {
    return true
  }

  return false
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  let result = 0

  for (const { testValue, numbers } of input) {
    if (!isPossible(testValue, numbers)) {
      continue
    }

    result += testValue
  }

  return result
}
