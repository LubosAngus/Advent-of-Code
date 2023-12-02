import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    const games = []

    for (const line of this.input) {
      const regex = /Game (?<gameId>\d+): (?<game>.*)/gm;
      const { groups: { gameId, game } } = regex.exec(line)

      const maxColors = {
        red: 0,
        green: 0,
        blue: 0,
      }

      const rounds = game.split('; ').map((round) => {
        const items = round.split(', ')
        const colors = {
          red: 0,
          green: 0,
          blue: 0,
        }

        for (const item of items) {
          const [value, color] = item.split(' ')

          colors[color] = parseInt(value)

          if (colors[color] > maxColors[color]) {
            maxColors[color] = colors[color]
          }
        }

        return colors
      });

      games.push({
        gameId: parseInt(gameId),
        rounds,
        maxColors,
      })
    }

    const maxGoal = {
      red: 12,
      green: 13,
      blue: 14,
    }

    let result = 0;
    for (const game of games) {
      if (
        game.maxColors.red > maxGoal.red
        || game.maxColors.green > maxGoal.green
        || game.maxColors.blue > maxGoal.blue
      ) continue

      result += game.gameId
    }

    return result
  }
}

new AdventOfCode('input').run()
