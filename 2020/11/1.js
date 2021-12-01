import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.hasChanged = false
    this.answer = 0
  }

  parseInput(data) {
    return data.trim().split('\n').filter(value => value).map(value => value.split(''))
  }

  cloneInput() {
    this.updatedInput = JSON.parse(JSON.stringify(this.input))
  }

  isDefined = (i,j) => typeof this.input[i] !== 'undefined' && typeof this.input[i][j] !== 'undefined'
  isEmpty = (s) => (s === 'L')
  isOccupied = (s) => (s === '#')

  updateSeat(i, j, value) {
    this.updatedInput[i][j] = value
    this.hasChanged = true
  }

  countSeats() {
    for (let i = 0; i < this.input.length; i++) {
      for (let j = 0; j < this.input[i].length; j++) {
        if (this.input[i][j] === '#') this.answer++
      }
    }
  }

  logInput() {
    console.log('\n')

    for (let i = 0; i < this.input.length; i++) {
      console.log(this.input[i].join(''))
    }
  }

  applyRules() {
    this.cloneInput()
    this.hasChanged = false

    for (let i = 0; i < this.input.length; i++) {
      for (let j = 0; j < this.input[i].length; j++) {
        const seat = this.input[i][j]
        const isEmpty = this.isEmpty(seat)
        const isOccupied = this.isOccupied(seat)

        if (isEmpty || isOccupied) {
          let occupiedAdjacent = 0

          loopAdjacent:
          for (let k = i-1; k <= i+1; k++) {
            for (let l = j-1; l <= j+1; l++) {
              if (occupiedAdjacent > 5) break loopAdjacent
              if (!this.isDefined(k,l) || this.input[k][l] === '.') continue

              if (this.isOccupied(this.input[k][l])) {
                occupiedAdjacent++
              }
            }
          }

          if (isEmpty && occupiedAdjacent === 0) this.updateSeat(i, j, '#')
          if (isOccupied && occupiedAdjacent >= 5) this.updateSeat(i, j, 'L')
        }
      }
    }

    // this.logInput()
    this.input = this.updatedInput
  }

  callback() {
    do {
      this.applyRules()
    } while (this.hasChanged)

    this.countSeats()

    return this.answer
  }
}

new AdventOfCode('demo').run()
