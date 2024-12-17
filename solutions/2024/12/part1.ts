import { readFileSync } from 'fs'

// const inputName = 'demo'
// const inputName = 'demo1'
// const inputName = 'demo2'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Coords = {
  row: number
  col: number
}
type Input = string[][]
type RegionKey = string
type RegionLocations = Set<string>

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split(''))
}

function getRegionKey({ row, col }: Coords): RegionKey {
  return `${row};${col}`
}

function findRegionLocations(
  type: string,
  coords: Coords,
  input: Input,
  regionLocations: RegionLocations,
) {
  const regionKey = getRegionKey(coords)

  if (regionLocations.has(regionKey)) {
    return 0
  }

  const { row, col } = coords

  if (type !== input?.[row]?.[col]) {
    return 1
  }

  regionLocations.add(regionKey)

  let result = 0

  for (const searchCoords of [
    { row: -1, col: +0 },
    { row: +0, col: -1 },
    { row: +1, col: +0 },
    { row: +0, col: +1 },
  ]) {
    result += findRegionLocations(
      type,
      {
        row: row + searchCoords.row,
        col: col + searchCoords.col,
      },
      input,
      regionLocations,
    )
  }

  return result
}

function defineRegions(input: Input) {
  const regions = new Map()
  const visitedLocations = new Map()

  let regionId = 0
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const regionKey = getRegionKey({ row, col })

      if (visitedLocations.has(regionKey)) {
        continue
      }

      const type = input[row][col]
      const regionLocations: RegionLocations = new Set()

      const regionPerimeter = findRegionLocations(
        type,
        { row, col },
        input,
        regionLocations,
      )

      const region = {
        regionId,
        type,
        locations: regionLocations,
        perimeter: regionPerimeter,
      }

      for (const regionLocation of regionLocations) {
        visitedLocations.set(regionLocation, regionId)
      }

      regions.set(regionId, region)

      regionId++
    }
  }

  return regions
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const regions = defineRegions(input)

  let result = 0
  for (const region of regions.values()) {
    result += region.locations.size * region.perimeter
  }

  return result
}
