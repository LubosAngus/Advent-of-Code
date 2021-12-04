import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class Board
{
  static coordsStringify(coords) {
    return coords.join(',')
  }

  static coordsParse(coords) {
    return coords.split(',')
  }

  constructor(board) {
    this.hasBingo = false
    this.score = null
    this.markedRows = Array.from(new Array(5), () => [])
    this.markedColumns = Array.from(new Array(5), () => [])
    this.board = board.replaceAll('  ', ' ').split('\n').map((row) => {
      return row.trim().split(' ').map(Number)
    }).reduce((accumulator, row, rowIndex) => {
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        accumulator[row[colIndex]] = Board.coordsStringify([rowIndex, colIndex])
      }

      return accumulator
    }, {})
  }

  /**
   * Mark next bingo number
   *
   * @param {(string|number)} number
   * @returns {boolean} Returns true if board has BINGO
   */
  markNumber(number) {
    if (!this.board[number]) return false

    const [row, col] = Board.coordsParse(this.board[number])

    this.markedRows[row].push(number)
    this.markedColumns[col].push(number)

    delete this.board[number]

    this.hasBingo = this.markedRows[row].length === 5 || this.markedColumns[col].length === 5

    if (this.hasBingo) {
      this.calculateScore(number)
    }

    return this.hasBingo
  }

  calculateScore(drawnNumber) {
    const unmarkedSum = Object.keys(this.board).reduce((sum, number) => (sum + parseInt(number)), 0)

    this.score = unmarkedSum * drawnNumber
  }
}

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)

    this.numbers = null
    this.boards = null
  }

  parseInput(data) {
    let { numbers, boards } = /(?<numbers>^.*?\n)\n(?<boards>.*)/gs.exec(data).groups

    this.numbers = numbers.split(',').map(Number)
    this.boards = boards.split(/\n\n/).map((board) => {
      return new Board(board)
    })
  }

  callback() {
    let winningBoard = null

    drawingLoop:
    for (const drawnNumber of this.numbers) {
      for (const board of this.boards) {
        const hasBingo = board.markNumber(drawnNumber)

        if (hasBingo) {
          winningBoard = board

          break drawingLoop
        }
      }
    }

    return winningBoard.score
  }
}

new AdventOfCode('input').run()
