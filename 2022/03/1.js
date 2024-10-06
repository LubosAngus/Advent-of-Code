import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  splitInHalf(string) {
    return [
      string.slice(0, Math.floor(string.length / 2)),
      string.slice(Math.floor(string.length / 2)),
    ]
  }

  parseInput(data) {
    data = data
      .trim()
      .split("\n")
      .filter((value) => value)
    data = data.map((item) => this.splitInHalf(item))

    return data
  }

  callback() {
    let commonItemTypes = []

    for (const [firstCompartment, secondCompartment] of this.input) {
      const rucksackCommonItems = {}

      for (const item of firstCompartment) {
        if (secondCompartment.includes(item)) {
          rucksackCommonItems[item] = true
        }
      }

      commonItemTypes = [
        ...commonItemTypes,
        ...Object.keys(rucksackCommonItems),
      ]
    }

    commonItemTypes = commonItemTypes.map((item) => {
      let letterCode = item.charCodeAt(0)

      if (letterCode >= 65 && letterCode <= 90) {
        letterCode = letterCode - 38
      } else {
        letterCode = letterCode - 96
      }

      return letterCode
    })

    return commonItemTypes.reduce((partialSum, a) => partialSum + a, 0)
  }
}

new AdventOfCode("input").run()
