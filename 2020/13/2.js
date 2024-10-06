import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.stepSize = 0
    this.answer = false
    this.halt = false
    this.logged = []
  }

  parseInput(data) {
    data = data.trim().split("\n")

    // return [17,NaN,13,19] // 3417.
    // return [67,7,59,61] // 754018.
    // return [67,NaN,7,59,61] // 779210.
    // return [67,7,NaN,59,61] // 1261476.
    // return [1789,37,47,1889] // 1202161486.
    // return [7,13,NaN,NaN,59,NaN,31,19] // 1068781.

    return data[1]
      .split(",")
      .filter((value) => value)
      .map(Number)
  }

  getLcm(numbers) {
    const gcd = (a, b) => (a ? gcd(b % a, a) : b)
    const lcm = (a, b) => (a * b) / gcd(a, b)
    const result = numbers.reduce(lcm)

    return result
  }

  clog(isFirst = false, timestamp = this.timestamp) {
    return false

    /* eslint no-unreachable: 0 */
    const lng = 6
    let toLog = ""

    if (this.logged[timestamp]) return

    if (isFirst) {
      toLog += "time".padEnd(lng, " ")
    } else {
      toLog += timestamp.toString().padEnd(lng, " ")
    }

    for (const bus of this.input) {
      toLog += "\x1b[32m "

      if (isFirst) {
        toLog += isNaN(bus) ? "- " : bus.toString().padEnd(2, " ")
      } else {
        toLog += isNaN(bus)
          ? "\x1b[2m\x1b[31m. \x1b[0m\x1b[36m"
          : (timestamp % bus === 0 ? "D" : ".").padEnd(2, " ")
      }
    }

    if (isFirst) {
      toLog += "\n"
    } else {
      toLog += ` | ${this.stepSize}`
    }

    toLog += "\x1b[0m"

    this.logged[timestamp] = true
    console.log(toLog)
  }

  isLastBus(index) {
    return this.input.length - 1 === index
  }

  isThisCorrectTimestamp(timestamp, busIndex, lvl) {
    const bus = this.input[busIndex]
    this.opcount++

    this.clog(false, timestamp)

    if (!isNaN(bus)) {
      if (timestamp % bus !== 0) return false
      if (this.isLastBus(busIndex)) return true

      this.stepSize = this.getLcm([this.stepSize, bus])
    }

    return this.isThisCorrectTimestamp(++timestamp, ++busIndex, lvl + 1)
  }

  callback() {
    this.timestamp = 0
    this.stepSize = 1

    this.clog(true)
    do {
      this.answer = this.isThisCorrectTimestamp(this.timestamp, 0, 0)

      if (this.answer) {
        this.answer = this.timestamp
        this.halt = true
      }

      this.timestamp += this.stepSize
    } while (!this.halt)

    console.log(this.opcount)

    return this.answer
  }
}

new AdventOfCode("input").run()
