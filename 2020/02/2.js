import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.validCount = 0
  }

  callback() {
    this.input.forEach((pass) => {
      const matches = /(\d+)-(\d+) (.*): (.*)/gm.exec(pass)
      const min = matches[1]
      const max = matches[2]
      const target = matches[3]
      const password = matches[4]

      if (
        (password[min - 1] == target && password[max - 1] != target) ||
        (password[min - 1] != target && password[max - 1] == target)
      ) {
        this.validCount++
      }
    })

    return this.validCount
  }
}

new AdventOfCode("input").run()
