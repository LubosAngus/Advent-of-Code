import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.inputAsInt = true
    this.answer = null
  }

  callback() {
    this.input.forEach(first => {
      this.input.forEach(second => {
        if (first + second == 2020) {
          this.answer = first * second
        }
      })
    })

    return this.answer
  }
}

new AdventOfCode('input').run()
