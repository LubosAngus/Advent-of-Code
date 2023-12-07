import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

/*
251709498 -> too high

Not very optimized, but it works.
*/

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)

    this.weightMap = {
      'A': 14,
      'K': 13,
      'Q': 12,
      'T': 10,
      '9': 9,
      '8': 8,
      '7': 7,
      '6': 6,
      '5': 5,
      '4': 4,
      '3': 3,
      '2': 2,
      'J': 1,
    }

    this.handsStrengthCache = {}
  }

  permute(set) {
    const results = [];

    function generatePerm(front, i) {
      // for each element in the ith array
      for (let j = 0; j < set[i].length; j++) {
        // take a copy of the part we've already computed
        let perm = front.slice(0);
        // add the jth element from the ith array
        perm += set[i][j];

        // if we haven't used every array yet,
        // move on to the i+1th array
        if (i < set.length - 1) generatePerm(perm, i + 1);
        // else add our perm to the result array
        // and move onto the j+1th element of the ith array
        else results.push(perm);
      }
    }

    // start off our recursion with an
    // empty permutation on the first array
    generatePerm('', 0);
    return results;
  }

  getCacheKey(cardsCount) {
    const tmpArr = []
    const keys = Object.keys(cardsCount)
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];

      tmpArr.push({
        key,
        value: cardsCount[key],
      })
    }

    tmpArr.sort((a, b) => {
      if (a.value === b.value) {
        return this.weightMap[a.key] - this.weightMap[b.key]
      }

      return b.value - a.value
    })

    return tmpArr.map((item) => item.key + item.value).join('-')
  }

  getHandStrength(cardsCount) {
    const cacheKey = this.getCacheKey(cardsCount)

    if (this.handsStrengthCache[cacheKey]) {
      return this.handsStrengthCache[cacheKey]
    }

    const cardValues = Object.values(cardsCount)
    let strength = 1

    // Five of a kind
    if (cardValues.includes(5))
      strength = 7

    // Four of a kind
    else if (cardValues.includes(4))
      strength = 6

    // Full house
    else if (cardValues.includes(3) && cardValues.includes(2))
      strength = 5

    // Three of a kind
    else if (cardValues.includes(3))
      strength = 4

    // Two pairs
    else if (cardValues.filter((value) => value === 2).length === 2)
      strength = 3

    // One pair
    else if (cardValues.includes(2))
      strength = 2

    this.handsStrengthCache[cacheKey] = strength

    return strength
  }

  getCardsStrength(handSplit) {
    const cardsCount = handSplit.reduce((acc, card) => {
      if (acc[card] === undefined) {
        acc[card] = 0
      }

      acc[card]++

      return acc
    }, {})

    return this.getHandStrength(cardsCount)
  }

  getPossibleHands(handSplit) {
    let possibleHands = []

    const jokerIndexes = handSplit.reduce((acc, card, index) => {
      if (card === 'J') {
        acc.push(index)
      }

      return acc
    }, [])
    const lowestCard = Math.min(...handSplit.filter((card) => card !== 'J').map((card) => this.weightMap[card]))
    const jokerReplacements = []

    for (let i = 0; i < jokerIndexes.length; i++) {
      jokerReplacements.push([])

      for (const card of Object.keys(this.weightMap)) {
        if (this.weightMap[card] >= lowestCard) {
          jokerReplacements[i].push(card)
        }
      }
    }

    const permutations = this.permute(jokerReplacements)

    for (const permutation of permutations) {
      let possibleHand = [...handSplit]

      for (let index = 0; index < jokerIndexes.length; index++) {
        const jokerIndex = jokerIndexes[index];

        possibleHand[jokerIndex] = permutation[index]
      }

      possibleHands.push(possibleHand)
    }

    // unique
    possibleHands = possibleHands.filter((hand, index) => {
      return possibleHands.findIndex((hand2) => {
        return hand2.join('') === hand.join('')
      }) === index
    })

    return possibleHands
  }

  callback() {
    const hands = this.input.map((line) => {
      const [hand, bid] = line.split(' ')
      const handSplit = hand.split('')
      let strength = 0

      if (handSplit.every((card) => card === 'J')) {
        strength = 7
      } else if (handSplit.includes('J')) {
        const possibleHands = this.getPossibleHands(handSplit)

        for (const possibleHand of possibleHands) {
          const possibleStrength = this.getCardsStrength(possibleHand)

          if (possibleStrength > strength) {
            strength = possibleStrength
          }
        }
      } else {
        strength = this.getCardsStrength(handSplit)
      }

      return {
        hand,
        strength,
        bid: Number(bid),
      }
    })

    hands.sort((a, b) => {
      if (a.strength === b.strength) {
        for (let i = 0; i < 5; i++) {
          if (this.weightMap[a.hand[i]] === this.weightMap[b.hand[i]]) {
            continue
          }

          return this.weightMap[a.hand[i]] - this.weightMap[b.hand[i]]
        }
      }

      return a.strength - b.strength
    });

    return hands.reduce((acc, hand, index) => {
      return acc + (hand.bid * (index + 1))
    }, 0);
  }
}

new AdventOfCode('input').run()
