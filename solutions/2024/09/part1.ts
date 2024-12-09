/**
 * ~500ms on calculating result is probably quite slow ¯\_(ツ)_/¯
 */

import { readFileSync } from 'fs'

// const inputName = 'demo_tmp'
// const inputName = 'demo'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = number[]
type Block = number | '.'

function parseInput(data: string): Input {
  return data.split('').map(Number)
}

function generateBlocks(input: Input): Block[] {
  let id = 0
  const blocks: Block[] = []

  for (let index = 0; index < input.length; index++) {
    const blockLength = input[index]
    const isFile = index % 2 === 0

    const toFill = isFile ? id++ : '.'

    blocks.push(...Array(blockLength).fill(toFill))
  }

  return blocks
}

function getFreeSpacesIndexes(blocks: Block[]) {
  const freeSpacesIndexes: number[] = []

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]

    if (block === '.') {
      freeSpacesIndexes.push(index)
    }
  }

  return freeSpacesIndexes
}

function moveFileBlocks(blocks: Block[], freeSpacesIndexes: number[]): void {
  for (let index = blocks.length - 1; index >= 0; index--) {
    // console.log(blocks.join(''))

    const block = blocks[index]

    if (block === '.') {
      const indexOfSpace = freeSpacesIndexes.indexOf(index)
      freeSpacesIndexes.splice(indexOfSpace, 1)

      continue
    }

    if (freeSpacesIndexes.length === 0) {
      break
    }

    const nextFreeSpaceIndex = freeSpacesIndexes.shift()

    blocks[nextFreeSpaceIndex] = block
    blocks[index] = '.'
  }
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const blocks = generateBlocks(input)
  const freeSpacesIndexes = getFreeSpacesIndexes(blocks)

  moveFileBlocks(blocks, freeSpacesIndexes)

  let result = 0
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]

    if (block === '.') {
      break
    }

    result += block * index
  }

  return result
}
