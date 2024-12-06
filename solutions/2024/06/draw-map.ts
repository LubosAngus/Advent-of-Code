import AnimationServer from '@advent-utils/animation-server'
import sleep from '@advent-utils/sleep'
import chalk from 'chalk'
import { Coordinates, GuardCoordinates, Input, ViewportSize } from './types'

const ANIMATION_LOG_FPS: number = 15
const OPERATIONS_PER_SECOND: number = 500

// provide odd numbers, max-height is 21
const VIEWPORT_SIZE: ViewportSize = {
  width: 41,
  height: 21,
}

const EMPTY_SPACE = ' '

const animationServer = new AnimationServer({
  fps: ANIMATION_LOG_FPS,
})

export default async function drawMap(
  input: Input,
  guardCoordinates: GuardCoordinates,
  forceDraw: boolean = false,
) {
  await sleep(1000 / OPERATIONS_PER_SECOND)

  if (!forceDraw && !animationServer.isReadyForNextFrame) {
    return
  }

  const firstRow = input[0]
  const limitViewport: Coordinates = {
    row: Math.floor(VIEWPORT_SIZE.height / 2),
    col: Math.floor(VIEWPORT_SIZE.width / 2),
  }

  const toLog = input
    .map((row) => {
      let result = row
        .slice(
          Math.max(guardCoordinates.col - limitViewport.col, 0),
          guardCoordinates.col + limitViewport.col + 1,
        )
        .join('')

      result = chalk.bgRgb(40, 50, 58)(result)

      if (guardCoordinates.col - limitViewport.col <= 0) {
        const prefix = new Array(
          Math.abs(guardCoordinates.col - limitViewport.col) + 1,
        )
          .fill(EMPTY_SPACE)
          .join('')

        result = prefix + result
      } else {
        result = chalk.grey.dim('◂') + result
      }

      if (guardCoordinates.col + limitViewport.col + 1 >= row.length) {
        const suffix = new Array(
          Math.abs(guardCoordinates.col + limitViewport.col + 1 - row.length) +
            1,
        )
          .fill(EMPTY_SPACE)
          .join('')

        result = result + suffix
      } else {
        result = result + chalk.grey.dim('▸')
      }

      return result
    })
    .slice(
      Math.max(guardCoordinates.row - limitViewport.row, 0),
      guardCoordinates.row + limitViewport.row + 1,
    )

  const toLogPrefix = []
  if (guardCoordinates.row - limitViewport.row <= 0) {
    const missingRows = Math.abs(guardCoordinates.row - limitViewport.row) + 1

    for (let i = 0; i < missingRows; i++) {
      toLogPrefix.push(
        new Array(limitViewport.col * 2 + 3).fill(EMPTY_SPACE).join(''),
      )
    }
  } else {
    const prefix = [EMPTY_SPACE]

    for (
      let index = guardCoordinates.col - limitViewport.col;
      index < guardCoordinates.col + limitViewport.col + 1;
      index++
    ) {
      if (firstRow[index] === undefined) {
        prefix.push(EMPTY_SPACE)
      } else {
        prefix.push(chalk.grey.dim('▴'))
      }
    }

    prefix.push(EMPTY_SPACE)

    toLogPrefix.push(prefix.join(''))
  }

  const toLogSuffix = []
  if (guardCoordinates.row + limitViewport.row + 1 >= input.length) {
    const missingRows =
      guardCoordinates.row + limitViewport.row + 1 - input.length + 1

    for (let i = 0; i < missingRows; i++) {
      toLogSuffix.push(
        new Array(limitViewport.col * 2 + 3).fill(EMPTY_SPACE).join(''),
      )
    }
  } else {
    const suffix = [EMPTY_SPACE]

    for (
      let index = guardCoordinates.col - limitViewport.col;
      index < guardCoordinates.col + limitViewport.col + 1;
      index++
    ) {
      if (firstRow[index] === undefined) {
        suffix.push(EMPTY_SPACE)
      } else {
        suffix.push(chalk.grey.dim('▾'))
      }
    }

    suffix.push(EMPTY_SPACE)

    toLogSuffix.push(suffix.join(''))
  }

  animationServer.renderFrame(
    [...toLogPrefix, ...toLog, ...toLogSuffix].join('\n'),
  )
}
