export default (str: string, length: number): string => {
  return str.length + 3 > length ? `${str.slice(0, length - 1)}...` : str
}
