import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  declare input: string[][]

  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data: string) {
    return data.split(/\r?\n\r?\n/).map((item) => item.split(/\r?\n/))
  }

  isPerfectReflection(pattern, startIndex) {
    const reflectionIndex = startIndex + 1

    for (let index = 0; index <= startIndex; index++) {
      const row = pattern[startIndex - index]
      const reflection = pattern[reflectionIndex + index]

      if (row === undefined || reflection === undefined) {
        continue
      }

      if (row !== reflection) {
        return false
      }
    }

    return true
  }

  getItemsBeforeReflection(pattern): null | number {
    let itemsBeforeReflection: null | number = null

    for (let index = 0; index < pattern.length; index++) {
      const row = pattern[index]
      const nextRow = pattern[index + 1]

      if (row === nextRow) {
        const hasReflection = this.isPerfectReflection(pattern, index)

        if (hasReflection) {
          itemsBeforeReflection = index + 1
          break
        }
      }
    }

    return itemsBeforeReflection
  }

  rotatePattern270deg(pattern): string[] {
    const rotatedPattern: string[][] = []

    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        if (rotatedPattern[j] === undefined) {
          rotatedPattern[j] = []
        }

        rotatedPattern[j][i] = pattern[pattern.length - i - 1][j]
      }
    }

    return rotatedPattern.map((row) => row.join(""))
  }

  callback() {
    let result = 0

    for (const pattern of this.input) {
      const rowsAboveReflection = this.getItemsBeforeReflection(pattern)

      if (rowsAboveReflection !== null) {
        result += 100 * rowsAboveReflection
        continue
      }

      const rotatedPattern = this.rotatePattern270deg(pattern)
      const columnsAboveReflection =
        this.getItemsBeforeReflection(rotatedPattern)

      if (columnsAboveReflection !== null) {
        result += columnsAboveReflection
      }
    }

    return result
  }
}

new AdventOfCode("input").run()
