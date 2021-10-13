import fs from 'fs'

export class AdventOfCode {
  constructor (inputFileName) {
    this.currDir = process.cwd()
    this.file = `${this.currDir}/${inputFileName}.txt`
    this.inputAsInt = false
    this.input = null
    this.result = null
  }

  parseInput(data) {
    data = data.trim().split('\n').filter(value => value)

    if (this.inputAsInt) {
      data = data.map(value => parseInt(value))
    }

    return data
  }

  callback() {
    console.table(this.input)
  }

  async run() {
    let startTime = new Date().getTime();

    await fs.readFile(this.file, 'utf8', (err, data) => {
      if (err) return console.log(err)

      this.input = this.parseInput(data)
      this.result = this.callback()

      console.log('\n')
      if (this.result !== null) {
        console.log(`\x1b[36mYour result is: \x1b[0m\x1b[45m${this.result}\x1b[0m`)
      } else {
        console.log(`\x1b[45mProvide an answer!\x1b[0m`)
      }
      let timeItTook = new Date().getTime() - startTime

      if (timeItTook < 1000) {
        timeItTook = `${timeItTook} ms`
      } else {
        timeItTook = `${Math.round((timeItTook / 1000) * 100) / 100} s`
      }

      console.log(`\x1b[36m\x1b[2m${timeItTook}\x1b[0m`);
    })
  }
}
