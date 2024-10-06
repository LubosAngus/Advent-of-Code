import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.results = []
  }

  parseInput(data) {
    // return '1 + 2 * 3 + 4 * 5 + 6' //* 71
    // return '1 + (2 * 3) + (4 * (5 + 6))' //* 51
    // return '2 * 3 + (4 * 5)' //* 26
    // return '5 + (8 * 3 + 9 + 3 * 4 * 3)' //* 437
    // return '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))' //* 12240
    // return '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2' //* 13632

    return data.trim()
  }

  removeBrackets(numbersString) {
    if (!numbersString.includes("(")) {
      return this.calculateNumbers(numbersString)
    }

    const match = /\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/.exec(
      numbersString,
    )
    const toReplace = match[0]
    let toCalculate = match[1]

    if (toCalculate.includes("(")) {
      toCalculate = this.removeBrackets(toCalculate)
    }

    numbersString = numbersString.replace(
      toReplace,
      this.calculateNumbers(toCalculate),
    )
    numbersString = this.removeBrackets(numbersString)

    return numbersString
  }

  calculateNumbers(numbers) {
    if (typeof numbers !== "string") return numbers

    return numbers.split(" ").reduce(
      (accumulator, current) => {
        accumulator.toCalc.push(current)

        if (accumulator.toCalc.length == 3) {
          accumulator.result = eval(accumulator.toCalc.join(""))
          accumulator.toCalc = [accumulator.result]
        }

        return accumulator
      },
      {
        result: 0,
        toCalc: [],
      },
    ).result
  }

  callback() {
    for (const line of this.input.split("\n")) {
      this.results.push(this.removeBrackets(line))
    }

    return this.results.reduce((acc, val) => acc + val)
  }
}

new AdventOfCode("input").run()
