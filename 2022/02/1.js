import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)

    this.score = 0
  }

  verdict(opponent, you) {
    const resultMap = {
      'AX': 'draw', // rock - rock
      'AY': 'win', // rock - paper
      'AZ': 'lose', // rock - scissors

      'BX': 'lose', // paper - rock
      'BY': 'draw', // paper - paper
      'BZ': 'win', // paper - scissors

      'CX': 'win', // scissors - rock
      'CY': 'lose', // scissors - paper
      'CZ': 'draw', // scissors - scissors
    }

    return resultMap[`${opponent}${you}`]
  }

  calculateRoundScore(opponent, you) {
    const decisionScoreMap = {
      'X': 1,
      'Y': 2,
      'Z': 3,
    }
    const verdictScoreMap = {
      'win': 6,
      'draw': 3,
      'lose': 0,
    }

    this.score += decisionScoreMap[you]
    this.score += verdictScoreMap[this.verdict(opponent, you)]
  }

  callback() {
    for (const round of this.input) {
      const [ opponent, you ] = round.split(' ')

      this.calculateRoundScore(opponent, you)
    }

    return this.score
  }
}

new AdventOfCode('input').run()
