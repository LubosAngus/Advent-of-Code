export default (): number[] => {
  const firstAdventOfCodeYear = 2015
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const years = [] as number[]

  for (let year = currentYear; year >= firstAdventOfCodeYear; year--) {
    // If it's not december yet current year, skip this year
    if (year === currentYear && currentMonth < 12) {
      continue
    }

    years.push(year)
  }

  return years
}
