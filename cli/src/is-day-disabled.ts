import isAfterMidnightEST from "@advent-cli-src/is-after-midnight-EST";

export default function (year: string, day: number): boolean {
  const currentYear = new Date().getFullYear().toString();

  if (year !== currentYear) {
    return false;
  }

  const currentDay = new Date().getDate();

  if (day > currentDay) {
    return true;
  }

  if (day === currentDay && !isAfterMidnightEST()) {
    return true;
  }

  return false;
}
