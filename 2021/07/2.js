import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    return data.split(',').map(Number)
  }

  callback() {
    const min = Math.min(...this.input)
    const max = Math.max(...this.input)

    let cheapestFuel = Infinity
    for (let position = min; position < max; position++) {
      let fuel = 0

      for (const crab of this.input) {
        let numberOfSteps = Math.abs(position - crab)
        fuel = fuel + numberOfSteps / 2 * (numberOfSteps + 1)

        if (cheapestFuel < fuel) {
          break;
        }
      }

      if (cheapestFuel > fuel) {
        cheapestFuel = fuel
      }
    }

    return cheapestFuel
  }
}

new AdventOfCode('input').run()
