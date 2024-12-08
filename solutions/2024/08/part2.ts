import chalk from 'chalk'
import { readFileSync } from 'fs'

// const inputName = 'demo_tmp'
// const inputName = 'demo'
const inputName = 'input'

const DEBUG_LOG = false as boolean

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = string[][]
type Antenna = string
type Coordinates = {
  row: number
  col: number
}
type Antennas = Map<Antenna, Coordinates[]>
type Antinodes = Set<string>

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split(''))
}

function debugLog(input: Input, antinodes: Antinodes): void {
  if (!DEBUG_LOG) return

  for (const antinode of antinodes.values()) {
    const [row, col] = antinode.split(';')

    let value = input[row][col]

    if (value === '.') {
      value = '#'
    }

    input[row][col] = chalk.bgCyan(value)
  }

  console.log(input.map((i) => i.join('')).join('\n'))
}

function getAntennas(input: Input): Antennas {
  const antennas: Antennas = new Map()
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const antenna = input[row][col]

      if (antenna === '.') {
        continue
      }

      const antennaCoords: Coordinates[] = antennas.get(antenna) ?? []
      antennaCoords.push({ row, col })
      antennas.set(antenna, antennaCoords)
    }
  }

  return antennas
}

function getUniqueAntinodes(input: Input, antennas: Antennas): Antinodes {
  const antinodes: Antinodes = new Set()

  for (const antenna of antennas.keys()) {
    const coords = antennas.get(antenna)

    if (coords.length < 2) {
      continue
    }

    for (let i = 0; i < coords.length; i++) {
      for (let j = 0; j < coords.length; j++) {
        if (i === j) continue

        const antinodePositions = calculateAntinodePositions(
          input,
          coords[i],
          coords[j],
        )

        for (const antinodePosition of antinodePositions) {
          antinodes.add(antinodePosition)
        }
      }
    }
  }

  return antinodes
}

function isOutOfBounds(input: Input, coords: Coordinates) {
  const valueOnMap = input[coords.row]?.[coords.col]

  return valueOnMap === undefined
}

function calculateAntinodePositions(
  input: Input,
  antenna1: Coordinates,
  antenna2: Coordinates,
): Antinodes {
  const uniquePositions: Antinodes = new Set()

  const distance = {
    row: antenna1.row - antenna2.row,
    col: antenna1.col - antenna2.col,
  }

  const currentPosition = {
    ...antenna1,
  }

  do {
    const uniquePosition = `${currentPosition.row};${currentPosition.col}`
    uniquePositions.add(uniquePosition)

    currentPosition.row += distance.row
    currentPosition.col += distance.col
  } while (!isOutOfBounds(input, currentPosition))

  return uniquePositions
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  const antennas = getAntennas(input)
  const antinodes = getUniqueAntinodes(input, antennas)

  debugLog(input, antinodes)

  // 357 - too low
  return antinodes.size
}
