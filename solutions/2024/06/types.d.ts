export type Input = string[][]
export type Coordinates = {
  row: number
  col: number
}
export type GuardDirection = '^' | '>' | 'v' | '<'
export type GuardCoordinates = Coordinates & {
  direction: GuardDirection
}
export type ViewportSize = {
  width: number
  height: number
}
