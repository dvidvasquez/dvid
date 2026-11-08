import { NBSP } from "@/constants/text";

export function formatPercent(value: number): string {
  return `${Math.round(value)}${NBSP}%`;
}
