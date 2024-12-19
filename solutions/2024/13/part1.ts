import { readFileSync } from 'fs'

// const inputName = 'demo'
const inputName = 'input'

const rawData = readFileSync(`./${inputName}.txt`, 'utf-8')

type Coords = {
  x: number
  y: number
}
type Machine = {
  buttons: {
    A: Coords
    B: Coords
  }
  prize: Coords
}
type Input = Machine[]

function makeCoords(x: string | number, y: string | number): Coords {
  return { x: Number(x), y: Number(y) }
}

function parseInput(data: string): Input {
  const regexChunks = [
    'A: X\\+(?<AX>\\d+).*Y\\+(?<AY>\\d+)',
    '.*',
    'B: X\\+(?<BX>\\d+).*Y\\+(?<BY>\\d+)',
    '.*',
    'X=(?<PX>\\d+).*Y=(?<PY>\\d+)',
  ]

  return data.split('\n\n').map((item) => {
    const regex = new RegExp(regexChunks.join(''), 'gs')
    const { groups } = regex.exec(item)

    return {
      buttons: {
        A: makeCoords(groups.AX, groups.AY),
        B: makeCoords(groups.BX, groups.BY),
      },
      prize: makeCoords(groups.PX, groups.PY),
    }
  })
}

export default async (): Promise<string | number> => {
  const input = parseInput(rawData)
  const buttonsPrice = {
    A: 3,
    B: 1,
  }

  let result = 0
  for (const { prize, buttons } of input) {
    const pressedButtons = {
      A: 0,
      B: 0,
    }

    for (let i = 0; i < 100; i++) {
      if (
        prize.x % buttons.B.x === 0 &&
        prize.y % buttons.B.y === 0 &&
        prize.x / buttons.B.x === prize.y / buttons.B.y
      ) {
        pressedButtons.B = prize.x / buttons.B.x

        break
      }

      prize.x -= buttons.A.x
      prize.y -= buttons.A.y

      pressedButtons.A++
    }

    if (pressedButtons.A === 100) {
      continue
    }

    result +=
      pressedButtons.A * buttonsPrice.A + pressedButtons.B * buttonsPrice.B
  }

  return result
}
