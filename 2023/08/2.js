import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  getInstructions() {
    return this.input
      .shift()
      .split("")
      .map((i) => (i === "L" ? 0 : 1))
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

  getLcm(numbers) {
    const gcd = (a, b) => (a ? gcd(b % a, a) : b)
    const lcm = (a, b) => (a * b) / gcd(a, b)
    const result = numbers.reduce(lcm)

    return result
  }

  callback() {
    const instructions = this.getInstructions()
    const map = this.getMap()
    const startingKeys = Object.keys(map)
      .filter((k) => k.endsWith("A"))
      .map((v) => ({
        value: v,
        repeatsAfter: 0,
      }))

    for (const startingKey of startingKeys) {
      let instructionIndex = 0
      let currentKey = startingKey.value
      let steps = 0

      while (!currentKey.endsWith("Z")) {
        const currentInstruction = instructions[instructionIndex]
        instructionIndex = (instructionIndex + 1) % instructions.length
        currentKey = map[currentKey][currentInstruction]
        steps++
      }

      startingKey.repeatsAfter = steps
    }

    return this.getLcm(startingKeys.map((k) => k.repeatsAfter))
  }
}

new AdventOfCode("input").run()
