import { readFileSync } from 'fs'

type Input = string[][]

// const inputName = 'demo1'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split(''))
}

function findXMas({
  input,
  x,
  y,
}: {
  input: Input
  x: number
  y: number
}): number {
  if (input[x][y] !== 'A') {
    return 0
  }

  const cornerValues = [
    input[x - 1][y - 1],
    input[x - 1][y + 1],
    input[x + 1][y - 1],
    input[x + 1][y + 1],
  ].join('')

  const validCornerValues = ['MSMS', 'MMSS', 'SSMM', 'SMSM']

  return validCornerValues.includes(cornerValues) ? 1 : 0
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  let result = 0
  for (let x = 1; x < input.length - 1; x++) {
    for (let y = 1; y < input[x].length - 1; y++) {
      result += findXMas({
        input,
        x,
        y,
      })
    }
  }

  return result
}
