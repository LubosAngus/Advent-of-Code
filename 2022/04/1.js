import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    let containedCount = 0

    for (const pair of this.input) {
      const [firstMin, firstMax, lastMin, lastMax] = pair
        .split(/-|,/)
        .map((item) => parseInt(item))

      if (
        (firstMin <= lastMin && firstMax >= lastMax) ||
        (firstMin >= lastMin && firstMax <= lastMax)
      ) {
        containedCount++
      }
    }

    return containedCount
  }
}

new AdventOfCode("input").run()
