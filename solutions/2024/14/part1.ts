import { readFileSync } from 'fs'

// const inputName = 'demo'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Robot = {
  position: [number, number]
  velocity: [number, number]
}
type Input = Robot[]

function parseInput(data: string): Input {
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

function logRobots(spaceSize, robots) {
  let toLog = []

  for (let x = 0; x < spaceSize[1]; x++) {
    toLog[x] = []
    for (let y = 0; y < spaceSize[0]; y++) {
      toLog[x][y] = 0

      for (let index = 0; index < robots.length; index++) {
        const robot = robots[index]

        if (robot.position[0] === y && robot.position[1] === x) {
          toLog[x][y]++
        }
      }
    }
  }

  toLog = toLog.map((i) => i.map((j) => (j === 0 ? '.' : j)).join(''))
  console.log(toLog.join('\n'))
}

export default async (): Promise<string | number> => {
  const robots = parseInput(rawData)
  const seconds = 100
  const spaceSize = [101, 103]

  for (let index = 0; index < robots.length; index++) {
    const robot = robots[index]

    for (let j = 0; j < 2; j++) {
      robot.position[j] = robot.position[j] + robot.velocity[j] * seconds
      robot.position[j] = robot.position[j] % spaceSize[j]

      if (robot.position[j] < 0) {
        robot.position[j] = spaceSize[j] - Math.abs(robot.position[j])
      }
    }
  }

  const quadrantsCount = [0, 0, 0, 0]

  for (let index = 0; index < robots.length; index++) {
    const robot = robots[index]
    const [x, y] = robot.position
    const [sizeX, sizeY] = spaceSize
    const halfX = (sizeX - 1) / 2
    const halfY = (sizeY - 1) / 2

    if (x < halfX && y < halfY) {
      quadrantsCount[0]++
      continue
    }

    if (x > halfX && y < halfY) {
      quadrantsCount[1]++
      continue
    }

    if (x < halfX && y > halfY) {
      quadrantsCount[2]++
      continue
    }

    if (x > halfX && y > halfY) {
      quadrantsCount[3]++
      continue
    }
  }

  // logRobots(spaceSize, robots)

  return quadrantsCount.reduce((acc, item) => acc * item, 1)
}
