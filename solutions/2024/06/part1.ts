import { readFileSync } from 'fs'
import drawMap from './draw-map'
import { Coordinates, GuardCoordinates, GuardDirection, Input } from './types'

// const inputName = 'demo'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

// FUN part, show animation of guard going around
const SHOW_ANIMATION: boolean = false as boolean

const moveDirectionMap: {
  [key in GuardDirection]: Coordinates
} = {
  '▲': { row: -1, col: +0 },
  '▶': { row: +0, col: +1 },
  '▼': { row: +1, col: +0 },
  '◀': { row: +0, col: -1 },
}

const rotationDirectionMap: {
  [key in GuardDirection]: GuardDirection
} = {
  '▲': '▶',
  '▶': '▼',
  '▼': '◀',
  '◀': '▲',
}

function parseInput(data: string): Input {
  return data
    .replace('^', '▲')
    .replaceAll('.', ' ')
    .replaceAll('#', '█')
    .split('\n')
    .map((row) => row.split(''))
}

function moveGuard(
  input: Input,
  guardCoordinates: GuardCoordinates,
): GuardCoordinates | false {
  const futureCoordinates: Coordinates = {
    row:
      guardCoordinates.row + moveDirectionMap[guardCoordinates.direction].row,
    col:
      guardCoordinates.col + moveDirectionMap[guardCoordinates.direction].col,
  }
  const futurePosition = input[futureCoordinates.row]?.[futureCoordinates.col]

  if (futurePosition === '█') {
    guardCoordinates.direction =
      rotationDirectionMap[guardCoordinates.direction]

    input[guardCoordinates.row][guardCoordinates.col] =
      guardCoordinates.direction
  } else if (futurePosition !== undefined) {
    input[guardCoordinates.row][guardCoordinates.col] = '·'
    input[futureCoordinates.row][futureCoordinates.col] =
      guardCoordinates.direction

    guardCoordinates = {
      ...guardCoordinates,
      ...futureCoordinates,
    }
  } else {
    input[guardCoordinates.row][guardCoordinates.col] = '·'
    return false
  }

  return guardCoordinates
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  let guardCoordinates: GuardCoordinates | false = false

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input.length; col++) {
      if (input[row][col] !== '▲') continue

      guardCoordinates = {
        row,
        col,
        direction: '▲',
      }

      break
    }
  }

  do {
    if (guardCoordinates === false) {
      break
    }

    const nextGuardCoordinates = moveGuard(input, guardCoordinates)

    if (SHOW_ANIMATION === true) {
      await drawMap(input, guardCoordinates, nextGuardCoordinates === false)
    }

    guardCoordinates = nextGuardCoordinates
  } while (guardCoordinates !== false)

  return input.reduce((acc, row) => {
    return acc + row.filter((cell) => cell === '·').length
  }, 0)
}
