import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    const numbers = this.input.map((line) => {
      const validStringNumbers = [
        "-",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ]
      const lineNumbers = []

      for (let index = 0; index < line.length; index++) {
        const slicedLine = line.slice(index)

        if (!isNaN(parseInt(line[index]))) {
          lineNumbers.push(line[index])

          continue
        }

        for (const stringNumber of validStringNumbers) {
          const lineMatch = slicedLine.match(`^${stringNumber}`)

          if (!lineMatch) continue

          lineNumbers.push(validStringNumbers.indexOf(stringNumber))
        }
      }

      const first = lineNumbers[0]
      const last = lineNumbers[lineNumbers.length - 1]

      // console.log(line)
      // console.log(lineNumbers)
      // console.log(`${first}${last}`)
      // console.log('-------------')

      return parseInt(`${first}${last}`)
    })

    return numbers.reduce((a, b) => a + b)
  }
}

new AdventOfCode("input").run()
