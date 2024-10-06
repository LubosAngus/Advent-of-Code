import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.results = []
  }

  parseInput(data) {
    // return '1 + 2 * 3 + 4 * 5 + 6' //* 231
    // return '1 + (2 * 3) + (4 * (5 + 6))' //* 51
    // return '2 * 3 + (4 * 5)' //* 46
    // return '5 + (8 * 3 + 9 + 3 * 4 * 3)' //* 1445
    // return '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))' //* 669060
    // return '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2' //* 23340

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

  calculatePluses(numbersString) {
    if (!numbersString.includes("+")) {
      return numbersString
    }

    const match = /\d+ \+ \d+/.exec(numbersString)
    const toReplace = match[0]

    numbersString = numbersString.replace(toReplace, eval(toReplace))
    numbersString = this.calculatePluses(numbersString)

    return numbersString
  }

  calculateNumbers(numbers) {
    if (typeof numbers !== "string") return numbers

    numbers = this.calculatePluses(numbers)

    if (parseInt(numbers) == numbers) return numbers

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

    return this.results.reduce((acc, val) => acc + parseInt(val), 0)
  }
}

new AdventOfCode("input").run()
