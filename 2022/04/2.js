import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    let overlappingCount = 0

    for (const pair of this.input) {
      const [firstMin, firstMax, lastMin, lastMax] = pair
        .split(/-|,/)
        .map((item) => parseInt(item))

      if (firstMin <= lastMax && lastMin <= firstMax) {
        overlappingCount++
      }
    }

    return overlappingCount
  }
}

new AdventOfCode("input").run()
