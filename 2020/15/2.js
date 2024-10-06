import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.size = 30000000
    this.spokenNumbers = new Array(this.size)
    this.lastSpoken = null
  }

  parseInput(data) {
    // return [0,3,6] // 30000000 - 175594     | 2020 - 436
    // return [1,3,2] // 30000000 - 2578       | 2020 - 436
    // return [2,1,3] // 30000000 - 3544142    | 2020 - 436
    // return [1,2,3] // 30000000 - 261214     | 2020 - 436
    // return [2,3,1] // 30000000 - 6895259    | 2020 - 436
    // return [3,2,1] // 30000000 - 18         | 2020 - 436
    // return [3,1,2] // 30000000 - 362        | 2020 - 436
    return data.split(",").map(Number)
  }

  getCurrentNumber(turn) {
    let current = this.input[(turn - 1) % this.input.length]

    if (turn - 1 < this.input.length) {
      return current
    }

    if (this.spokenNumbers[this.lastSpoken]?.secondToLastTurn) {
      return (
        this.spokenNumbers[this.lastSpoken].lastTurn -
        this.spokenNumbers[this.lastSpoken].secondToLastTurn
      )
    }

    return 0
  }

  memorizeSpoken(number, turn) {
    if (!this.spokenNumbers[number]) {
      this.spokenNumbers[number] = {
        lastTurn: null,
      }
    }

    const last = this.spokenNumbers[number].lastTurn

    if (last) {
      this.spokenNumbers[number].secondToLastTurn = last
    }

    this.spokenNumbers[number].lastTurn = turn
  }

  callback() {
    for (let turn = 1; turn <= this.size; turn++) {
      const current = this.getCurrentNumber(turn)

      this.memorizeSpoken(current, turn)
      this.lastSpoken = current
    }

    // console.log('------')
    // console.log(this.spokenNumbers)
    // console.log(this.lastSpoken)

    return this.lastSpoken
  }
}

new AdventOfCode("input").run()
