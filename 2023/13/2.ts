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

  getItemsBeforeReflection(pattern, invalidValue): null | number {
    let itemsBeforeReflection: null | number = null

    for (let index = 0; index < pattern.length; index++) {
      if (index + 1 === invalidValue) {
        continue
      }

      const row = pattern[index]
      const nextRow = pattern[index + 1]

      if (row === nextRow) {
        const hasPerfectReflection = this.isPerfectReflection(pattern, index)

        if (hasPerfectReflection) {
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

  findResultOfPattern(pattern, invalidValue = 0): number | null {
    const rowsBeforeReflection = this.getItemsBeforeReflection(
      pattern,
      invalidValue / 100,
    )

    if (rowsBeforeReflection !== null) {
      return 100 * rowsBeforeReflection
    }

    const rotatedPattern = this.rotatePattern270deg(pattern)
    const columnsBeforeReflection = this.getItemsBeforeReflection(
      rotatedPattern,
      invalidValue,
    )

    if (columnsBeforeReflection !== null) {
      return columnsBeforeReflection
    }

    return null
  }

  callback() {
    let result = 0

    for (const pattern of this.input) {
      const invalidValue = this.findResultOfPattern(pattern)!
      let newResult: null | number = null

      for (let i = 0; i < pattern.length; i++) {
        if (newResult !== null) break

        for (let j = 0; j < pattern[i].length; j++) {
          if (newResult !== null) break

          const updatedPattern = [...pattern]
          const newValue = pattern[i][j] === "." ? "#" : "."

          updatedPattern[i] =
            updatedPattern[i].substring(0, j) +
            newValue +
            updatedPattern[i].substring(j + 1)

          const tmpResult = this.findResultOfPattern(
            updatedPattern,
            invalidValue,
          )

          if (tmpResult !== null) {
            newResult = tmpResult
          }
        }
      }

      result += newResult!
    }

    return result
  }
}

new AdventOfCode("input").run()
