import { readFileSync } from 'fs'

// const inputName = 'demo_tmp'
// const inputName = 'demo'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = string[][]
type Antenna = string
type coordinates = {
  row: number
  col: number
}
type Antennas = Map<Antenna, coordinates[]>
type Antinode = {
  origin: coordinates[]
  isOutOfBounds: boolean
} & coordinates

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split(''))
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  const antennas: Antennas = new Map()
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const antenna = input[row][col]

      if (antenna === '.') {
        continue
      }

      let antennaCoords: coordinates[] = []
      if (antennas.has(antenna)) {
        antennaCoords = antennas.get(antenna)
      }

      antennaCoords.push({ row, col })

      antennas.set(antenna, antennaCoords)
    }
  }

  const antinodesUniqueLocations: Set<string> = new Set()
  const antinodes: Antinode[] = []
  for (const antenna of antennas.keys()) {
    const coords = antennas.get(antenna)

    for (let i = 0; i < coords.length; i++) {
      const firstAntennaCoords = coords[i]

      for (let j = 0; j < coords.length; j++) {
        // skip if same antenna
        if (i === j) continue

        const secondAntennaCoords = coords[j]

        const rowDistance = secondAntennaCoords.row - firstAntennaCoords.row
        const colDistance = secondAntennaCoords.col - firstAntennaCoords.col

        const antinodeCoords = {
          row: firstAntennaCoords.row - rowDistance,
          col: firstAntennaCoords.col - colDistance,
        }

        const valueOnMap = input[antinodeCoords.row]?.[antinodeCoords.col]
        const isOutOfBounds = valueOnMap === undefined

        if (!isOutOfBounds) {
          antinodesUniqueLocations.add(
            `${antinodeCoords.row};${antinodeCoords.col}`,
          )
        }

        antinodes.push({
          origin: [firstAntennaCoords, secondAntennaCoords],
          ...antinodeCoords,
          isOutOfBounds,
        })
      }
    }
  }

  // 357 - too low
  return antinodesUniqueLocations.size
}
