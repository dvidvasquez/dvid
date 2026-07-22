import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "../src/lib/supabaseStorage";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets.some((bucket) => bucket.name === MEDIA_BUCKET)) {
    console.log(`El bucket "${MEDIA_BUCKET}" ya existe.`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(MEDIA_BUCKET, {
    public: true,
  });
  if (createError) throw createError;

  console.log(`Bucket "${MEDIA_BUCKET}" creado como publico.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
