import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    data = data
      .trim()
      .split('\n')
      .filter(value => value)
      .map((val) => {
        const [signalPatterns, outputValue] = val.split(' | ')

        return outputValue.split(' ')
      })

    return data
  }

  callback() {
    const uniqueDigits = [
      { value: 1, segments: 2 },
      { value: 4, segments: 4 },
      { value: 7, segments: 3 },
      { value: 8, segments: 7 },
    ]

    let uniqueDigitsCount = 0
    for (let outputValues of this.input) {
      for (const outputValue of outputValues) {
        for (const { segments } of uniqueDigits) {
          if (outputValue.length === segments) uniqueDigitsCount++
        }
      }
    }

    return uniqueDigitsCount
  }
}

new AdventOfCode('input').run()
