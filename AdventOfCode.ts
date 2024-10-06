import { promises as fs } from "fs"

export class AdventOfCode {
  private currDir: string
  private file: string
  private inputAsInt: boolean
  private result: unknown

  input: unknown

  constructor(inputFileName: string) {
    this.currDir = process.cwd()
    this.file = `${this.currDir}/${inputFileName}.txt`
    this.inputAsInt = false
    this.result = null

    this.input = []
  }

  parseInput(data: string): string[] | number[] {
    // Split by new line, remove empty lines, macos / windows / linux
    const parsedData = data.trim().split(/\r?\n/).filter(Boolean)

    if (this.inputAsInt) {
      return parsedData.map((value) => parseInt(value, 10))
    }

    return parsedData
  }

  callback(): void {
    console.table(this.input)
  }

  async run(): Promise<void> {
    const startTime = new Date().getTime()

    try {
      const data = await fs.readFile(this.file, "utf8")
      this.input = this.parseInput(data)
      this.result = this.callback()

      console.log("\n")
      if (this.result !== null) {
        console.log(
          `\x1b[36mYour result is: \x1b[0m\x1b[45m${this.result}\x1b[0m`,
        )
      } else {
        console.log(`\x1b[45mProvide an answer!\x1b[0m`)
      }

      let timeItTook: string | number = new Date().getTime() - startTime
      if (timeItTook < 1000) {
        timeItTook = `${timeItTook} ms`
      } else {
        timeItTook = `${Math.round((timeItTook / 1000) * 100) / 100} s`
      }

      console.log(`\x1b[36m\x1b[2m${timeItTook}\x1b[0m`)
    } catch (err) {
      console.error(err)
    }
  }
}
