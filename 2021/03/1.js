import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    data = super.parseInput(data)

    return data.map((number) => number.split("").map(Number))
  }

  callback() {
    const bits = Array.from(new Array(this.input[0].length), () => ({}))
    for (const number of this.input) {
      for (let bitIndex = 0; bitIndex < number.length; bitIndex++) {
        const bit = number[bitIndex]

        if (!bits[bitIndex][bit]) bits[bitIndex][bit] = 0

        bits[bitIndex][bit]++
      }
    }

    let gamma = ""
    let epsilon = ""
    for (const bit of bits) {
      gamma += bit[0] < bit[1] ? 1 : 0
      epsilon += bit[0] > bit[1] ? 1 : 0
    }

    return parseInt(gamma, 2) * parseInt(epsilon, 2)
  }
}

new AdventOfCode("input").run()
