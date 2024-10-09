import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

type Spring = "." | "#"
type BrokenSpring = Spring | "?"
type Springs = Spring[]
type BrokenSprings = BrokenSpring[]

type Backup = number
type Backups = Backup[]

const DEBUG = false

function log(action, ...args) {
  if (!DEBUG) {
    return
  }

  console[action](...args)
}

function logDebugShit({
  finalArrangement,
  brokenSprings,
  index,
  backups,
  backupIndex,
}: {
  finalArrangement: Springs
  brokenSprings: BrokenSprings
  index: number
  backups: Backups
  backupIndex: number
}) {
  log("log", finalArrangement.join(""))
  log(
    "log",
    brokenSprings
      .map((item, i) => (i === index ? `\x1b[46m${item}\x1b[0m` : item))
      .join(""),
  )
  log("table", {
    "index": index,
    "backups left": backups.slice(backupIndex).join(","),
  })
}

function isArrangementComplete(
  finalArrangement: Springs,
  brokenSprings: BrokenSprings,
  operationalSpringsCount: number,
) {
  if (finalArrangement.length !== brokenSprings.length) {
    return false
  }

  for (const spring of finalArrangement) {
    if (spring !== "#") continue

    operationalSpringsCount--
  }

  if (operationalSpringsCount !== 0) {
    return false
  }

  return true
}

function isArrangementValid(
  finalArrangement: Springs,
  brokenSprings: BrokenSprings,
  backups: Backups,
  backupIndex: number,
  operationalSpringsCount: number,
) {
  const minRequiredSpace = getMinimumRequiredSpace(backups, backupIndex)
  const availableSpace = brokenSprings.length + 1
  const spaceLeft = availableSpace - finalArrangement.length

  log("log", "isArrangementValid")
  log("table", {
    "finalArrangement": finalArrangement.join(""),
    "avail space": availableSpace,
    "min req space": minRequiredSpace,
    "space left": spaceLeft,
    "left - req": spaceLeft - minRequiredSpace,
  })

  if (
    finalArrangement.length > brokenSprings.length ||
    spaceLeft - minRequiredSpace < 0
  ) {
    return false
  }

  for (let i = 0; i < finalArrangement.length; i++) {
    if (finalArrangement[i] === "#") {
      operationalSpringsCount--
    }

    if (operationalSpringsCount < 0) {
      return false
    }
  }

  return true
}

function getMinimumRequiredSpace(
  backups: Backups,
  backupIndex: number,
): number {
  const backupsLeft = backups.slice(backupIndex)
  const result = backupsLeft.reduce((partialSum, a, index) => {
    if (index > 0) {
      partialSum++
    }

    return partialSum + a
  }, 0)

  return result
}

class AdventOfCode extends BaseAdventOfCode {
  input: string[]

  constructor(inputFileName) {
    super(inputFileName)
  }

  findArrangements(
    brokenSprings: BrokenSprings,
    backups: Backups,
    possibleValues: Spring[],
  ) {
    const result: Set<string> = new Set()
    const operationalSpringsCount = backups.reduce((acc, item) => acc + item, 0)

    function backtrack(
      finalArrangement: Springs,
      backupIndex: number,
      index: number,
    ) {
      finalArrangement = [...finalArrangement]

      log("log", "\n-- BACKTRACK START ".padEnd(30, "-"))

      const currentBrokenSpring = brokenSprings[index]
      const currentBackup = backups[backupIndex]

      if (currentBackup === undefined) {
        log("log", "-- NO BACKUPS LEFT ".padEnd(30, "-"))

        for (let i = finalArrangement.length; i < brokenSprings.length; i++) {
          if (brokenSprings[i] === "?") {
            finalArrangement[i] = "."

            continue
          }

          finalArrangement[i] = brokenSprings[i] as Spring
        }
      }

      logDebugShit({
        finalArrangement,
        brokenSprings,
        backups,
        index,
        backupIndex,
      })

      const isComplete = isArrangementComplete(
        finalArrangement,
        brokenSprings,
        operationalSpringsCount,
      )

      if (isComplete) {
        log("log", "-- IS COMPLETE ".padEnd(30, "-"))
        log("log", finalArrangement.join(""))

        result.add(finalArrangement.join(""))

        return
      }

      const isValid = isArrangementValid(
        finalArrangement,
        brokenSprings,
        backups,
        backupIndex,
        operationalSpringsCount,
      )

      if (!isValid) {
        log("log", "-- RETURN IS NOT VALID ".padEnd(30, "-"))
        log("log", finalArrangement.join(""))

        return
      }

      for (const possibleValue of possibleValues) {
        if (currentBrokenSpring === "." && possibleValue === "#") {
          continue
        }

        if (currentBrokenSpring === "#" && possibleValue === ".") {
          continue
        }

        if (possibleValue === "#") {
          let canBePlaced = true
          for (let i = 1; i < currentBackup; i++) {
            if (brokenSprings[index + i] === ".") {
              canBePlaced = false
              break
            }
          }

          if (brokenSprings[index + currentBackup] === "#") {
            canBePlaced = false
          }

          if (finalArrangement[index - 1] === "#") {
            canBePlaced = false
          }

          if (!canBePlaced) {
            continue
          }

          for (let i = 0; i < currentBackup; i++) {
            finalArrangement[index + i] = "#"
          }

          backupIndex++
          index = index + currentBackup
        } else {
          finalArrangement[index] = possibleValue
          index = index + 1
        }

        backtrack(finalArrangement, backupIndex, index)

        if (possibleValue === "#") {
          backupIndex--
          index = index - currentBackup
        } else {
          index = index - 1
        }

        finalArrangement.splice(index)
      }
    }

    backtrack([], 0, 0)

    return [...result]
  }

  callback() {
    if (DEBUG) {
      const j = 4
      for (let i = 0; i < j; i++) {
        this.input.shift()
      }
    }

    const allArrangements = [] as string[][]
    for (let i = 0; i < this.input.length; i++) {
      const row = this.input[i]
      const rowSplit = row.split(" ")
      const springs = rowSplit[0].split("") as BrokenSprings
      const backups = rowSplit[1].split(",").map(Number) as Backups

      const result = this.findArrangements(springs, backups, [".", "#"])

      allArrangements.push(result)

      if (DEBUG) {
        break
      }
    }

    log("log", "\n" + "-- ALL RESULT ".padEnd(30, "-"))
    log("log", JSON.stringify(allArrangements, null, 2))

    return allArrangements.reduce(
      (acc, arrangements) => acc + arrangements.length,
      0,
    )
  }
}

new AdventOfCode("input").run()
