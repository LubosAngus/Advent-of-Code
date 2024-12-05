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
    updatesMiddlePages: updatesSplit.map((update) => {
      return Number(update[(update.length - 1) / 2])
    }),
  }
}

function isInRightOrder(orderingRules, update) {
  for (const pageNumber of Object.keys(update)) {
    const currentNumberIndex = update[pageNumber]

    if (!orderingRules[pageNumber]) {
      continue
    }

    for (const pageNumberAfter of orderingRules[pageNumber]) {
      const afterNumberIndex = update[pageNumberAfter]

      if (afterNumberIndex < currentNumberIndex) {
        return false
      }
    }
  }

  return true
}

export default async (): Promise<string | number> => {
  const { orderingRules, updates, updatesMiddlePages } = parseInput(rawData)

  const correctMiddlePages = []

  for (let index = 0; index < updates.length; index++) {
    if (!isInRightOrder(orderingRules, updates[index])) {
      continue
    }

    correctMiddlePages.push(updatesMiddlePages[index])
  }

  return correctMiddlePages.reduce((acc, num) => {
    return acc + num
  }, 0)
}
