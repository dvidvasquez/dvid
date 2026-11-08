export type LocalTime = { year: number; month: number; day: number; hour: number; minute: number };

/** Lee `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm` tal cual (hora local), sin pasar por `Date` ni zonas horarias. */
export function parseLocalTime(value: string): LocalTime {
  const [date = "", time = "00:00"] = value.split("T");
  const [year = 0, month = 0, day = 0] = date.split("-").map(Number);
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  return { year, month, day, hour, minute };
}
