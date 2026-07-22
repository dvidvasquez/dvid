import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { MEDIA_BUCKET, getPublicMediaUrl } from "../src/lib/supabaseStorage";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env");
}

const [localPath, destinationPath] = process.argv.slice(2);

if (!localPath || !destinationPath) {
  console.error("Uso: npm run storage:upload -- <archivo-local> <ruta-en-bucket>");
  console.error("Ejemplo: npm run storage:upload -- ./avatar.jpg profile/avatar.jpg");
  process.exit(1);
}

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const contentType = CONTENT_TYPES[extname(localPath).toLowerCase()];

if (!contentType) {
  throw new Error(`Extension no soportada: ${extname(localPath)}`);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const file = readFileSync(localPath);

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(destinationPath, file, { contentType, upsert: true });

  if (error) throw error;

  console.log(getPublicMediaUrl(destinationPath));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
