import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

class AdventOfCode extends BaseAdventOfCode
{
  constructor(inputFileName) {
    super(inputFileName)
  }

  logInput() {
    console.log('\n---\n')
    console.log(this.input.map((item) => item.join('')).join('\n'))
  }

  expendEmptyRows() {
    for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
      const row = this.input[rowIndex];

      // if row doesn't contain a # then add one row after that row with the same content
      if (!row.includes('#')) {
        this.input.splice(rowIndex + 1, 0, row);

        // increment rowIndex to skip the row that was just added
        rowIndex++;
      }
    }
  }

  // now loop throught columns, if column doesn't contain a # then add one column after that column with the same content
  expandEmptyColumns() {
    for (let columnIndex = 0; columnIndex < this.input[0].length; columnIndex++) {
      let column = '';

      for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
        column += this.input[rowIndex][columnIndex];
      }

      // if column doesn't contain a # then add one column after that column with the same content
      if (!column.includes('#')) {
        for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
          this.input[rowIndex] = this.input[rowIndex].substring(0, columnIndex + 1) + this.input[rowIndex][columnIndex] + this.input[rowIndex].substring(columnIndex + 1);
        }

        // increment columnIndex to skip the column that was just added
        columnIndex++;
      }
    }
  }

  getManhattanDist(
    {x: X1, y: Y1},
    {x: X2, y: Y2}
  ) {
    let dist = Math.abs(X2 - X1) + Math.abs(Y2 - Y1);

    return dist;
  }

  // assign number to each #
  assignUniverseNumbersAndGetGalaxies() {
    const galaxies = {}

    let number = 0;
    for (let rowIndex = 0; rowIndex < this.input.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.input[rowIndex].length; columnIndex++) {
        if (this.input[rowIndex][columnIndex] === '#') {
          this.input[rowIndex][columnIndex] = ++number;
          galaxies[number] = {
            x: rowIndex,
            y: columnIndex
          }
        }
      }
    }

    return galaxies
  }

  callback() {
    console.log(this.input.join('\n'));

    this.expendEmptyRows()
    this.expandEmptyColumns()

    this.input = this.input.map(row => row.split(''));

    const galaxies = this.assignUniverseNumbersAndGetGalaxies()
    const galaxyPairs = [];

    for (let x = 1; x <= Object.keys(galaxies).length; x++) {
      for (let y = x ; y <= Object.keys(galaxies).length; y++) {
        if (x === y) {
          continue
        }

        galaxyPairs.push([x, y])
      }
    }

    let shortestPathsSum = 0
    for (const galaxyPair of galaxyPairs) {
      shortestPathsSum += this.getManhattanDist(
        galaxies[galaxyPair[0]],
        galaxies[galaxyPair[1]]
      )
    }

    return shortestPathsSum
  }
}

new AdventOfCode('input').run()
