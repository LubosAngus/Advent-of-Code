import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    const linesCount = Array(this.input.length).fill(1)

    for (let cardNumber = 0; cardNumber < this.input.length; cardNumber++) {
      const line = this.input[cardNumber]

      const regex = /.+: (?<winning>.+) \| (?<yours>.+)/gm
      let {
        groups: { winning, yours },
      } = regex.exec(line)

      winning = winning
        .trim()
        .split(" ")
        .filter((v) => v)
        .map(Number)
      yours = yours
        .trim()
        .split(" ")
        .filter((v) => v)
        .map(Number)

      const yourWinning = []
      for (const y of yours) {
        if (winning.includes(y)) {
          yourWinning.push(y)
        }
      }

      for (let index = 0; index < yourWinning.length; index++) {
        linesCount[cardNumber + index + 1] += 1 * linesCount[cardNumber]
      }
    }

    return linesCount.reduce((a, b) => a + b)
  }
}

new AdventOfCode("input").run()
