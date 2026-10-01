type ParticleCountOptions = {
  areaPerParticle?: number;
  min?: number;
  max?: number;
};

export function getParticleCount(
  width: number,
  height: number,
  { areaPerParticle = 4500, min = 24, max = 160 }: ParticleCountOptions = {},
): number {
  if (width <= 0 || height <= 0) return 0;

  const count = Math.round((width * height) / areaPerParticle);
  return Math.min(max, Math.max(min, count));
}
