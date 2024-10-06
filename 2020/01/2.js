import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.inputAsInt = true
    this.answer = null
  }

  parseInput(data) {
    return data
      .trim()
      .split("\n")
      .filter((value) => value)
      .map((value) => parseInt(value))
  }

  callback() {
    this.input.forEach((first) => {
      this.input.forEach((second) => {
        this.input.forEach((third) => {
          if (first + second + third == 2020) {
            this.answer = first * second * third
          }
        })
      })
    })

    return this.answer
  }
}

new AdventOfCode("input").run()
