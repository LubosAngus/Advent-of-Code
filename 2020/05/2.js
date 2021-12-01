import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.seats = [...Array(128)].map(() => [...Array(8).keys()])
    this.skippedTrailing = false
    this.answer = false
  }

  callback() {
    this.input.forEach(instructions => {
      let rowsRange = [...Array(128).keys()]
      let colsRange = [...Array(8).keys()]

      for (let i = 0; i < instructions.length; i++) {
        const rowsHalf = Math.ceil(rowsRange.length / 2)
        const colsHalf = Math.ceil(colsRange.length / 2)

        switch (instructions[i]) {
          case 'F':
          rowsRange = rowsRange.splice(0, rowsHalf)
          break

          case 'B':
          rowsRange = rowsRange.splice(-rowsHalf)
          break

          case 'L':
          colsRange = colsRange.splice(0, colsHalf)
          break

          case 'R':
          colsRange = colsRange.splice(-colsHalf)
          break
        }
      }

      const id = rowsRange[0] * 8 + colsRange[0]

      console.log(`row ${String(rowsRange[0]).padEnd(8, ' ')}col ${String(colsRange[0]).padEnd(8, ' ')}ID ${id}`)
      delete this.seats[rowsRange[0]][colsRange[0]]
    })

    for (let i = 0; i < this.seats.length; i++) {
      for (let j = 0; j < this.seats[i].length; j++) {
        const isTaken = typeof this.seats[i][j] === 'undefined'
        if (isTaken) this.skippedTrailing = true

        if (this.skippedTrailing && !isTaken) {
          this.answer = i * 8 + j

          break
        }
      }

      if (this.answer) break
    }

    console.log(''.padEnd(30,'-'))
    return this.answer
  }
}

new AdventOfCode('input').run()
