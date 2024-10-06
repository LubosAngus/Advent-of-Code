import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    let finalScore = 0

    for (const line of this.input) {
      const regex = /Card (?<cardId>[0-9 ]+): (?<winning>.+) \| (?<yours>.+)/gm
      let {
        groups: { _cardId, winning, yours },
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

      let tmpScore = 0
      for (let index = 0; index < yourWinning.length; index++) {
        tmpScore = tmpScore * 2 || 1
      }

      finalScore += tmpScore
    }

    return finalScore
  }
}

new AdventOfCode("input").run()
