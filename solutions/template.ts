import { readFileSync } from 'fs'

// const inputName = 'demo1'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

function parseInput(data: string) {
  return data.split('\n').map((row) => row.split(' ').map(Number))
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)

  console.log(input)

  return ''
}
