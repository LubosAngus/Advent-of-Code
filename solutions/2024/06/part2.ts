/**
 * Quite slow, need to optimize search
 * by indexing obstructions and maybe that way?
 */

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
  '^': { row: -1, col: +0 },
  '>': { row: +0, col: +1 },
  'v': { row: +1, col: +0 },
  '<': { row: +0, col: -1 },
}

const rotationDirectionMap: {
  [key in GuardDirection]: GuardDirection
} = {
  '^': '>',
  '>': 'v',
  'v': '<',
  '<': '^',
}

const drawPathSymbolsMap = {
  junction: '┼',
  corner: {
    '^': '┌',
    '>': '┐',
    'v': '┘',
    '<': '└',
  },
  straight: {
    '^': '│',
    '>': '─',
    'v': '│',
    '<': '─',
  },
}

function parseInput(data: string): Input {
  return data
    .replaceAll('.', ' ')
    .replaceAll('#', '█')
    .split('\n')
    .map((row) => row.split(''))
}

function moveGuard(
  input: Input,
  guardCoordinates: GuardCoordinates,
): [GuardCoordinates, boolean] {
  const { row: guardRow, col: guardCol, direction: guardDir } = guardCoordinates

  const futureCoordinates: Coordinates = {
    row: guardRow + moveDirectionMap[guardDir].row,
    col: guardCol + moveDirectionMap[guardDir].col,
  }
  const { row: futurRow, col: futurCol } = futureCoordinates

  const futurPos = input[futurRow]?.[futurCol]

  if (['█', 'O'].includes(futurPos)) {
    guardCoordinates.direction = rotationDirectionMap[guardDir]

    input[guardRow][guardCol] = drawPathSymbolsMap.corner[guardDir]
  } else if (futurPos !== undefined) {
    guardCoordinates.row = futureCoordinates.row
    guardCoordinates.col = futureCoordinates.col

    if (futurPos === ' ') {
      input[futurRow][futurCol] = drawPathSymbolsMap.straight[guardDir]
    } else {
      if (futurPos !== drawPathSymbolsMap.straight[guardDir]) {
        input[futurRow][futurCol] = drawPathSymbolsMap.junction
      }
    }
  } else {
    input[guardRow][guardCol] = drawPathSymbolsMap.straight[guardDir]

    return [guardCoordinates, true]
  }

  return [guardCoordinates, false]
}

async function run(input): Promise<[boolean, boolean, Set<string>]> {
  let guardCoordinates: GuardCoordinates

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input.length; col++) {
      if (input[row][col] !== '^') continue

      guardCoordinates = {
        row,
        col,
        direction: '^',
      }

      break
    }
  }

  const locationHistory: Set<string> = new Set()

  do {
    const [nextGuardCoordinates, isFinished] = moveGuard(
      input,
      guardCoordinates,
    )

    const historyKey = Object.values(guardCoordinates).join(';')
    const isStuck = !isFinished && locationHistory.has(historyKey)

    guardCoordinates = nextGuardCoordinates

    const breakLoop = isFinished || isStuck

    if (SHOW_ANIMATION === true) {
      await drawMap(input, guardCoordinates, breakLoop)
    }

    if (isStuck) {
      return [isFinished, isStuck, locationHistory]
    }

    if (breakLoop) {
      break
    }

    locationHistory.add(historyKey)
  } while (guardCoordinates)

  return [true, false, locationHistory]
}

async function getPossibleObstructionPositions(
  input: Input,
): Promise<Set<string>> {
  const clonedInput = JSON.parse(JSON.stringify(input))

  const [, , locationHistory] = await run(clonedInput)

  const uniqueLocations: Set<string> = new Set()

  for (const historyItem of locationHistory) {
    uniqueLocations.add(historyItem.split(';').splice(0, 2).join(';'))
  }

  return uniqueLocations
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  const obstructionPositions = await getPossibleObstructionPositions(input)
  const obstructionPositionsValues = [...obstructionPositions.values()]
  const stuckInputs = []
  for (let index = 0; index < obstructionPositionsValues.length; index++) {
    const [row, col] = obstructionPositionsValues[index].split(';')

    console.log(`${index + 1}/${obstructionPositionsValues.length}`)

    const item = input[row][col]

    if (item === '█' || item === '^') {
      continue
    }

    const clonedInput = JSON.parse(JSON.stringify(input))

    clonedInput[row][col] = 'O'

    const [, isStuck] = await run(clonedInput)

    if (isStuck) {
      stuckInputs.push(clonedInput)
    }
  }

  // for (const stuckInput of stuckInputs) {
  //   console.log(stuckInput.map((row) => row.join('')).join('\n'))
  //   console.log('-------------')
  // }

  return stuckInputs.length
}
