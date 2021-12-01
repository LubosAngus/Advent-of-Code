import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.answers = []
    this.slopes = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ]
  }

  callback() {
    this.slopes.forEach(slope => {
      let j = 0
      let answer = 0
      const overflow = this.input[0].length

      for (let i = slope[1]; i < this.input.length; i = i + slope[1]) {
        j = j + slope[0]

        if (j >= overflow) {
          j = j - overflow
        }

        const possibleTree = this.input[i][j]

        if (possibleTree == '#') {
          answer++
        }
      }

      this.answers.push(answer)
    });

    return eval(this.answers.join(' * '))
  }
}

new AdventOfCode('input').run()
