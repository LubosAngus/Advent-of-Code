import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)

    this.allowedDirectionsMap = {
      '-': ['left', 'right'],
      '|': ['up', 'down'],
      'F': ['down', 'right'],
      '7': ['down', 'left'],
      'J': ['up', 'left'],
      'L': ['up', 'right'],
    }
  }

  getPossibleMoves(i, j, last_i, last_j) {
    let possibleMoves = []
    let directions = []

    for (const possibleMove of [
      [i - 1, j, ['F', '7', '|'], 'up'],
      [i + 1, j, ['J', 'L', '|'], 'down'],
      [i, j - 1, ['F', 'L', '-'], 'left'],
      [i, j + 1, ['7', 'J', '-'], 'right'],
    ]) {
      const [
        possible_i, possible_j, allowedValues, direction
      ] = possibleMove

      if (!this.input?.[possible_i]?.[possible_j]) continue

      if (
        possible_i === last_i
        && possible_j === last_j
      ) {
        continue
      }

      if (
        allowedValues.includes(this.input[possible_i][possible_j])
        && (
          this.input[i][j] === 'S'
          || this.allowedDirectionsMap[this.input[i][j]].includes(direction)
        )
      ) {
        possibleMoves.push([possible_i, possible_j])
        directions.push(direction)
      }
    }

    return {
      possibleMoves,
      directions
    }
  }

  callback() {
    this.input = this.input.map((line) => line.split(''))

    let startingPosition
    startingPositionLoop:
    for (let i = 0; i < this.input.length; i++) {
      for (let j = 0; j < this.input[i].length; j++) {
        if (this.input[i][j] !== 'S') continue

        startingPosition = [i, j]

        const { directions } = this.getPossibleMoves(i, j)

        for (const allowedValue of Object.keys(this.allowedDirectionsMap)) {
          const allowedDirection = this.allowedDirectionsMap[allowedValue]

          if (allowedDirection.sort().join('-') === directions.sort().join('-')) {
            this.input[i][j] = allowedValue
          }
        }

        break startingPositionLoop
      }
    }

    let currentPosition = startingPosition
    let lastPosition = null
    let steps = 0
    do {
      const [ i, j ] = currentPosition
      const [ last_i, last_j ] = lastPosition ?? [null, null]
      const { possibleMoves } = this.getPossibleMoves(i, j, last_i, last_j)

      lastPosition = currentPosition
      currentPosition = possibleMoves[0]
      steps++
    } while (
      currentPosition[0] !== startingPosition[0]
      || currentPosition[1] !== startingPosition[1]
    );

    return steps / 2
  }
}

new AdventOfCode('input').run()
