import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.shipPosition = { x: 0, y: 0 }
    this.shipDegrees = 90
    this.degreesMap = {
      N: () => 0,
      E: () => 90,
      S: () => 180,
      W: () => 270,
      F: () => Math.abs((this.shipDegrees + (this.shipDegrees < 0 ? 360 : 0)) % 360)
    }
  }

  moveShip(direction, value) {
    switch (this.degreesMap[direction]()) {
      case 0   : this.shipPosition.y += value ; break
      case 90  : this.shipPosition.x += value ; break
      case 180 : this.shipPosition.y -= value ; break
      case 270 : this.shipPosition.x -= value ; break
    }
  }

  rotateShip(direction, degrees) {
    this.shipDegrees = this.shipDegrees + degrees * (direction == 'L' ? -1 : 1)
  }

  callback() {
    for (const instruction of this.input) {
      const action = instruction[0]
      const value = parseInt(instruction.slice(1))

      switch (action) {
        case 'L':
        case 'R':
          this.rotateShip(action, value); break

        default:
          this.moveShip(action, value); break
      }
    }

    return Math.abs(this.shipPosition.x) + Math.abs(this.shipPosition.y)
  }
}

new AdventOfCode('input').run()
