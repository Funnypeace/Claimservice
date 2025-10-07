import { adminClient } from "../_supabase";
export const config = { runtime: "edge" };
// akzeptiert "YYYY-MM-DD" oder "DD.MM.YYYY" oder Date-kompatible Werte
function toISODate(v: any): string | null {
  if (!v) return null;
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v; // ISO
    const m = v.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/); // DD.MM.YYYY
    if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
export default async function handler(req: Request) {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
    const body = await req.json().catch(() => ({} as any));

    // WICHTIG: KEIN status hier setzen -> DB-Default 'draft' greift
    const payload: any = {
      incident_date: toISODate(body.incident_date),
      damage_description: body.damage_description ?? null,
      policyholder: body.policyholder ?? null,
      vehicle: body.vehicle ?? null,
      extra: body.extra ?? null,
    };

    const supa = adminClient();
    const { data, error } = await supa
      .from("damage_reports")
      .insert([payload])
      .select("id, public_id, edit_token")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message, hint: "create_insert_failed" }), {
        status: 500, headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ id: data.id, publicId: data.public_id, editToken: data.edit_token }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e), hint: "create_unhandled" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
