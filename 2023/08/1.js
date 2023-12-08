import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  getInstructions() {
    return this.input
      .shift()
      .split('')
      .map(i => i === 'L' ? 0 : 1)
  }

  getMap() {
    let map = {}

    for (const line of this.input) {
      if (!line) continue

      const regex = /(?<key>.{3}) = \((?<_0>.{3}), (?<_1>.{3})\)/gm
      const { key, _0, _1 } = regex.exec(line).groups

      map[key] = [_0, _1]
    }

    return map
  }

  callback() {
    const instructions = this.getInstructions()
    const map = this.getMap()

    let instructionIndex = 0
    let currentKey = 'AAA'
    let steps = 0

    while (currentKey !== 'ZZZ') {
      const currentInstruction = instructions[instructionIndex]
      instructionIndex = (instructionIndex + 1) % instructions.length
      currentKey = map[currentKey][currentInstruction]
      steps++
    }

    return steps
  }
}

new AdventOfCode('input').run()
