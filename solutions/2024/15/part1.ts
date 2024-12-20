import chalk from 'chalk'
import { readFileSync } from 'fs'
import logUpdate from 'log-update'

// const inputName = 'demo'
// const inputName = 'demo1'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

const DEBUG_LOG: boolean = false

type Warehouse = ('#' | 'O' | '.' | '@')[][]
type Instruction = '>' | '^' | '<' | 'v'
type Input = {
  warehouse: Warehouse
  instructions: Instruction[]
}
type Positions = {
  robot: Position
  stuckBoxes: Set<Position>
  boxes: Set<Position>
  walls: Set<Position>
}
type Position = string
type Coords = [number, number]

// Order is important to determine if box is stuck
const directionMap = {
  '^': [-1, 0],
  '>': [0, 1],
  'v': [1, 0],
  '<': [0, -1],
} as const

function parseInput(data: string): Input {
  const [warehouseRaw, instructionsRaw] = data.split('\n\n')

  const warehouse = warehouseRaw
    .split('\n')
    .map((row) => row.split('')) as Warehouse

  process.stdout.columns = warehouse[0].length
  process.stdout.rows = warehouse.length

  const instructions = instructionsRaw
    .replaceAll('\n', '')
    .split('') as Instruction[]

  return {
    warehouse,
    instructions,
  }
}

function getPosition([row, col]: Coords): Position {
  return `${row};${col}`
}

function getCoords(position: Position): Coords {
  return position.split(';').map(Number) as Coords
}

let lastInstruction: Instruction
let instructionIndex: number = 0
async function logMap(
  warehouse: Warehouse,
  positions: Positions,
  instruction?: Instruction,
): Promise<void> {
  if (!DEBUG_LOG) {
    return
  }

  // await sleep(1000 / 120)

  if (lastInstruction === instruction) {
    instructionIndex++
  } else {
    instructionIndex = 0
  }

  let toLog = chalk.bgMagenta.bold(
    ` ${instruction || '/'}  ${instructionIndex} `,
  )

  for (let row = 0; row < warehouse.length; row++) {
    toLog += '\n'

    for (let col = 0; col < warehouse[row].length; col++) {
      const position = getPosition([row, col])

      if (position === positions.robot) {
        toLog += chalk.cyan.bold('@')
      } else if (positions.stuckBoxes.has(position)) {
        toLog += chalk.red('O')
      } else if (positions.boxes.has(position)) {
        toLog += chalk.green('O')
      } else if (positions.walls.has(position)) {
        toLog += chalk.red.dim('#')
      } else {
        toLog += chalk.grey.dim('.')
      }
    }
  }

  logUpdate(toLog)

  lastInstruction = instruction
}

function moveByInstruction(coords: Coords, instruction: Instruction): Coords {
  return [...coords].map((item, index) => {
    return Number(item) + directionMap[instruction][index]
  }) as Coords
}

function checkAndAddStuckBox(
  boxCoords: Coords,
  walls: Set<Position>,
  stuckBoxes: Set<Position>,
): void {
  if (stuckBoxes.has(getPosition(boxCoords))) {
    return
  }

  let wasPrevWall = false

  for (const instruction of Object.keys(directionMap)) {
    const neighbourCoords = moveByInstruction(boxCoords, instruction)
    const neighbourPosition = getPosition(neighbourCoords)

    const isNeighbourWall =
      walls.has(neighbourPosition) || stuckBoxes.has(neighbourPosition)

    if (wasPrevWall && isNeighbourWall) {
      stuckBoxes.add(getPosition(boxCoords))
    }

    wasPrevWall = isNeighbourWall
  }

  return
}

function move(
  { robot, walls, boxes, stuckBoxes }: Positions,
  instruction: Instruction,
): Position {
  const robotCoords = getCoords(robot)
  const newRobotCoords = moveByInstruction(robotCoords, instruction)
  const newRobotPosition = getPosition(newRobotCoords)

  if (walls.has(newRobotPosition)) {
    return robot
  }

  if (boxes.has(newRobotPosition)) {
    let nextGapCoords: Coords
    let tmpCoords: Coords = [...newRobotCoords]

    checkAndAddStuckBox(tmpCoords, walls, stuckBoxes)

    do {
      tmpCoords = moveByInstruction(tmpCoords, instruction)
      const tmpPosition = getPosition(tmpCoords)

      if (walls.has(tmpPosition)) {
        break
      }

      if (stuckBoxes.has(tmpPosition)) {
        break
      }

      if (boxes.has(tmpPosition)) {
        checkAndAddStuckBox(tmpCoords, walls, stuckBoxes)

        continue
      }

      nextGapCoords = tmpCoords

      break
      // eslint-disable-next-line no-constant-condition
    } while (true)

    if (nextGapCoords === undefined) {
      return robot
    }

    boxes.delete(newRobotPosition)
    boxes.add(getPosition(nextGapCoords))
  }

  return newRobotPosition
}

export default async (): Promise<string | number> => {
  const { warehouse, instructions } = parseInput(rawData)
  const positions: Positions = {
    robot: null,
    stuckBoxes: new Set(),
    boxes: new Set(),
    walls: new Set(),
  }

  for (let row = 0; row < warehouse.length; row++) {
    for (let col = 0; col < warehouse[row].length; col++) {
      const item = warehouse[row][col]
      const position = getPosition([row, col])

      if (item === '@') {
        positions.robot = position
      } else if (item === 'O') {
        positions.boxes.add(position)
      } else if (item === '#') {
        positions.walls.add(position)
      }
    }
  }

  for (const instruction of instructions) {
    positions.robot = move(positions, instruction)

    await logMap(warehouse, positions, instruction)
  }

  return [...positions.boxes].reduce((acc, boxPosition) => {
    const boxCoords = getCoords(boxPosition)

    acc += 100 * boxCoords[0] + boxCoords[1]

    return acc
  }, 0)
}
