/**
 * ~20s on calculating result is waay too slow.
 *
 * Somehow need to optimize this, but fuck it already.
 */

import { readFileSync } from 'fs'
const DEBUG_LOG = false as boolean

// const inputName = 'demo'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = number[]
type Block = {
  id?: number
  blockIndex: number
  type: 'file' | 'space'
  size: number
}
type Files = {
  [key: string]: Block
}

function parseInput(data: string): Input {
  return data.split('').map(Number)
}

function debugLog(blocks: Block[]): void {
  if (!DEBUG_LOG) return

  console.log(
    Object.values(blocks)
      .map((item) => {
        const result = Array(item.size)

        if (item.type === 'file') {
          result.fill(item.id)
        } else {
          result.fill('.')
        }

        return result.join('')
      })
      .join(''),
  )
}

function prepareData(input: Input): {
  blocks: Block[]
  files: Files
} {
  let blockIndex = 0
  let fileId = 0
  const blocks: Block[] = []
  const files: Files = {}

  for (let index = 0; index < input.length; index++) {
    const blockSize = input[index]
    const isFile = index % 2 === 0

    if (isFile) {
      const id = fileId++
      const block: Block = {
        id,
        blockIndex,
        type: 'file',
        size: blockSize,
      }

      blocks[blockIndex] = block
      files[id] = block
    } else {
      const block: Block = {
        blockIndex,
        type: 'space',
        size: blockSize,
      }

      blocks[blockIndex] = block
    }

    blockIndex += blockSize
  }

  return { blocks, files }
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const { blocks, files } = prepareData(input)
  const filesValues = Object.values(files)

  debugLog(blocks)

  for (let fileIndex = filesValues.length - 1; fileIndex >= 0; fileIndex--) {
    const file = filesValues[fileIndex]

    for (const blockIndexString in blocks) {
      const blockIndex = Number(blockIndexString)
      const block = blocks[blockIndex]

      if (block.type === 'file') {
        continue
      }

      if (file.blockIndex <= blockIndex) {
        break
      }

      const newSpaceSize = block.size - file.size

      if (newSpaceSize < 0) {
        continue
      }

      if (newSpaceSize !== 0) {
        blocks[blockIndex + file.size] = {
          type: 'space',
          size: newSpaceSize,
          blockIndex: blockIndex + file.size,
        }
      }

      blocks[file.blockIndex] = {
        type: 'space',
        size: file.size,
        blockIndex: file.blockIndex,
      }

      blocks[blockIndex] = file

      debugLog(blocks)
      break
    }
  }

  let result = 0
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]

    if (block?.id === undefined) {
      continue
    }

    for (let index2 = 0; index2 < block.size; index2++) {
      result += block.id * (index + index2)
    }
  }

  return result
}
