import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.days = 80
  }

  parseInput(data) {
    return data.split(",").map(Number)
  }

  callback() {
    // console.log(`Initial state: ${this.input.join(',')}`);

    for (let day = 0; day < this.days; day++) {
      const fishCount = this.input.length
      for (let fishIndex = 0; fishIndex < fishCount; fishIndex++) {
        const fish = this.input[fishIndex] - 1

        if (fish < 0) {
          this.input.push(8)
        }

        this.input[fishIndex] = fish < 0 ? 6 : fish
      }
      // console.log(`After ${(day + 1).toString().padStart(2, ' ')} days: ${this.input.join(',')}`);
    }

    return this.input.length
  }
}

new AdventOfCode("input").run()
