// Fecha mal formada que publica JBusinessDirectory (p. ej. Infolocal Comfenalco): la `T` del formato
// de PHP sale como la zona ("UTC") y los minutos salen como el numero del mes: "2026-11-06UTC20:11:00".
const BROKEN_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[A-Za-z]{2,5}(\d{2}):(\d{2}):(\d{2})$/;
const CLOCK_12H = /\b(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\b/i;

/**
 * Arregla una fecha con hora en el formato roto descrito arriba. La hora es la correcta (en hora
 * local) pero los minutos no: se toman de la primera hora «06:30 PM» del texto visible del evento
 * si coincide con la hora de la fecha; si no, se dejan en `00` cuando son el numero del mes.
 * Cualquier otro valor se devuelve igual.
 */
export function repairBrokenDateTime(value: string, visibleText: string): string {
  const match = value.trim().match(BROKEN_DATE_TIME);
  if (!match) return value;

  const [, year, month, day, hour, minute, second] = match;
  const clock = visibleText.match(CLOCK_12H);
  let minutes = minute;

  if (clock) {
    const clockHour = (Number(clock[1]) % 12) + (clock[3].toLowerCase() === "p" ? 12 : 0);
    if (clockHour === Number(hour)) minutes = clock[2];
    else if (minute === month) minutes = "00";
  } else if (minute === month) {
    minutes = "00";
  }

  return `${year}-${month}-${day}T${hour}:${minutes}:${second}`;
}
