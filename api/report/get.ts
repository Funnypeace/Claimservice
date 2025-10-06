import { adminClient } from "../_supabase";
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const publicId = searchParams.get("publicId");
  if (!publicId) return new Response("Bad Request", { status: 400 });

  const supa = adminClient();

  const { data: report, error } = await supa
    .from("damage_reports")
    .select("id, public_id, status, incident_date, damage_description, policyholder, vehicle, extra, created_at, updated_at")
    .eq("public_id", publicId)
    .single();

  if (error || !report) return new Response("Not Found", { status: 404 });

  const { data: files } = await supa
    .from("report_files")
    .select("id, storage_path, mime, filename, size_bytes, created_at")
    .eq("report_id", report.id)
    .order("created_at", { ascending: true });

  return new Response(
    JSON.stringify({ report, files }),
    { headers: { "Content-Type": "application/json" } }
  );
}
