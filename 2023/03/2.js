import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  isNumber(x, y) {
    return /\d/.test(this.input[x][y])
  }

  getWholeNumber(x, y) {
    const numbersRaw = []
    let y2

    numbersRaw.push({
      number: this.input[x][y],
      x,
      y,
    })

    y2 = y + 1
    while (this.isNumber(x, y2)) {
      numbersRaw.push({
        number: this.input[x][y2],
        x,
        y: y2,
      })

      y2++
    }

    y2 = y - 1
    while (this.isNumber(x, y2)) {
      numbersRaw.unshift({
        number: this.input[x][y2],
        x,
        y: y2,
      })

      y2--
    }

    return {
      number: numbersRaw.map((n) => n.number).join(""),
      position: numbersRaw.map((n) => `${n.x}-${n.y}`).join(";"),
    }
  }

  findAdjacentNumbers(x, y) {
    let adjacentNumbers = {}

    for (let i = x - 1; i <= x + 1; i++) {
      if (this.input[i] === undefined) continue

      for (let j = y - 1; j <= y + 1; j++) {
        if (this.input[i][j] === undefined) continue
        if (i === x && j === y) continue
        if (!this.isNumber(i, j)) continue

        const wholeNumber = this.getWholeNumber(i, j)
        adjacentNumbers[wholeNumber.position] = parseInt(wholeNumber.number)
      }
    }

    return Object.values(adjacentNumbers)
  }

  callback() {
    const gearRatios = []

    for (let x = 0; x < this.input.length; x++) {
      for (let y = 0; y < this.input[x].length; y++) {
        if (this.input[x][y] !== "*") continue

        const adjacentNumbers = this.findAdjacentNumbers(x, y)

        if (adjacentNumbers.length !== 2) continue

        gearRatios.push(adjacentNumbers[0] * adjacentNumbers[1])
      }
    }

    return gearRatios.reduce((a, b) => a + b, 0)
  }
}

new AdventOfCode("input").run()
