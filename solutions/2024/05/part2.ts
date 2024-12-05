import { readFileSync } from 'fs'

// const inputName = 'demo_tmp'
// const inputName = 'demo'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

function parseInput(data: string) {
  const [orderingRules, updates] = data.split('\n\n')

  const updatesSplit = updates.split('\n').map((update) => update.split(','))

  return {
    orderingRules: orderingRules
      .split('\n')
      .map((rule) => rule.split('|'))
      .reduce((acc, [key, value]) => {
        if (acc[key] === undefined) {
          acc[key] = []
        }

        acc[key].push(value)

        return acc
      }, {}),
    updates: updatesSplit.map((update) =>
      update.reduce((acc, value, index) => {
        acc[value] = index

        return acc
      }, {}),
    ),
  }
}

function isInRightOrder(orderingRules, update) {
  for (const pageNumber of Object.keys(update)) {
    if (!orderingRules[pageNumber]) {
      continue
    }

    for (const pageNumberAfter of orderingRules[pageNumber]) {
      const afterNumberIndex = update[pageNumberAfter]
      const currentNumberIndex = update[pageNumber]

      if (afterNumberIndex < currentNumberIndex) {
        return false
      }
    }
  }

  return true
}

function sortUpdate(orderingRules, update) {
  for (let index = 0; index < Object.keys(update).length; index++) {
    const pageNumber = Object.keys(update)[index]

    if (!orderingRules[pageNumber]) {
      continue
    }

    for (const pageNumberAfter of orderingRules[pageNumber]) {
      const currentNumberIndex = update[pageNumber]
      const afterNumberIndex = update[pageNumberAfter]

      if (afterNumberIndex < currentNumberIndex) {
        update[pageNumber] = afterNumberIndex
        update[pageNumberAfter] = currentNumberIndex

        index = -1

        break
      }
    }
  }
}

export default async (): Promise<string | number> => {
  const { orderingRules, updates } = parseInput(rawData)

  const incorrectOrderedUpdates = []
  for (let index = 0; index < updates.length; index++) {
    if (isInRightOrder(orderingRules, updates[index])) {
      continue
    }

    incorrectOrderedUpdates.push(updates[index])
  }

  for (let index = 0; index < incorrectOrderedUpdates.length; index++) {
    sortUpdate(orderingRules, incorrectOrderedUpdates[index])
  }

  const middleNumbers = incorrectOrderedUpdates.map((update) => {
    const middleIndex = (Object.values(update).length - 1) / 2

    for (const [value, index] of Object.entries(update)) {
      if (index !== middleIndex) {
        continue
      }

      return value
    }
  })

  // 4736 - too low
  return middleNumbers.reduce((acc, num) => {
    return acc + Number(num)
  }, 0)
}
