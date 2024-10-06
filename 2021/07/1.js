import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    return data.split(",").map(Number)
  }

  callback() {
    const potentialPositions = this.input.reduce((acc, item) => {
      if (!acc.includes(item)) {
        acc.push(item)
      }

      return acc
    }, [])

    let cheapestFuel = Infinity
    let cheapestPosition = null

    for (const position of potentialPositions) {
      let fuel = 0

      for (const crab of this.input) {
        fuel = fuel + Math.abs(position - crab)

        if (cheapestFuel < fuel) {
          break
        }
      }

      if (cheapestFuel > fuel) {
        cheapestFuel = fuel
        cheapestPosition = position
      }
    }

    console.log(cheapestPosition)

    return cheapestFuel
  }
}

new AdventOfCode("input").run()
