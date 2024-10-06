import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.answer = 0
  }

  callback() {
    let j = 0

    for (let i = 1; i < this.input.length; i++) {
      const overflow = this.input[i].length

      j = j + 3

      if (j >= overflow) {
        j = j - overflow
      }

      const possibleTree = this.input[i][j]

      if (possibleTree != ".") {
        this.answer++
      }

      this.input[i] = this.input[i].split("")
      this.input[i][j] = possibleTree == "." ? "O" : "X"
      this.input[i] = this.input[i].join("")
    }

    return this.answer
  }
}

new AdventOfCode("input").run()
