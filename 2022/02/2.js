import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)

    this.score = 0
  }

  verdictAndYourMove(opponent, desiredResult) {
    const resultMap = {
      'AX': {yourMove: 'C', result: 'lose'},
      'AY': {yourMove: 'A', result: 'draw'},
      'AZ': {yourMove: 'B', result: 'win'},

      'BX': {yourMove: 'A', result: 'lose'},
      'BY': {yourMove: 'B', result: 'draw'},
      'BZ': {yourMove: 'C', result: 'win'},

      'CX': {yourMove: 'B', result: 'lose'},
      'CY': {yourMove: 'C', result: 'draw'},
      'CZ': {yourMove: 'A', result: 'win'},
    }

    return resultMap[`${opponent}${desiredResult}`]
  }

  calculateRoundScore(opponent, desiredResult) {
    const { yourMove, result } = this.verdictAndYourMove(opponent, desiredResult)
    const decisionScoreMap = {
      'A': 1,
      'B': 2,
      'C': 3,
    }
    const verdictScoreMap = {
      'win': 6,
      'draw': 3,
      'lose': 0,
    }

    this.score += decisionScoreMap[yourMove]
    this.score += verdictScoreMap[result]
  }

  callback() {
    for (const round of this.input) {
      const [ opponent, desiredResult ] = round.split(' ')

      this.calculateRoundScore(opponent, desiredResult)
    }

    return this.score
  }
}

new AdventOfCode('input').run()
