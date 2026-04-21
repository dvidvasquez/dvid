export function getRelativeTimeLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return "Hace unos minutos";
  if (hours < 24) return `Hace ${hours} horas`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Ayer";
  return `Hace ${days} dias`;
}
