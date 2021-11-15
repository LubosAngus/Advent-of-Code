import { AdventOfCode as BaseAdventOfCode } from '../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)
  }

  parseInput(data) {
    data = data
      .trim()
      .split('\n')
      .filter(val => val)

    return data
  }

  getCoordsString(coords) {
    return coords.join(',')
  }

  getNeighbors(coords) {
    const [ x, y, z, w ] = coords.split(',').map(Number)
    const neighbors = new Set()

    for (let posX = -1; posX <= 1; posX++) {
      for (let posY = -1; posY <= 1; posY++) {
        for (let posZ = -1; posZ <= 1; posZ++) {
          for (let posW = -1; posW <= 1; posW++) {
            const neighbor = this.getCoordsString([x + posX, y + posY, z + posZ, w + posW])
            neighbors.add(neighbor)
          }
        }
      }
    }

    neighbors.delete(coords)

    return neighbors
  }

  doCycle(activeCubes) {
    const newCubes = new Set()
    const inactiveCubes = {}

    for (const activeCube of activeCubes) {
      const neighbors = this.getNeighbors(activeCube)
      let activeNeighbors = 0

      for (const neighbor of neighbors) {
        if (activeCubes.has(neighbor)) {
          activeNeighbors++
        } else {
          if (!(neighbor in inactiveCubes)) {
            inactiveCubes[neighbor] = 0
          }

          inactiveCubes[neighbor] += 1
        }
      }

      if (new Set([2,3]).has(activeNeighbors)) {
        newCubes.add(activeCube)
      }
    }

    for (const inactiveCube of Object.keys(inactiveCubes)) {
      const activeNeighbors = inactiveCubes[inactiveCube]

      if (activeNeighbors === 3) {
        newCubes.add(inactiveCube)
      }
    }

    return newCubes
  }

  getActiveCubes() {
    const activeCubes = new Set()

    for (let posX = 0; posX < this.input.length; posX++) {
      for (let posY = 0; posY < this.input[posX].length; posY++) {
        const cube = this.input[posX][posY]

        if (cube === '#') {
          activeCubes.add(this.getCoordsString([posX, posY, 0, 0]))
        }
      }
    }

    return activeCubes
  }

  callback() {
    let activeCubes = this.getActiveCubes()

    for (let cycle = 0; cycle < 6; cycle++) {
      activeCubes = this.doCycle(activeCubes)
    }

    return activeCubes.size
  }
}

new AdventOfCode('demo').run()
