import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)
  }

  callback() {
    const position = {
      horizontal: 0,
      depth: 0
    }

    for (const row of this.input) {
      let { instruction, value } = /(?<instruction>.*?) (?<value>\d+)/.exec(row).groups

      value = parseInt(value)

      switch (instruction) {
        case 'forward':
          position.horizontal += value
          break;

        case 'down':
          position.depth += value
          break;

        case 'up':
          position.depth -= value
          break;
      }
    }

    return position.horizontal * position.depth
  }
}

new AdventOfCode('input').run()
