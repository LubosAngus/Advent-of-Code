import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.answer = 0
    this.required = ["byr:", "iyr:", "eyr:", "hgt:", "hcl:", "ecl:", "pid:"]
  }

  parseInput(data) {
    return data
      .trim()
      .replace(/^(.{1,})\n/gm, `$1 `)
      .split("\n")
      .filter((value) => value)
  }

  validate(passport) {
    for (let i = 0; i < this.required.length; i++) {
      if (!passport.includes(this.required[i])) return false
    }

    return true
  }

  callback() {
    this.input.forEach((passport) => {
      if (this.validate(passport)) this.answer++
    })

    return this.answer
  }
}

new AdventOfCode("input").run()
