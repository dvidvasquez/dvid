import { NBSP } from "@/constants/text";
import { formatDecimal } from "./formatDecimal";

export function formatMillimeters(value: number): string {
  return `${formatDecimal(value)}${NBSP}mm`;
}
