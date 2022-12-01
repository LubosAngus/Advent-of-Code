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
    const elfCalories = this.input.map((value) => value.reduce((acc, value) => acc + value, 0));
    elfCalories.sort(function(a, b) {
      return b - a;
    })

    let topCalories = 0

    for (let index = 0; index < 3; index++) {
      topCalories += elfCalories[index]
    }

    return topCalories
  }
}

new AdventOfCode('input').run()
