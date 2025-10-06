import { adminClient } from "../_supabase";
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) return new Response("Bad Request", { status: 400 });

  const supa = adminClient();
  const { data, error } = await supa.storage.from("claim-uploads").createSignedUrl(path, 60 * 60);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ url: data?.signedUrl }), {
    headers: { "Content-Type": "application/json" },
  });
}
