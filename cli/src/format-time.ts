export default function (time: number): string {
  if (time < 1) return `${Math.round(time * 1000) / 1000} ms`
  if (time < 10) return `${Math.round(time * 100) / 100} ms`
  if (time < 100) return `${Math.round(time * 10) / 10} ms`
  if (time < 1000) return `${Math.round(time)} ms`

  return `${Math.round((time / 1000) * 100) / 100} s`
}
