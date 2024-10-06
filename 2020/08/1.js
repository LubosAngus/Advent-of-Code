import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.accumulator = 0
  }

  callback() {
    for (let index = 0; index < this.input.length; index++) {
      const instruction = this.input[index].split(" ")

      if (instruction[0] == "xxx") {
        break
      }

      this.input[index] = `xxx | ${this.input[index]}`

      if (instruction[0] == "acc") {
        this.accumulator = eval(`${this.accumulator}${instruction[1]}`)
      } else if (instruction[0] == "jmp") {
        index = eval(`${index}${instruction[1]}-1`)
      }
    }

    console.table(this.input)

    return this.accumulator
  }
}

new AdventOfCode("input").run()
