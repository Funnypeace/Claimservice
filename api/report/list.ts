import { adminClient } from "../_supabase";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const supa = adminClient();
    let query = supa
      .from("damage_reports")
      .select("id, public_id, status, incident_date, damage_description, policyholder, vehicle, created_at, updated_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    const { data: reports, error, count } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, hint: "list_query_failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ reports: reports || [], total: count || 0, limit, offset }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: String(e?.message || e), hint: "list_unhandled" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
