import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.shortestWaitTime = {
      time: null,
      bus: null,
    }
  }

  parseInput(data) {
    data = data.trim().split("\n")

    this.arriveTime = parseInt(data[0])
    this.buses = data[1]
      .split(",")
      .filter((value) => value && value !== "x")
      .map(Number)
  }

  busWaitTime(arriveTime, bus) {
    return Math.ceil(arriveTime / bus) * bus - arriveTime
  }

  callback() {
    for (const bus of this.buses) {
      const waitTime = this.busWaitTime(this.arriveTime, bus)

      if (
        waitTime < this.shortestWaitTime.time ||
        this.shortestWaitTime.time === null
      ) {
        this.shortestWaitTime.bus = bus
        this.shortestWaitTime.time = waitTime
      }
    }

    return this.shortestWaitTime.bus * this.shortestWaitTime.time
  }
}

new AdventOfCode("input").run()
