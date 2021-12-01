import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.invalidValues = []
  }

  parseInput(data) {
    this.fields = this.getFields(data)
    this.nearbyTickets = this.getNearbyTickets(data)
  }

  getFields(data) {
    const regex = /(\w+): (.+) or (.+)/gm;
    let fields = {};
    let m;

    while ((m = regex.exec(data)) !== null) {
      if (m.index === regex.lastIndex) regex.lastIndex++

      let field = null
      let validValues = []

      m.forEach((match, groupIndex) => {
        if (groupIndex == 0) {}
        else if (groupIndex == 1) field = match
        else {
          const range = match.split('-')
          for (let index = parseInt(range[0]); index <= parseInt(range[1]); index++) {
            validValues.push(index)
          }
        }
      })

      fields[field] = validValues
    }

    return fields
  }

  getNearbyTickets(data) {
    return /nearby tickets:\n(.*)/s.exec(data)[1].split('\n').map(v => v.split(',').map(Number))
  }

  callback() {
    const allValidValues = Object.values(this.fields).reduce((accumulator, current) => {
      return [...accumulator, ...current]
    }, [])

    for (const ticket of this.nearbyTickets) {
      for (const value of ticket) {
        if (!allValidValues.includes(value)) {
          this.invalidValues.push(value)
        }
      }
    }

    return eval(this.invalidValues.join('+'))
  }
}

new AdventOfCode('input').run()
