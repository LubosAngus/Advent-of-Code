import { readFileSync } from 'fs'

const inputName = 'demo'
// const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Input = string[][]

function parseInput(data: string): Input {
  return data.split('\n').map((row) => row.split(''))
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  console.log(input)

  return ''
}
