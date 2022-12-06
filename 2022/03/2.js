import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  removeDuplicates(data) {
    return data.map((item) => {
      const splitArray = item.split('')

      item = splitArray.filter((item, index) => {
        return splitArray.indexOf(item) === index
      })

      return item.join('')
    })
  }

  divideIntoGroups(data) {
    return data.reduce((accumulator, current, index) => {
      const groupIndex = Math.floor(index / 3)

      if (typeof accumulator[groupIndex] === 'undefined') {
        accumulator[groupIndex] = []
      }

      accumulator[groupIndex].push(current)

      return accumulator
    }, [])
  }

  parseInput(data) {
    data = data.trim().split('\n').filter(value => value)
    data = this.removeDuplicates(data)
    data = this.divideIntoGroups(data)

    return data
  }

  getNumberValueForLetter(letter) {
    let letterCode = letter.charCodeAt(0)

    if (letterCode >= 65 && letterCode <= 90) {
      return letterCode - 38
    } else {
      return letterCode - 96
    }
  }

  callback() {
    let commonItemTypes = []

    for (let index = 0; index < this.input.length; index++) {
      const [first, second, third] = this.input[index];
      let commonItem = null

      searchLoop:
      for (let lvl1 = 0; lvl1 < first.length; lvl1++) {
        for (let lvl2 = 0; lvl2 < second.length; lvl2++) {
          if (first[lvl1] !== second[lvl2]) {
            continue
          }

          for (let lvl3 = 0; lvl3 < third.length; lvl3++) {
            if (second[lvl2] == third[lvl3]) {
              commonItem = first[lvl1]
              break searchLoop
            }
          }
        }
      }

      commonItemTypes.push(commonItem)
    }

    commonItemTypes = commonItemTypes.map((letter) => this.getNumberValueForLetter(letter))

    return commonItemTypes.reduce((partialSum, a) => partialSum + a, 0)
  }
}

new AdventOfCode('input').run()
