export const MEDIA_BUCKET = "media";

export function getPublicMediaUrl(path: string): string {
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL no esta definido");
  }

  return `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}
