import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    const games = []

    for (const line of this.input) {
      const regex = /Game (?<gameId>\d+): (?<game>.*)/gm
      const {
        groups: { gameId, game },
      } = regex.exec(line)

      const maxColors = {
        red: 0,
        green: 0,
        blue: 0,
      }

      const rounds = game.split("; ").map((round) => {
        const items = round.split(", ")
        const colors = {
          red: 0,
          green: 0,
          blue: 0,
        }

        for (const item of items) {
          const [value, color] = item.split(" ")

          colors[color] = parseInt(value)

          if (colors[color] > maxColors[color]) {
            maxColors[color] = colors[color]
          }
        }

        return colors
      })

      games.push({
        gameId: parseInt(gameId),
        rounds,
        maxColors,
      })
    }

    let result = 0
    for (const game of games) {
      result += game.maxColors.red * game.maxColors.green * game.maxColors.blue
    }

    return result
  }
}

new AdventOfCode("input").run()
