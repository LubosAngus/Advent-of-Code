import { readFileSync } from 'fs'

// const inputName = 'demo4'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = number[][]
type Coords = {
  row: number
  col: number
}

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split('').map(Number))
}

function getLowestLocations(input: Input): Coords[] {
  const lowestLocations: Coords[] = []

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const value = input[row][col]

      if (value !== 0) {
        continue
      }

      lowestLocations.push({
        row,
        col,
      })
    }
  }

  return lowestLocations
}

function findPaths(location: Coords, input: Input, toFind: number): number {
  if (input?.[location.row]?.[location.col] !== toFind) {
    return 0
  }

  if (toFind === 9) {
    return 1
  }

  const directions: Coords[] = [
    { row: -1, col: +0 },
    { row: +0, col: +1 },
    { row: +1, col: +0 },
    { row: +0, col: -1 },
  ]

  let result = 0

  toFind++

  for (const direction of directions) {
    result += findPaths(
      {
        row: location.row + direction.row,
        col: location.col + direction.col,
      },
      input,
      toFind,
    )
  }

  return result
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const lowestLocations = getLowestLocations(input)

  let result = 0

  for (const lowestLocation of lowestLocations) {
    result += findPaths(lowestLocation, input, 0)
  }

  return result
}
