import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.crateStacks = {}
    this.instructions = []
  }

  parseInput(data) {
    let [crates, instructions] = data.split("\n\n")

    crates = crates.split("\n").reverse()

    const firstLine = crates.splice(0, 1)[0]
    const tmpCrateStacks = []

    for (let index = 0; index < firstLine.length; index++) {
      if (firstLine[index] === " ") continue

      tmpCrateStacks.push({
        index,
        number: firstLine[index],
        crates: [],
      })
    }

    for (const crateStack of tmpCrateStacks) {
      for (const crate of crates) {
        if (!crate[crateStack.index] || crate[crateStack.index] === " ") break

        crateStack.crates.push(crate[crateStack.index])
      }
    }

    for (const tmpCrateStack of tmpCrateStacks) {
      this.crateStacks[tmpCrateStack.number] = tmpCrateStack.crates
    }

    this.instructions = instructions.split("\n").map((instruction) => {
      const regex = /move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/gm

      return { ...regex.exec(instruction).groups }
    })

    return data
  }

  callback() {
    for (const instruction of this.instructions) {
      const moveFrom = this.crateStacks[instruction.from]
      const moveTo = this.crateStacks[instruction.to]

      moveTo.push(
        ...moveFrom.splice(
          moveFrom.length - instruction.count,
          instruction.count,
        ),
      )
    }

    const result = Object.values(this.crateStacks)
      .map((crateStack) => crateStack.pop())
      .join("")

    return result
  }
}

new AdventOfCode("input").run()
