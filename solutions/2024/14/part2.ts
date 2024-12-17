import chalk from 'chalk'
import { readFileSync } from 'fs'
import logUpdate from 'log-update'

// const inputName = 'demo'
// const spaceSize: SpaceSize = [11, 7]
// const minTreeHeight = 2

const inputName = 'input'
const spaceSize: SpaceSize = [101, 103]
const minTreeHeight = 11

process.stdout.columns = spaceSize[0] + 10
process.stdout.rows = spaceSize[1] + 10

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Coords = [number, number]
type SpaceSize = Coords
type Robot = {
  position: Coords
  velocity: Coords
}
type Robots = Robot[]
type CurrentMap = Set<string>

function parseInput(data: string): Robots {
  return data.split('\n').map((row) => {
    const [position, velocity] = row
      .split(' ')
      .map((item) => item.split('=')[1])
      .map((item) => item.split(',').map(Number))

    return {
      position,
      velocity,
    } as Robot
  })
}

function logRobots(robots: Robots) {
  const space = []

  for (let y = 0; y < spaceSize[1]; y++) {
    space[y] = []
    for (let x = 0; x < spaceSize[0]; x++) {
      space[y][x] = 0

      for (let index = 0; index < robots.length; index++) {
        const robot = robots[index]

        if (robot.position[0] === x && robot.position[1] === y) {
          space[y][x]++
        }
      }
    }
  }

  let toLog = ''
  for (let y = 0; y < space.length; y++) {
    if (y > 0) {
      toLog += '\n'
    }

    for (let x = 0; x < space[y].length; x++) {
      const item = space[y][x] || '·'
      const coordsKey = `${x};${y}`

      if (searchTreePositions.has(coordsKey)) {
        toLog += chalk.bgMagenta(item)
      } else {
        toLog += chalk.grey.dim(item)
      }
    }
  }

  logUpdate(toLog)
}

function moveRobot(robot: Robot): Robot {
  const { position, velocity } = robot

  const newPositions: Coords = [0, 0]
  for (let i = 0; i < 2; i++) {
    newPositions[i] = position[i] + velocity[i]
    newPositions[i] = newPositions[i] % spaceSize[i]

    if (newPositions[i] < 0) {
      newPositions[i] = spaceSize[i] + newPositions[i]
    }
  }

  const newRobot = {
    velocity,
    position: newPositions,
  }

  return newRobot
}

let searchTreePositions = new Set()
function hasTree(currentMap: CurrentMap) {
  for (const coordsKey of currentMap) {
    let isTreeFound = true

    searchTreePositions = new Set()

    const [baseX, baseY] = coordsKey.split(';').map(Number)

    treeLoop: for (let y = 0; y < minTreeHeight; y++) {
      for (let x = y * -1; x <= y; x++) {
        const keyToFind = `${baseX + x};${baseY + y}`

        searchTreePositions.add(keyToFind)

        if (!currentMap.has(keyToFind)) {
          isTreeFound = false

          break treeLoop
        }
      }
    }

    if (isTreeFound) {
      return true
    }
  }

  return false
}

export default async (): Promise<string | number> => {
  const robots = parseInput(rawData)

  let result
  // eslint-disable-next-line no-constant-condition
  for (let seconds = 1; true; seconds++) {
    result = seconds

    logUpdate(chalk.bgMagenta(seconds.toString().padStart(8, ' ')))

    const currentMap: CurrentMap = new Set()
    for (let index = 0; index < robots.length; index++) {
      const robot = moveRobot(robots[index])
      robots[index] = robot

      const mapKey = `${robot.position[0]};${robot.position[1]}`
      currentMap.add(mapKey)
    }

    if (hasTree(currentMap)) {
      break
    }

    if (seconds >= 1e6) {
      break
    }
  }

  logRobots(robots)

  return result
}
