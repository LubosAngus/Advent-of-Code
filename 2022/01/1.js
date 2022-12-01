import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    data = data.trim().split('\n\n').filter(value => value)
    data = data.map(value => value.trim().split('\n').map(value => parseInt(value)))

    return data
  }

  callback() {
    let mostCalories = 0

    for (const elf of this.input) {
      const elfCalories = elf.reduce((acc, value) => acc + value, 0)

      if (elfCalories > mostCalories) {
        mostCalories = elfCalories
      }
    }

    return mostCalories
  }
}

new AdventOfCode('input').run()
