import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.spoken = []
    this.spokenNumbers = {}
    this.lastSpoken = null
  }

  parseInput(data) {
    // return [0,3,6] // 436
    // return [1,3,2] // 1
    // return [2,1,3] // 10
    // return [1,2,3] // 27
    // return [2,3,1] // 78
    // return [3,2,1] // 438
    // return [3,1,2] // 1836
    return data.split(',').map(Number)
  }

  getCurrentNumber(turn) {
    let current = this.input[(turn - 1) % this.input.length]

    if (turn - 1 < this.input.length) {
      return current
    }

    if (this.spokenNumbers[this.lastSpoken]?.secondToLastTurn) {
      return this.spokenNumbers[this.lastSpoken].lastTurn - this.spokenNumbers[this.lastSpoken].secondToLastTurn
    }

    return 0
  }

  memorizeSpoken(number, turn) {
    let spoken = this.spokenNumbers[number]

    if (typeof spoken === 'undefined') {
      spoken = {
        lastTurn: turn,
        secondToLastTurn: null,
        count: 0
      }
    }

    if (spoken.count > 0) {
      spoken.secondToLastTurn = spoken.lastTurn
    }

    spoken.lastTurn = turn
    spoken.count++

    this.spokenNumbers[number] = spoken
  }

  callback() {
    for (let turn = 1; turn <= 2020; turn++) {
      const current = this.getCurrentNumber(turn)

      this.memorizeSpoken(current, turn)
      this.lastSpoken = current
      this.spoken[turn] = current
    }

    // console.log('------')
    // console.table(this.spoken)
    // console.log(this.spokenNumbers)
    // console.log(this.lastSpoken)

    return this.lastSpoken
  }
}

new AdventOfCode('input').run()
