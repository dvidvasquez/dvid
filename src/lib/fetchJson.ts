export type FetchJsonInit = RequestInit & { timeoutMs?: number };

const DEFAULT_TIMEOUT_MS = 15_000;

/** `fetch` + JSON con tiempo limite. Lanza si la respuesta no es 2xx o si se agota el tiempo. */
export async function fetchJson(url: string, init: FetchJsonInit = {}): Promise<unknown> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...rest, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
