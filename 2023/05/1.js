import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  getSeeds() {
    return this.input
      .shift()
      .split(" ")
      .map(Number)
      .filter((v) => !isNaN(v))
  }

  getMaps() {
    const maps = []
    let lineIndex = -1
    let valueIndex = 0

    for (const line of this.input) {
      if (isNaN(Number(line[0]))) {
        lineIndex++
        valueIndex = 0
        continue
      }

      if (maps[lineIndex] === undefined) {
        maps[lineIndex] = {
          destinations: [],
          sources: [],
          ranges: [],
        }
      }

      const [destination, source, range] = line.split(" ")

      maps[lineIndex]["destinations"][valueIndex] = Number(destination)
      maps[lineIndex]["sources"][valueIndex] = Number(source)
      maps[lineIndex]["ranges"][valueIndex] = Number(range)

      valueIndex++
    }

    return maps
  }

  getValues(num) {
    const result = []

    result.push(num)

    let currentNumber = num
    for (const map of this.maps) {
      const nextNumber = this.getNextNumberFromMap(currentNumber, map)

      result.push(nextNumber)
      currentNumber = nextNumber
    }

    return result
  }

  getNextNumberFromMap(value, map) {
    let closestSource = null
    let closestSourceIndex = null

    for (let index = 0; index < map.sources.length; index++) {
      const source = map.sources[index]

      if (source > value) {
        continue
      }

      if (closestSource === null || source > closestSource) {
        closestSource = source
        closestSourceIndex = index
      }
    }

    if (closestSource === null) return value
    if (map.ranges[closestSourceIndex] < value - closestSource) return value

    return value - closestSource + map.destinations[closestSourceIndex]
  }

  callback() {
    this.seeds = this.getSeeds()
    this.maps = this.getMaps()

    const values = []

    for (const seed of this.seeds) {
      values.push(this.getValues(seed))
    }

    const locations = []

    for (const value of values) {
      locations.push(value[value.length - 1])
    }

    locations.sort((a, b) => a - b)

    return locations[0]
  }
}

new AdventOfCode("input").run()
