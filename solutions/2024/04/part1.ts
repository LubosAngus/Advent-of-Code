import { readFileSync } from 'fs'

type Input = string[][]

// const inputName = 'demo1'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split(''))
}

function findStringInAllDirections({
  input,
  x,
  y,
  stringToFind,
  desiredDirection = null,
}: {
  input: Input
  x: number
  y: number
  stringToFind: string
  desiredDirection?: string
}) {
  if (input[x][y] !== stringToFind[0]) {
    return 0
  }

  if (stringToFind.length === 1) {
    return 1
  }

  let result = 0
  for (let x2 = -1; x2 <= 1; x2++) {
    for (let y2 = -1; y2 <= 1; y2++) {
      const direction = `${x2};${y2}`

      if (desiredDirection !== null && desiredDirection !== direction) continue
      if (x2 === 0 && y2 === 0) continue
      if (input?.[x + x2]?.[y + y2] === undefined) continue

      result += findStringInAllDirections({
        input,
        x: x + x2,
        y: y + y2,
        stringToFind: stringToFind.substring(1),
        desiredDirection: direction,
      })
    }
  }

  return result
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const stringToFind = 'XMAS'

  let result = 0
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      result += findStringInAllDirections({
        input,
        x,
        y,
        stringToFind,
      })
    }
  }

  return result
}
