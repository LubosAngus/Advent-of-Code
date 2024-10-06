import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.mask = null
    this.memory = {}
    this.combinations = {}
  }

  int2bin(int) {
    return parseInt(int).toString(2).padStart(36, 0)
  }

  getCombinations(size) {
    if (this.combinations[size]) return this.combinations[size]

    let combinations = []
    var maxDecimal = parseInt("1".repeat(size), 2)

    for (var i = 0; i <= maxDecimal; i++) {
      combinations.push(i.toString(2).padStart(size, "0"))
    }

    this.combinations[size] = combinations
    return combinations
  }

  callback() {
    for (const insturction of this.input) {
      if (insturction.includes("mask")) {
        this.mask = insturction.replace("mask = ", "")
        continue
      }

      const matches = /mem\[(\d+)\] = (\d+)/.exec(insturction)
      const memoryValue = parseInt(matches[2])
      let memoryKey = this.int2bin(matches[1]).split("")

      for (let i = 0; i < this.mask.length; i++) {
        const maskValue = this.mask[i]

        if (maskValue === "0") continue

        memoryKey[i] = this.mask[i]
      }

      const combinations = this.getCombinations(
        memoryKey.filter((val) => val == "X").length,
      )
      for (const combination of combinations) {
        let index = 0
        const newMemoryKey = parseInt(
          memoryKey
            .map((value) => (value == "X" ? combination[index++] : value))
            .join(""),
          2,
        )
        this.memory[newMemoryKey] = memoryValue
      }
    }

    return Object.values(this.memory).reduce((a, b) => a + b, 0)
  }
}

new AdventOfCode("input").run()
