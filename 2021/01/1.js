import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.inputAsInt = true
  }

  callback() {
    let largerMeasurements = 0

    for (let index = 1; index < this.input.length; index++) {
      if (this.input[index] > this.input[index - 1]) {
        largerMeasurements++
      }
    }

    return largerMeasurements
  }
}

new AdventOfCode('input').run()
