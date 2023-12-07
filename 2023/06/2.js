import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    let race

    for (let index = 0; index < this.input.length; index++) {
      const line = this
        .input[index]
        .replace(/ +/gm, '')
        .split(':')[1]

      if (index === 0) {
        race = {
          duration: Number(line),
        }
      } else {
        race = {
          ...(race),
          record: Number(line),
        }
      }
    }

    let recordRuns = 0

    for (let i = 0; i <= race.duration; i++) {
      const hold = i
      const travelFor = i
      const distanceTraveled = (race.duration - hold) * travelFor

      if (distanceTraveled > race.record) {
        recordRuns++
      }
    }

    return recordRuns
  }
}

new AdventOfCode('input').run()
