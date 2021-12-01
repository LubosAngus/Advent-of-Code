import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor (inputFileName) {
    super(inputFileName)

    this.answer = null
  }

  callback() {
    this.input.forEach(instructions => {
      let rowsRange = [...Array(128).keys()]
      let colsRange = [...Array(8).keys()]

      console.log(instructions);

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
      if (id > this.answer) this.answer = id

      console.log(`row ${String(rowsRange[0]).padEnd(8, ' ')}col ${String(colsRange[0]).padEnd(8, ' ')}ID ${id}`)
    })

    console.log(''.padEnd(30,'-'))

    return this.answer
  }
}

new AdventOfCode('demo').run()
