import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"
import colors from "colors/safe.js"

const DEBUG_LOG = false

class AdventOfCode extends BaseAdventOfCode {
  declare input: string[][]

  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data: string) {
    return data.split(/\r?\n/).map((line) => line.split(""))
  }

  printDish(dish, movableRocks) {
    if (!DEBUG_LOG) {
      return
    }

    const dishCopy = JSON.parse(JSON.stringify(dish))

    for (let i = 0; i < dishCopy.length; i++) {
      for (let j = 0; j < dishCopy[i].length; j++) {
        const key = `${i}:${j}`

        if (movableRocks.has(key)) {
          dishCopy[i][j] = colors.bgCyan(dishCopy[i][j])
        }
      }

      dishCopy[i] = dishCopy[i].join("")
    }

    console.log("".padStart(20, "-"))
    console.log(dishCopy.join("\n"))
  }

  getMovableRocks(dish): Set<string> {
    const movableRocks: Set<string> = new Set()

    for (let i = 0; i < dish.length; i++) {
      for (let j = 0; j < dish[i].length; j++) {
        const item = dish[i][j]

        if (item !== "O") continue

        const itemAbove = dish[i - 1]?.[j]
        if (!itemAbove || itemAbove === "#") {
          continue
        }

        const key = `${i}:${j}`

        movableRocks.add(key)
      }
    }

    return movableRocks
  }

  callback() {
    const tiltedDish = [...this.input]

    let movableRocks = this.getMovableRocks(tiltedDish)

    this.printDish(tiltedDish, movableRocks)

    while (movableRocks.size !== 0) {
      const newMovableRocks: Set<string> = new Set()

      for (const movableRock of movableRocks) {
        const [i, j] = movableRock.split(":").map(Number)
        const itemAbove = this.input[i - 1]?.[j]

        if (itemAbove !== ".") {
          continue
        }

        tiltedDish[i][j] = "."
        tiltedDish[i - 1][j] = "O"

        newMovableRocks.add(`${i - 1}:${j}`)
      }

      movableRocks = newMovableRocks

      this.printDish(tiltedDish, movableRocks)
    }

    let result = 0
    for (let i = 0; i < tiltedDish.length; i++) {
      for (let j = 0; j < tiltedDish[i].length; j++) {
        if (tiltedDish[i][j] !== "O") {
          continue
        }

        result += tiltedDish.length - i
      }
    }

    return result
  }
}

new AdventOfCode("input").run()
