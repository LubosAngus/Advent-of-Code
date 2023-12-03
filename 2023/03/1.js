import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
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
      number: numbersRaw.map(n => n.number).join(''),
      position: numbersRaw.map(n => `${n.x}-${n.y}`).join(';'),
    }
  }

  findAdjacentNumbers(x, y) {
    let adjacentNumbers = []

    for (let i = x - 1; i <= x + 1; i++) {
      if (this.input[i] === undefined) continue

      for (let j = y - 1; j <= y + 1; j++) {
        if (this.input[i][j] === undefined) continue
        if (i === x && j === y) continue
        if (!this.isNumber(i, j)) continue

        adjacentNumbers.push(this.getWholeNumber(i, j))
      }
    }

    return adjacentNumbers
  }

  callback() {
    const allAdjacentNumbers = {}

    for (let x = 0; x < this.input.length; x++) {
      for (let y = 0; y < this.input[x].length; y++) {
        if (this.input[x][y] === '.') continue
        if (this.isNumber(x, y)) continue

        for (const adjacentNumber of this.findAdjacentNumbers(x, y)) {
          allAdjacentNumbers[adjacentNumber.position] = parseInt(adjacentNumber.number)
        }
      }
    }

    return Object.values(allAdjacentNumbers).reduce((a, b) => a + b, 0)
  }
}

new AdventOfCode('input').run()
