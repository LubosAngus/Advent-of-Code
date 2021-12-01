import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.inputAsInt = true
    this.firstResult = 373803594
    this.contigousSet = []
    this.answer = false
  }

  callback() {
    console.log(this.input)

    for (let i = 0; i < this.input.length; i++) {
      let res = 0

      for (let j = i; j < this.input.length; j++) {
        res = res + this.input[j]

        if (res > this.firstResult) {
          break
        }

        if (res === this.firstResult && i !== j) {
          for (let k = i; k <= j; k++) {
            this.contigousSet.push(this.input[k])
          }

          this.contigousSet.sort()
          this.answer = this.contigousSet[0] + this.contigousSet[this.contigousSet.length - 1]

          break
        }
      }

      if (this.answer !== false) {
        break
      }
    }

    return this.answer
  }
}

new AdventOfCode('input').run()
