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
      this.answers[groupId] = []

      group.split(" ").forEach((personAnswers) => {
        for (let i = 0; i < personAnswers.length; i++) {
          const answer = personAnswers[i]

          if (!this.answers[groupId].includes(answer))
            this.answers[groupId].push(answer)
        }
      })
    })

    return this.answers.reduce((prev, curr) => prev + curr.length, 0)
  }
}

new AdventOfCode("input").run()
