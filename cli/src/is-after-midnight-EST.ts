export default function (): boolean {
  const now = new Date();

  const offset = -4;
  const estTime = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours() + offset,
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  // Check if it's after midnight EST
  return estTime.getUTCDate() >= now.getUTCDate();
}
