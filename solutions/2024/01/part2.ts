import { readFileSync } from 'fs'

// const rawData = readFileSync('./demo.txt', 'utf-8')
const rawData = readFileSync('./input.txt', 'utf-8')

function parseInput(data: string) {
  const parsedData = data.trim().split(/\r?\n/).filter(Boolean)

  const splitData = parsedData.reduce(
    (acc, item) => {
      const [left, right] = item.split('   ')

      acc.left.push(parseInt(left))
      acc.right.push(parseInt(right))

      return acc
    },
    {
      left: [],
      right: [],
    } as {
      left: number[]
      right: number[]
    },
  )

  return splitData
}

function calculateSimilarity(input) {
  const cache = new Map()

  for (let index = 0; index < input.right.length; index++) {
    const rightVal = input.right[index]

    if (cache.has(rightVal)) {
      cache.set(rightVal, cache.get(rightVal) + 1)

      continue
    }

    cache.set(rightVal, 1)
  }

  let similarity = 0
  for (let index = 0; index < input.left.length; index++) {
    const leftVal = input.left[index]
    const cachedValue = cache.get(leftVal) || 0

    similarity += leftVal * cachedValue
  }

  return similarity
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  return calculateSimilarity(input)
}
