import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.inputAsInt = true
    this.permable = 25
    this.answer = false
  }

  isValid(number, toCalc) {
    let result = false

    for (let i = 0; i < toCalc.length; i++) {
      for (let j = 0; j < toCalc.length; j++) {
        if (i == j) continue

        if (toCalc[i] + toCalc[j] == number) {
          result = true

          break
        }
      }
    }

    return result
  }

  callback() {
    for (let index = this.permable; index < this.input.length; index++) {
      const number = this.input[index];
      const toCalc = []

      for (let j = 1; j <= this.permable; j++) {
        toCalc.push(this.input[index - j]);
      }

      if (!this.isValid(number, toCalc)) {
        this.answer = number

        break
      }
    }

    return this.answer
  }
}

new AdventOfCode('input').run()
