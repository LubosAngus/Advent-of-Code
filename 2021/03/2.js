import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    data = super.parseInput(data)

    return data.map((number) => {
      return number.split('').map(Number)
    })
  }

  getBits(input) {
    const bits = Array.from(new Array(input[0].length), () => ({}))

    for (const number of input) {
      for (let bitIndex = 0; bitIndex < number.length; bitIndex++) {
        const bit = number[bitIndex]

        if (!bits[bitIndex][bit]) bits[bitIndex][bit] = 0

        bits[bitIndex][bit]++
      }
    }

    return bits
  }

  getCommonBits(input) {
    const bits = this.getBits(input)
    const mostCommon = []
    const leastCommon = []
    for (let bitIndex = 0; bitIndex < bits.length; bitIndex++) {
      const bit = bits[bitIndex];

      mostCommon[bitIndex] = bit[0] <= bit[1] ? 1 : 0
      leastCommon[bitIndex] = bit[0] > bit[1] ? 1 : 0
    }

    return { mostCommon, leastCommon }
  }

  getRating(property) {
    const rating = JSON.parse(JSON.stringify(this.input))

    let toCompare = this.getCommonBits(rating)[property]

    for (let bitIndex = 0; bitIndex < toCompare.length; bitIndex++) {
      for (let numberIndex = 0; numberIndex < rating.length; numberIndex++) {
        if (rating[numberIndex][bitIndex] !== toCompare[bitIndex]) {
          rating.splice(numberIndex, 1)
          numberIndex--
        }
      }

      toCompare = this.getCommonBits(rating)[property]

      if (rating.length === 1) {
        break
      }
    }

    return rating[0].join('')
  }

  callback() {
    const generatorRating = this.getRating('mostCommon')
    const scrubberRating = this.getRating('leastCommon')

    return parseInt(generatorRating, 2) * parseInt(scrubberRating, 2)
  }
}

new AdventOfCode('input').run()
