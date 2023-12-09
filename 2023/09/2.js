import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  generateSteps(value) {
    let currentSteps = value
    let steps = [value]


    while (!currentSteps.every(value => value === 0)) {
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

  generatePrevValue(steps) {
    let prevValue = 0

    steps.reverse()

    for (const step of steps) {
      prevValue = step[0] - prevValue
    }

    return prevValue
  }

  callback() {
    const values = this.input.map(value => value.split(' ').map(Number))
    const prevValues = []

    for (const value of values) {
      const steps = this.generateSteps(value)
      const prevValue = this.generatePrevValue(steps)

      prevValues.push(prevValue)
    }

    return prevValues.reduce((acc, value) => acc + value, 0)
  }
}

new AdventOfCode('input').run()
