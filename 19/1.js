import { AdventOfCode as BaseAdventOfCode } from '../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.rules = []
    this.validMessages = []
    this.messages = []
  }

  parseInput(data) {
    data = data.split(/\n\n/)
    this.messages = data[1].split(/\n/)

    for (const rule of data[0].split(/\n/)) {
      const ruleParsed = /(\d+): (.+)/.exec(rule)
      const ruleIndex = ruleParsed[1]
      let ruleValue = ruleParsed[2].replace(/ /g, '')

      if (ruleValue[0] === '"') {
        ruleValue = ruleValue.replace(/"/g, '')
      } else {
        ruleValue = ruleValue.split('|').map((val) => val.split(''))
      }

      this.rules[ruleIndex] = ruleValue
    }
  }

  callback() {
    return 'NULL'
  }
}

new AdventOfCode('demo').run()
