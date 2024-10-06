import { AdventOfCode as BaseAdventOfCode } from "../../AdventOfCode.ts"

class AdventOfCode extends BaseAdventOfCode {
  constructor(inputFileName) {
    super(inputFileName)

    this.rules = []
    this.validMessages = []
    this.messages = []
  }

  parseInput(data) {
    data = data.split(/\n\n/)
    this.messages = data[1].split(/\n/)

    for (const rule of data[0].split(/\n/)) {
      const ruleParsed = /(\d+): (.+)/.exec(rule)
      const ruleIndex = ruleParsed[1]
      let ruleValue = ruleParsed[2].split(" | ")

      if (isNaN(parseInt(ruleValue[0]))) {
        ruleValue = ruleValue[0].replace(/"/g, "")
      } else {
        ruleValue = ruleValue.map((val) => val.split(" ").map(Number))
      }

      this.rules[ruleIndex] = ruleValue
    }
  }

  getCombinations(array) {
    if (typeof array === "string") return array

    let allCombinations = this.getCombinations(array[0])
    for (let index = 1; index < array.length; index++) {
      const tmp0 = []
      const currentCombinations = this.getCombinations(array[index])

      if (typeof allCombinations === "string") {
        if (typeof currentCombinations === "string") {
          tmp0.push(`${allCombinations}${currentCombinations}`)
        } else {
          currentCombinations.forEach((tmp2) => {
            tmp0.push(`${allCombinations}${tmp2}`)
          })
        }
      } else {
        allCombinations.forEach((tmp1) => {
          if (typeof currentCombinations === "string") {
            tmp0.push(`${tmp1}${currentCombinations}`)
          } else {
            currentCombinations.forEach((tmp2) => {
              tmp0.push(`${tmp1}${tmp2}`)
            })
          }
        })
      }
      // tmp0.push(`${tmp1}${tmp2}`)

      // allCombinations.forEach(tmp1 => {
      //   currentCombinations.forEach(tmp2 => {
      //     tmp0.push(`${tmp1}${tmp2}`)
      //   })
      // })

      console.log("---")
      console.log(tmp0)
      console.log(allCombinations)
      console.log(typeof currentCombinations)
      // console.log('. .');
      allCombinations = tmp0
      // console.log(allCombinations)
    }

    // console.log('\n');
    // console.log(allCombinations)

    // for (const lol1 of lol) {
    //   for (const lol2 of tmp2[index]) {
    //     if (typeof lol2 === 'string') {
    //       tmpp.push(`${lol1}${lol2}`)
    //     } else {
    //       for (const lol3 of lol2) {
    //         tmpp.push(`${lol1}${lol3}`)
    //       }
    //     }
    //   }
    // }

    return allCombinations
  }

  getRuleValue(rule) {
    if (typeof rule === "string") {
      return rule
    } else if (typeof rule === "number") {
      return this.getRuleValue(this.getRuleOnIndex(rule))
    }

    const tmp = []

    if (typeof rule === "object") {
      for (const ruleGroup of rule) {
        const tmp2 = []

        for (const ruleIndex of ruleGroup) {
          tmp2.push(this.getRuleValue(this.getRuleOnIndex(ruleIndex)))
        }

        tmp.push(tmp2)
      }
    }

    return tmp
  }

  getRuleOnIndex(index) {
    return this.rules[index]
  }

  buildRules() {
    const rules = this.getCombinations(
      this.getRuleValue(this.getRuleOnIndex(0))[0],
    )
    console.log("\n")
    console.log(rules)

    // let lol = tmp2[0]
    // for (let index = 1; index < tmp2.length; index++) {
    //   let tmpp = []

    //   for (const lol1 of lol) {
    //     console.log(this.getCombinations(lol, lol1, []))

    //     for (const lol2 of tmp2[index]) {
    //       if (typeof lol2 === 'string') {
    //         tmpp.push(`${lol1}${lol2}`)
    //       } else {
    //         for (const lol3 of lol2) {
    //           tmpp.push(`${lol1}${lol3}`)
    //         }
    //       }
    //     }
    //   }

    //   lol = tmpp
    // }
  }

  callback() {
    // const rules = this.buildRules()

    return "NULL"
  }
}

let inputName = "demo_lite2"
// inputName = 'demo'
// inputName = 'input'

new AdventOfCode(inputName).run()
