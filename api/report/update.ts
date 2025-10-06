import { adminClient } from "../_supabase";
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { id, editToken, patch } = await req.json();
  if (!id || !editToken || !patch) return new Response("Bad Request", { status: 400 });

  const supa = adminClient();

  // verify edit token
  const { data: report, error: e1 } = await supa
    .from("damage_reports")
    .select("id, edit_token")
    .eq("id", id)
    .single();

  if (e1 || !report) return new Response("Not Found", { status: 404 });
  if (report.edit_token !== editToken) return new Response("Forbidden", { status: 403 });

  const { data, error } = await supa
    .from("damage_reports")
    .update(patch)
    .eq("id", id)
    .select("id, public_id, status, updated_at")
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
