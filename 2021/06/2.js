import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.days = 256
  }

  parseInput(data) {
    return data.split(",").map(Number)
  }

  callback() {
    const fishProduction = {}
    for (let fish = 0; fish < 7; fish++) {
      fishProduction[fish] = {
        count: 0,
        queue: 0,
      }
    }

    for (const fish of this.input) {
      fishProduction[fish].count++
    }

    for (let day = 0; day < this.days; day++) {
      const productionDay = day % 7
      const fishToActivate = fishProduction[productionDay].queue

      fishProduction[productionDay].queue = 0

      if (fishProduction[productionDay].count) {
        const queueDay = (productionDay + 2) % 7

        fishProduction[queueDay].queue += fishProduction[productionDay].count
      }

      fishProduction[productionDay].count += fishToActivate
    }

    return Object.values(fishProduction).reduce(
      (acc, fish) => acc + fish.count + fish.queue,
      0,
    )
  }
}

new AdventOfCode("input").run()
