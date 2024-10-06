import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.possibleDifferences = [1, 2, 3]
    this.joltages = {}
  }

  parseInput(data) {
    this.input = data
      .trim()
      .split("\n")
      .filter((value) => value)
      .map((value) => parseInt(value))
      .sort((a, b) => a - b)
    this.input.unshift(0)
    this.input.push(this.input[this.input.length - 1] + 3)

    return this.input
  }

  addJoltage(joltage) {
    if (typeof this.joltages[joltage] === "undefined") {
      this.joltages[joltage] = 0
    }

    this.joltages[joltage]++
  }

  callback() {
    for (let index = 0; index < this.input.length; index++) {
      if (typeof this.input[index + 1] === "undefined") continue

      const currJoltage = this.input[index]
      const nextJoltage = this.input[index + 1]

      for (let j = 0; j < this.possibleDifferences.length; j++) {
        if (currJoltage + this.possibleDifferences[j] === nextJoltage) {
          this.addJoltage(this.possibleDifferences[j])
          break
        }
      }
    }

    return this.joltages[1] * this.joltages[3]
  }
}

new AdventOfCode("input").run()
