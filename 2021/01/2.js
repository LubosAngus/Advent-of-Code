import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.inputAsInt = true
  }

  callback() {
    let largerMeasurements = 0
    let last = null

    for (let index = 2; index < this.input.length; index++) {
      const current = new Array(3)
        .fill()
        .reduce((acc, _, arrIndex) => acc + this.input[index - arrIndex], 0)

      if (last !== null && current > last) {
        largerMeasurements++
      }

      last = current
    }

    return largerMeasurements
  }
}

new AdventOfCode("input").run()
