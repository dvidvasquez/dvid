/** Solo deja pasar URLs `https://`; cualquier otra cosa (javascript:, data:, relativa) da `null`. */
export function toSafeHttpsUrl(value: unknown): string | null {
  return typeof value === "string" && /^https:\/\//i.test(value) ? value : null;
}
