import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.holdMap = {}
  }

  parseInput(data) {
    return data
      .replace(/ ?bags?|\./g, "")
      .trim()
      .split("\n")
      .filter((value) => value && value[0] !== "#")
  }

  createHoldMap() {
    for (const item of this.input) {
      const itemSplit = item.split(" contain ")
      let contents = []

      if (itemSplit[1] != "no other") {
        for (const inside of itemSplit[1].replace(".", "").split(", ")) {
          const match = /(\d) (.+)/gm.exec(inside)

          contents[match[2]] = parseInt(match[1])
        }
      }

      this.holdMap[itemSplit[0]] = contents
    }
  }

  getBagQuantity(bag) {
    let canHold = 0

    for (const subBag in this.holdMap[bag]) {
      const quantity = this.holdMap[bag][subBag]
      const subQuantity = this.getBagQuantity(subBag)

      canHold += quantity + quantity * subQuantity
    }

    return canHold
  }

  callback() {
    this.createHoldMap()

    return this.getBagQuantity("shiny gold")
  }
}

new AdventOfCode("input").run()
