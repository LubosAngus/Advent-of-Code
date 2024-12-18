import chalk from 'chalk'
import { readFileSync } from 'fs'

// const inputName = 'demo'
// const inputName = 'demo1'
// const inputName = 'demo2'
// const inputName = 'demo3'
// const inputName = 'demo4'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Coords = {
  row: number
  col: number
}
type Direction = 'horizontal' | 'vertical'
type Input = string[][]
type RegionKey = string
type RegionLocations = Set<string>
type KnownSides = Map<string, string[]>

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split(''))
}

function getRegionKey({ row, col }: Coords): RegionKey {
  return `${row};${col}`
}

function buildSide(
  type: string,
  coords: Coords,
  input: Input,
  knownSides: KnownSides,
  lastItemCoords?: Coords,
  direction?: Direction,
) {
  const sides = []
  const items = []

  const modifiers = [1, -1]
  for (const modifier of modifiers) {
    const itemCoords = { ...lastItemCoords }
    const sideCoords = { ...coords }

    do {
      if (
        input?.[itemCoords.row]?.[itemCoords.col] !== type ||
        input?.[sideCoords.row]?.[sideCoords.col] === type
      ) {
        break
      }

      items.push({ ...itemCoords })
      sides.push({ ...sideCoords })

      if (direction === undefined) {
        throw 'How this happened?'
      }

      if (direction === 'horizontal') {
        sideCoords.col = sideCoords.col + modifier
        itemCoords.col = itemCoords.col + modifier
      }

      if (direction === 'vertical') {
        sideCoords.row = sideCoords.row + modifier
        itemCoords.row = itemCoords.row + modifier
      }

      const itemKey = getRegionKey(itemCoords)
      const sideKey = getRegionKey(sideCoords)

      if (!knownSides?.get(sideKey)?.includes(itemKey)) {
        knownSides.set(sideKey, [...(knownSides.get(sideKey) || []), itemKey])
      }

      // eslint-disable-next-line no-constant-condition
    } while (true)
  }

  // logWithHighlight(input, [...items, ...sides])
}

function buildRegionData(
  type: string,
  coords: Coords,
  input: Input,
  regionLocations: RegionLocations,
  knownSides: KnownSides,
  lastItemCoords?: Coords,
  direction?: Direction,
) {
  const regionKey = getRegionKey(coords)

  if (regionLocations.has(regionKey)) {
    return 0
  }

  const { row, col } = coords

  if (type !== input?.[row]?.[col]) {
    const lastItemKey = getRegionKey(lastItemCoords)

    if (knownSides?.get(regionKey)?.includes(lastItemKey)) {
      return 0
    }

    buildSide(type, coords, input, knownSides, lastItemCoords, direction)

    return 1
  }

  regionLocations.add(regionKey)

  let result = 0

  const searchCoordsArray: (Coords & { direction: Direction })[] = [
    { row: -1, col: +0, direction: 'horizontal' },
    { row: +1, col: +0, direction: 'horizontal' },
    { row: +0, col: -1, direction: 'vertical' },
    { row: +0, col: +1, direction: 'vertical' },
  ]

  for (const searchCoords of searchCoordsArray) {
    result += buildRegionData(
      type,
      {
        row: row + searchCoords.row,
        col: col + searchCoords.col,
      },
      input,
      regionLocations,
      knownSides,
      {
        row: row,
        col: col,
      },
      searchCoords.direction,
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
      const knownSides: KnownSides = new Map()

      const regionSides = buildRegionData(
        type,
        { row, col },
        input,
        regionLocations,
        knownSides,
      )

      const region = {
        regionId,
        type,
        locations: regionLocations,
        knownSides,
        sides: regionSides,
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

function logWithHighlight(input: Input, highlight: Coords[]) {
  let toLog = ''

  for (let row = -1; row <= input.length; row++) {
    for (let col = -1; col <= input[0].length; col++) {
      const value = input?.[row]?.[col] ?? ' '

      if (highlight.find((item) => item.col === col && item.row === row)) {
        toLog += chalk.bgBlue(value)
      } else {
        toLog += value
      }
    }

    toLog += '\n'
  }

  console.log(toLog)
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const regions = defineRegions(input)

  // console.log(regions)

  let result = 0
  for (const region of regions.values()) {
    result += region.locations.size * region.sides
  }

  return result
}
