import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.accumulator = 0
  }

  callback() {
    for (let fixIndex = 0; fixIndex < this.input.length; fixIndex++) {
      const fixInstruction = this.input[fixIndex].split(' ')
      let wasBreaked = false
      let fixedInput = [...this.input]

      if (fixInstruction[0].includes('nop')) {
        fixedInput[fixIndex] = fixedInput[fixIndex].replace('nop', 'jmp');
      }
      else if (fixInstruction[0].includes('jmp')) {
        fixedInput[fixIndex] = fixedInput[fixIndex].replace('jmp', 'nop');
      }
      else {
        continue
      }

      this.accumulator = 0

      for (let index = 0; index < fixedInput.length; index++) {
        const instruction = fixedInput[index]
        const splitted = instruction.split(' ')

        if (splitted[0] == 'xxx') {
          wasBreaked = true
          break
        }

        fixedInput[index] = `xxx | ${fixedInput[index]}`

        if (splitted[0] == 'acc') {
          this.accumulator = eval(`${this.accumulator}${splitted[1]}`)
        }
        else if (splitted[0] == 'jmp') {
          index = eval(`${index}${splitted[1]}-1`)
        }
      }

      if (!wasBreaked) {
        console.table(fixedInput)
        break
      }
    }

    return this.accumulator
  }
}

new AdventOfCode('input').run()
