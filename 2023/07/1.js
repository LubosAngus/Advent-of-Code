import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.weightMap = {
      A: 14,
      K: 13,
      Q: 12,
      J: 11,
      T: 10,
      9: 9,
      8: 8,
      7: 7,
      6: 6,
      5: 5,
      4: 4,
      3: 3,
      2: 2,
    }
  }

  getRank(cardsCount) {
    const cardValues = Object.values(cardsCount)

    // Five of a kind
    if (cardValues.includes(5)) return 7

    // Four of a kind
    if (cardValues.includes(4)) return 6

    // Full house
    if (cardValues.includes(3) && cardValues.includes(2)) return 5

    // Three of a kind
    if (cardValues.includes(3)) return 4

    // Two pairs
    if (cardValues.filter((value) => value === 2).length === 2) return 3

    // One pair
    if (cardValues.includes(2)) return 2

    return 1
  }

  getCardsRank(handSplit) {
    const cardsCount = handSplit.reduce((acc, card) => {
      if (acc[card] === undefined) {
        acc[card] = 0
      }

      acc[card]++

      return acc
    }, {})

    return this.getRank(cardsCount)
  }

  callback() {
    const hands = this.input.map((line) => {
      const [hand, bid] = line.split(" ")
      const handSplit = hand.split("")
      const rank = this.getCardsRank(handSplit)

      return {
        hand,
        rank,
        bid: Number(bid),
      }
    })

    hands.sort((a, b) => {
      if (a.rank === b.rank) {
        for (let i = 0; i < 5; i++) {
          if (this.weightMap[a.hand[i]] === this.weightMap[b.hand[i]]) {
            continue
          }

          return this.weightMap[a.hand[i]] - this.weightMap[b.hand[i]]
        }
      }

      return a.rank - b.rank
    })

    return hands.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0)
  }
}

new AdventOfCode("input").run()
