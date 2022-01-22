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
    }).filter(({ x1, y1, x2, y2 }) => {
      return x1 == x2 || y1 == y2
    })
  }

  callback() {
    const diagram = new Map()

    for (const { x1, y1, x2, y2 } of this.input) {
      for (
        let x = x1;
        x1 <= x2 ? x <= x2 : x >= x2;
        x1 <= x2 ? x++ : x--
      ) {
        for (
          let y = y1;
          y1 <= y2 ? y <= y2 : y >= y2;
          y1 <= y2 ? y++ : y--
        ) {
          const coords = Coords.stringify([x,y])

          let value = parseInt(diagram.get(coords)) || 0
          value++
          diagram.set(coords, value)
        }
      }
    }

    // const diagramStats = {
    //   x: {
    //     min: 0,
    //     max: 0,
    //   },
    //   y: {
    //     min: 0,
    //     max: 0,
    //   },
    // }

    // for (const coords of diagram.keys()) {
    //   const [ x, y ] = Coords.parse(coords)

    //   if (x < diagramStats.x.min) diagramStats.x.min = x
    //   if (x > diagramStats.x.max) diagramStats.x.max = x
    //   if (y < diagramStats.y.min) diagramStats.y.min = y
    //   if (y > diagramStats.y.max) diagramStats.y.max = y
    // }

    // for (let x = diagramStats.x.min; x <= diagramStats.x.max; x++) {
    //   const row = []
    //   for (let y = diagramStats.y.min; y <= diagramStats.y.max; y++) {
    //     row.push(diagram.get(Coords.stringify([y,x])) || '.')
    //   }
    //   console.log(row.join(''))
    // }

    return [...diagram.values()].reduce((acc, curr) => {
      if (curr >= 2) {
        acc++
      }

      return acc
    }, 0)
  }
}

new AdventOfCode('input').run()
