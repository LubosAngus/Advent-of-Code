import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.waypointOffset = { x: 10, y: 1 }
    this.shipPosition = { x: 0, y: 0 }
  }

  moveWaypoint(direction, value) {
    switch (direction) {
      case 'N' : this.waypointOffset.y += value; break
      case 'E' : this.waypointOffset.x += value; break
      case 'S' : this.waypointOffset.y -= value; break
      case 'W' : this.waypointOffset.x -= value; break
    }
  }

  moveShip(value) {
    this.shipPosition.x += this.waypointOffset.x * value
    this.shipPosition.y += this.waypointOffset.y * value
  }

  rotateWaypoint(direction, degrees) {
    let { x, y } = { ...this.waypointOffset }

    if (direction == 'R' && degrees != 180) {
      x = -x
      y = -y
    }

    switch (degrees) {
      case 90 :
        this.waypointOffset.x = -y
        this.waypointOffset.y = +x
        break

      case 180 :
        this.waypointOffset.x = -x
        this.waypointOffset.y = -y
        break

      case 270 :
        this.waypointOffset.x = +y
        this.waypointOffset.y = -x
        break
    }
  }

  callback() {
    for (const instruction of this.input) {
      const action = instruction[0]
      const value = parseInt(instruction.slice(1))

      switch (action) {
        case 'F':
          this.moveShip(value); break

        case 'L':
        case 'R':
          this.rotateWaypoint(action, value); break

        default:
          this.moveWaypoint(action, value); break
      }
    }

    return Math.abs(this.shipPosition.x) + Math.abs(this.shipPosition.y)
  }
}

new AdventOfCode('input').run()
