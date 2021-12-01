import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.mask = null
    this.memory = {}
  }

  int2bin(int) {
    return parseInt(int).toString(2).padStart(36, 0)
  }

  callback() {
    // console.log(this.int2bin(101))

    for (const insturction of this.input) {
      if (insturction.includes('mask')) {
        this.mask = insturction.replace('mask = ', '')
        continue
      }

      const matches = /mem\[(\d+)\] = (\d+)/.exec(insturction)
      const memoryKey = matches[1]
      let memoryValue = this.int2bin(matches[2]).split('')

      for (let i = 0; i < this.mask.length; i++) {
        const maskValue = this.mask[i]

        if (maskValue === 'X') continue

        memoryValue[i] = this.mask[i]
      }

      this.memory[memoryKey] = parseInt(memoryValue.join(''), 2)
    }

    return Object.values(this.memory).reduce((a, b) => a + b, 0)
  }
}

new AdventOfCode('input').run()
