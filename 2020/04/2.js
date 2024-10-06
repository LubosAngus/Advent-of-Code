import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class Validator {
  constructor(passport) {
    this.passport = passport
    this.passportFields = this.passport.split(" ").filter((v) => v)
    this.required = ["byr:", "iyr:", "eyr:", "hgt:", "hcl:", "ecl:", "pid:"]
  }

  validate() {
    if (!this.checkRequiredFields(this.passport)) return false

    for (const fieldRaw of this.passportFields) {
      const field = fieldRaw.split(":")
      const name = field[0]
      const value = field[1]

      if (typeof this[name] === "function" && !this[name](value)) {
        return false
      }
    }

    return true
  }

  checkRequiredFields() {
    for (let i = 0; i < this.required.length; i++) {
      if (!this.passport.includes(this.required[i])) return false
    }

    return true
  }

  // (Birth Year) - four digits; at least 1920 and at most 2002
  byr(value) {
    return this.minMax(value, 1920, 2002)
  }

  // (Issue Year) - four digits; at least 2010 and at most 2020
  iyr(value) {
    return this.minMax(value, 2010, 2020)
  }

  // (Expiration Year) - four digits; at least 2020 and at most 2030
  eyr(value) {
    return this.minMax(value, 2020, 2030)
  }

  // (Height) - a number followed by either cm or in:
  // If cm, the number must be at least 150 and at most 193.
  // If in, the number must be at least 59 and at most 76.
  hgt(value) {
    const is_cm = value.includes("cm")
    const is_in = value.includes("in")

    if (!is_cm && !is_in) return false

    if (is_cm) {
      return this.minMax(value, 150, 193)
    } else {
      return this.minMax(value, 59, 76)
    }
  }

  // (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  hcl(value) {
    return /#[0-9a-f]{6}/.exec(value) !== null
  }

  // (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  ecl(value) {
    return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value)
  }

  // (Passport ID) - a nine-digit number, including leading zeroes.
  pid(value) {
    return /^\d{9}$/.exec(value) !== null
  }

  minMax(value, min, max) {
    value = parseInt(value)

    return value >= min && value <= max
  }
}

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.answer = 0
  }

  parseInput(data) {
    return data
      .trim()
      .replace(/^(.{1,})\n/gm, `$1 `)
      .split("\n")
      .filter((value) => value)
  }

  callback() {
    this.input.forEach((passport) => {
      const isValid = new Validator(passport).validate()

      if (isValid) this.answer++
    })

    return this.answer
  }
}

// new AdventOfCode('demo').run()
new AdventOfCode("input").run()
