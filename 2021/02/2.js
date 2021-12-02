import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)
  }

  callback() {
    const position = {
      aim: 0,
      horizontal: 0,
      depth: 0
    }

    for (const row of this.input) {
      let { instruction, value } = /(?<instruction>.*?) (?<value>\d+)/.exec(row).groups

      value = parseInt(value)

      switch (instruction) {
        case 'forward':
          position.horizontal += value
          position.depth += position.aim * value
          break;

        case 'down':
          position.aim += value
          break;

        case 'up':
          position.aim -= value
          break;
      }
    }

    return position.horizontal * position.depth
  }
}

new AdventOfCode('input').run()
