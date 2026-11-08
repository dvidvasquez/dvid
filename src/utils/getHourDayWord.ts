/** `Hoy` si `time` cae el mismo dia que `first`, si no `Mañana`. */
export function getHourDayWord(first: string, time: string): string {
  return first.slice(0, 10) === time.slice(0, 10) ? "Hoy" : "Mañana";
}
