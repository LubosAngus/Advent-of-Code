import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class Coords
{
  static stringify(coords) {
    return coords.join(',')
  }

  static parse(coords) {
    return coords.split(',').map(Number)
  }
}

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    data = super.parseInput(data)

    return data.map((item) => {
      const { start, end } = /(?<start>.*) -> (?<end>.*)/gm.exec(item).groups
      const [ x1, y1 ] = Coords.parse(start)
      const [ x2, y2 ] = Coords.parse(end)

      return { x1, y1, x2, y2 }
    })
  }

  callback() {
    const diagram = new Map()

    // DDA Algorithm
    for (const { x1, y1, x2, y2 } of this.input){
      const dx = x2 - x1
      const dy = y2 - y1
      const len = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)
      const xinc = dx / len
      const yinc = dy / len
      let x = x1
      let y = y1

      for (let i = 0; i <= len; i++) {
        const coords = Coords.stringify([x,y])
        const value = (parseInt(diagram.get(coords)) || 0) + 1

        diagram.set(coords, value)

        x += xinc
        y += yinc
      }
    }

    return [...diagram.values()].reduce((acc, curr) => {
      if (curr >= 2) {
        acc++
      }

      return acc
    }, 0)
  }
}

new AdventOfCode('input').run()
