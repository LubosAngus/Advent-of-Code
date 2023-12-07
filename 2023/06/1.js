import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  callback() {
    const races = []

    for (let index = 0; index < this.input.length; index++) {
      const line = this
        .input[index]
        .replace(/ +/gm, ' ')
        .split(' ')
        .map(Number)
        .filter(value => !isNaN(value))

      for (let index2 = 0; index2 < line.length; index2++) {
        if (index === 0) {
          races[index2] = {
            duration: line[index2],
          }
        } else {
          races[index2] = {
            ...(races[index2] || {}),
            record: line[index2],
          }
        }
      }
    }

    const allRecordRuns = []
    for (const race of races) {
      let recordRuns = 0

      for (let i = 0; i <= race.duration; i++) {
        const hold = i
        const travelFor = i
        const distanceTraveled = (race.duration - hold) * travelFor

        if (distanceTraveled > race.record) {
          recordRuns++
        }
      }

      allRecordRuns.push(recordRuns)
    }

    return allRecordRuns.reduce((a, b) => a * b)
  }
}

new AdventOfCode('input').run()
