import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.answers = []
  }

  parseInput(data) {
    return data
      .trim()
      .replace(/^(.{1,})\n/gm, `$1 `)
      .split("\n")
      .filter((value) => value)
  }

  callback() {
    this.input.forEach((group, groupId) => {
      this.answers[groupId] = group
        .trim()
        .split(" ")
        .reduce((prev, curr) => {
          const personsAnswers = curr.split("")

          if (prev === false) {
            prev = personsAnswers
          } else {
            prev = prev.filter((value) => personsAnswers.includes(value))
          }

          return prev
        }, false)
    })

    return this.answers.reduce((prev, curr) => prev + curr.length, 0)
  }
}

new AdventOfCode("input").run()
