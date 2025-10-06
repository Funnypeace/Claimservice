import { adminClient } from "../_supabase";
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const body = await req.json().catch(() => ({} as any));
  const { status = "draft", incident_date, damage_description, policyholder, vehicle, extra } = body;

  const supa = adminClient();
  const { data, error } = await supa
    .from("damage_reports")
    .insert([{ status, incident_date, damage_description, policyholder, vehicle, extra }])
    .select("id, public_id, edit_token")
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(
    JSON.stringify({ id: data.id, publicId: data.public_id, editToken: data.edit_token }),
    { headers: { "Content-Type": "application/json" } }
  );
}
