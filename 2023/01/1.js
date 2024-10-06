import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    const numbers = this.input.map((line) => {
      const numbers = line.replace(/[^0-9]/g, "")
      const first = numbers[0]
      const last = numbers[numbers.length - 1]

      return parseInt(`${first}${last}`)
    })

    return numbers.reduce((a, b) => a + b)
  }
}

new AdventOfCode("input").run()
