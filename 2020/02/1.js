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
      const passRegex = new RegExp(target, "g")
      const finalMatches = password.match(passRegex) || []
      const occuranceLength = finalMatches.length

      if (occuranceLength >= min && occuranceLength <= max) {
        this.validCount++
      }
    })

    return this.validCount
  }
}

new AdventOfCode("input").run()
