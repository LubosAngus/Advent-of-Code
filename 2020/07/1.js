import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.allBags = []
    this.holdMap = {}
  }

  parseInput(data) {
    return data.replace(/ ?bags?|\./g, '').trim().split('\n').filter(value => value)
  }

  canHold(bag, toHold) {
    let result = false

    for (const subBag in this.holdMap[bag]) {
      if (result) break

      if (subBag == toHold) {
        result = true
      } else {
        result = this.canHold(subBag, toHold)
      }
    }

    return result
  }

  addBagToAll(bag) {
    if (!this.allBags.includes(bag)) {
      this.allBags.push(bag)
    }
  }

  createHoldMap() {
    for (const item of this.input) {
      const itemSplit = item.split(' contain ')
      let contents = []

      this.addBagToAll(itemSplit[0])

      if (itemSplit[1] != 'no other') {
        for (const inside of itemSplit[1].replace('.', '').split(', ')) {
          const match = /(\d) (.+)/gm.exec(inside)

          contents[match[2]] = parseInt(match[1])

          this.addBagToAll(match[2])
        }
      }

      this.holdMap[itemSplit[0]] = contents
    }
  }

  callback() {
    this.createHoldMap()

    let result = 0
    for (const bag of this.allBags) {
      if (bag !== 'shiny gold' && this.canHold(bag, 'shiny gold')) {
        result++
      }
    }

    return result
  }
}

new AdventOfCode('demo_1').run()
