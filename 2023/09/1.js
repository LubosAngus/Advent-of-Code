import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)
  }

  generateSteps(value) {
    let currentSteps = value
    let steps = [value]

    while (!currentSteps.every((value) => value === 0)) {
      const nextSteps = []

      for (let index = 0; index < currentSteps.length - 1; index++) {
        const nextStep = currentSteps[index + 1] - currentSteps[index]

        nextSteps.push(nextStep)
      }

      steps.push(nextSteps)

      currentSteps = nextSteps
    }

    return steps
  }

  generateNextValue(steps) {
    let nextValue = 0

    steps.reverse()

    for (const step of steps) {
      step.reverse()

      nextValue += step[0]
    }

    return nextValue
  }

  callback() {
    const values = this.input.map((value) => value.split(" ").map(Number))
    const nextValues = []

    for (const value of values) {
      const steps = this.generateSteps(value)
      const nextValue = this.generateNextValue(steps)

      nextValues.push(nextValue)
    }

    return nextValues.reduce((acc, value) => acc + value, 0)
  }
}

new AdventOfCode("input").run()
