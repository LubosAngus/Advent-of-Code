import { AdventOfCode as BaseAdventOfCode } from '../../AdventOfCode.js'

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

class AdventOfCode extends BaseAdventOfCode
{
  get nearbyTickets() {
    const nearbyTickets = /nearby tickets:\n(.*)/s.exec(this.inputData)[1].split('\n').map(v => v.split(',').map(Number))
    const allValidValues = Object.values(this.validFieldsValues).reduce((accumulator, current) => [...accumulator, ...current], [])
    const ticketsToRemove = []

    for (let ticketIndex = 0; ticketIndex < nearbyTickets.length; ticketIndex++) {
      const ticket = nearbyTickets[ticketIndex]

      for (const value of ticket) {
        if (!allValidValues.includes(value)) {
          ticketsToRemove.push(ticketIndex)
        }
      }
    }

    for (const removeIndex of ticketsToRemove.reverse()) {
      nearbyTickets.splice(removeIndex, 1)
    }

    return nearbyTickets
  }

  get myTicket() {
    return /your ticket:\n(.*)/.exec(this.inputData)[1].split('\n').map(v => v.split(',').map(Number))[0]
  }

  get allTickets() {
    return [...[this.myTicket], ...this.nearbyTickets]
  }

  constructor (inputFileName) {
    super(inputFileName)

    this.validFieldsValues = []
    this.fieldsValues = []
  }

  parseInput(data) {
    this.inputData = data

    this.validFieldsValues = this.getValidValues()
    this.fieldsValues = this.getFieldsValues()
  }

  getValidValues() {
    const regex = /(.*): (.+) or (.+)/gm
    let fields = {}
    let m

    while ((m = regex.exec(this.inputData)) !== null) {
      if (m.index === regex.lastIndex) regex.lastIndex++

      let field = null
      let validFieldsValues = []

      m.forEach((match, groupIndex) => {
        if (groupIndex == 0) {}
        else if (groupIndex == 1) field = match
        else {
          const range = match.split('-')
          for (let index = parseInt(range[0]); index <= parseInt(range[1]); index++) {
            validFieldsValues.push(index)
          }
        }
      })

      fields[field] = validFieldsValues
    }

    return fields
  }

  getFieldsValues() {
    const values = []

    for (const ticket of this.nearbyTickets) {
      for (let index = 0; index < ticket.length; index++) {
        if (!values[index]) {
          values[index] = []
        }

        values[index].push(ticket[index])
      }
    }

    return values
  }

  callback() {
    const workingValues = new Array(this.fieldsValues.length)
    const finalValues = new Array(this.fieldsValues.length)

    for (let index = 0; index < workingValues.length; index++) {
      workingValues[index] = Object.keys(this.validFieldsValues)
    }

    for (let index = 0; index < this.fieldsValues.length; index++) {
      const fieldValues = this.fieldsValues[index];

      for (const fieldValue of fieldValues) {
        for (const possibleField of Object.keys(this.validFieldsValues)) {
          if (!this.validFieldsValues[possibleField].includes(fieldValue)) {
            workingValues[index].remove(possibleField)
          }
        }
      }
    }

    for (let index = 0; index < workingValues.length; index++) {
      const values = workingValues[index]

      if (values.length === 0) {
        continue
      }

      if (values.length === 1) {
        const fieldName = values[0]
        finalValues[index] = fieldName

        for (let j = 0; j < workingValues.length; j++) {
          workingValues[j] = workingValues[j].remove(fieldName)
        }
        index = -1
      }
    }

    const departureIndexes = finalValues.reduce((acc, curr, index) => {
      if (curr.includes('departure')) {
        acc.push(index)
      }

      return acc
    }, [])

    return this.myTicket.reduce((acc, curr, index) => {
      if (departureIndexes.includes(index)) {
        if (acc === 0) {
          acc = curr
        } else {
          acc = curr * acc
        }
      }

      return acc
    }, 0)
  }
}

new AdventOfCode('input').run()
