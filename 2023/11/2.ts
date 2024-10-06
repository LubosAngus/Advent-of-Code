import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

type Galaxy = {
  row: number
  col: number
}

class AdventOfCode extends BaseAdventOfCode {
  input: string[]

  constructor(inputFileName) {
    super(inputFileName)
  }

  getGalaxies() {
    const galaxiesLocations = [] as Galaxy[]

    for (const [rowIndex, row] of Object.entries(this.input)) {
      for (const [colIndex, cell] of Object.entries(row)) {
        if (cell !== "#") continue

        galaxiesLocations.push({
          row: Number(rowIndex),
          col: Number(colIndex),
        })
      }
    }

    return galaxiesLocations
  }

  // Generic utility to find rows or columns that need expansion
  getToExpand(indicesWithGalaxies, totalCount) {
    const toExpand = {}
    const indexMap = new Set(indicesWithGalaxies)

    for (let index = 0; index < totalCount; index++) {
      if (!indexMap.has(index)) {
        toExpand[index] = true
      }
    }

    return toExpand
  }

  getRowsToExpand(galaxies) {
    const rowsWithGalaxies = galaxies.map((g) => g.row)

    return this.getToExpand(rowsWithGalaxies, this.input.length)
  }

  getColsToExpand(galaxies) {
    const colsWithGalaxies = galaxies.map((g) => g.col)

    return this.getToExpand(colsWithGalaxies, this.input[0].length)
  }

  calculateExpansion(expandIndices, galaxyPos, factor) {
    let expansion = 0
    for (const expandPos of expandIndices) {
      if (galaxyPos <= expandPos) break

      if (factor <= 1) {
        expansion += factor
      } else {
        expansion += factor - 1
      }
    }

    return expansion
  }

  expandUniverseByFactor(
    galaxies: ReturnType<AdventOfCode["getGalaxies"]>,
    factor: number,
  ) {
    const rowsToExpand = this.getRowsToExpand(galaxies)
    const colsToExpand = this.getColsToExpand(galaxies)

    return galaxies.map((galaxy) => {
      const rowExpansion = this.calculateExpansion(
        Object.keys(rowsToExpand),
        galaxy.row,
        factor,
      )
      const colExpansion = this.calculateExpansion(
        Object.keys(colsToExpand),
        galaxy.col,
        factor,
      )

      return {
        row: galaxy.row + rowExpansion,
        col: galaxy.col + colExpansion,
      }
    })
  }

  getGalaxyPairs(galaxies: ReturnType<AdventOfCode["getGalaxies"]>) {
    const pairs = [] as number[][]
    const galaxyCount = Object.keys(galaxies).length

    for (let x = 0; x < galaxyCount; x++) {
      for (let y = x; y < galaxyCount; y++) {
        if (x === y) {
          continue
        }

        pairs.push([x, y])
      }
    }

    return pairs
  }

  getShortestPathsSum(
    galaxies: ReturnType<AdventOfCode["getGalaxies"]>,
    galaxyPairs: ReturnType<AdventOfCode["getGalaxyPairs"]>,
  ) {
    // Also can be written like this, but I don't think it's very human readable
    // return galaxyPairs.reduce((sum, [i, j]) => {
    //   return sum + this.getManhattanDistance(galaxies[i], galaxies[j]);
    // }, 0);

    // This is more human readable in my opinion, and achieving the same thing
    let shortestPathsSum = 0

    for (const galaxyPair of galaxyPairs) {
      shortestPathsSum += this.getManhattanDistance(
        galaxies[galaxyPair[0]],
        galaxies[galaxyPair[1]],
      )
    }

    return shortestPathsSum
  }

  getManhattanDistance(galaxy1: Galaxy, galaxy2: Galaxy) {
    const rowDistance = Math.abs(galaxy2.row - galaxy1.row)
    const colDistance = Math.abs(galaxy2.col - galaxy1.col)

    return rowDistance + colDistance
  }

  callback() {
    const galaxies = this.getGalaxies()
    const galaxiesExpanded = this.expandUniverseByFactor(galaxies, 1000000)
    const galaxyPairs = this.getGalaxyPairs(galaxiesExpanded)
    const shortestPathsSum = this.getShortestPathsSum(
      galaxiesExpanded,
      galaxyPairs,
    )

    return shortestPathsSum
  }
}

new AdventOfCode("input").run()
