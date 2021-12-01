import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.pathsCache = {}
  }

  parseInput(data) {
    this.input = data.trim().split('\n').filter(value => value).map(value => parseInt(value)).sort((a, b) => a - b)
    this.input.unshift(0)

    return this.input
  }

  findPath(index) {
    if (this.input.length - 1 === index) return 1

    if (this.pathsCache[index]) {
      return this.pathsCache[index]
    }

    let possiblePaths = 0

    const current = this.input[index];

    for (let j = 1; j <= 3; j++) {
      const next = this.input[index + j]

      if (typeof next === 'undefined' || next - current > 3) break

      possiblePaths += this.findPath(index + j)
    }

    this.pathsCache[index] = possiblePaths
    return possiblePaths
  }

  callback() {
    return this.findPath(0)
  }
}

new AdventOfCode('input').run()
