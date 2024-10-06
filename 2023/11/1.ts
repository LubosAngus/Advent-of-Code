import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  input: string[] | string[][]

  constructor(inputFileName) {
    super(inputFileName)
  }

  expendEmptyRows() {
    for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
      const row = this.input[rowIndex] as string

      // if row doesn't contain a # then add one row after that row with the same content
      if (!row.includes("#")) {
        this.input.splice(rowIndex + 1, 0, row)

        // increment rowIndex to skip the row that was just added
        rowIndex++
      }
    }
  }

  // now loop throught columns, if column doesn't contain a # then add one column after that column with the same content
  expandEmptyColumns() {
    for (
      let columnIndex = 0;
      columnIndex < this.input[0].length;
      columnIndex++
    ) {
      let column = ""

      for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
        column += this.input[rowIndex][columnIndex]
      }

      // if column doesn't contain a # then add one column after that column with the same content
      if (!column.includes("#")) {
        for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
          const inputAtRowIndex = this.input[rowIndex] as string

          this.input[rowIndex] =
            inputAtRowIndex.substring(0, columnIndex + 1) +
            inputAtRowIndex[columnIndex] +
            inputAtRowIndex.substring(columnIndex + 1)
        }

        // increment columnIndex to skip the column that was just added
        columnIndex++
      }
    }
  }

  getManhattanDist({ x: X1, y: Y1 }, { x: X2, y: Y2 }) {
    return Math.abs(X2 - X1) + Math.abs(Y2 - Y1)
  }

  // assign number to each #
  assignUniverseNumbersAndGetGalaxies() {
    const galaxies = {}

    let number = 0
    for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < this.input[rowIndex].length;
        columnIndex++
      ) {
        if (this.input[rowIndex][columnIndex] === "#") {
          galaxies[number] = {
            x: rowIndex,
            y: columnIndex,
          }

          number++
        }
      }
    }

    return galaxies
  }

  callback() {
    // console.log(this.input.join("\n"))

    this.expendEmptyRows()
    this.expandEmptyColumns()

    this.input = this.input.map((row) => row.split(""))

    const galaxies = this.assignUniverseNumbersAndGetGalaxies()
    const galaxyPairs = [] as number[][]

    for (let x = 0; x < Object.keys(galaxies).length; x++) {
      for (let y = x; y < Object.keys(galaxies).length; y++) {
        if (x === y) {
          continue
        }

        galaxyPairs.push([x, y])
      }
    }

    let shortestPathsSum = 0
    for (const galaxyPair of galaxyPairs) {
      shortestPathsSum += this.getManhattanDist(
        galaxies[galaxyPair[0]],
        galaxies[galaxyPair[1]],
      )
    }

    return shortestPathsSum
  }
}

new AdventOfCode("input").run()
