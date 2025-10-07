import { adminClient } from "../_supabase";
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const ctype = req.headers.get("content-type") || "";
  if (!ctype.includes("multipart/form-data")) {
    return new Response("Unsupported Media Type", { status: 415 });
  }

  const form = await req.formData();
  const id = form.get("id") as string;
  const editToken = form.get("editToken") as string;
  const file = form.get("file") as File | null;

  if (!id || !editToken || !file) {
    return new Response(JSON.stringify({ error: "missing id/editToken/file" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const supa = adminClient();

  // check token + fetch public_id
  const { data: report, error: e1 } = await supa
    .from("damage_reports")
    .select("id, public_id, edit_token")
    .eq("id", id)
    .single();

  if (e1 || !report) return new Response("Not Found", { status: 404 });
  if (report.edit_token !== editToken) return new Response("Forbidden", { status: 403 });

  const bucket = "claim-uploads";
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const objectName = `${report.public_id}/${crypto.randomUUID()}.${ext}`;

  // size guard
  const maxMb = Number(process.env.MAX_UPLOAD_MB || 20);
  if (file.size > maxMb * 1024 * 1024) {
    return new Response(JSON.stringify({ error: `File too large (> ${maxMb} MB)` }), {
      status: 413, headers: { "Content-Type": "application/json" }
    });
  }

  // ✅ entscheidend: File/Blob DIREKT an upload() geben (kein ArrayBuffer)
  const { data: upRes, error: upErr } = await supa.storage
    .from(bucket)
    .upload(objectName, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (upErr) {
    return new Response(JSON.stringify({ error: upErr.message, hint: "storage_upload_failed" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  // signierte URL (7 Tage)
  const { data: signed, error: signErr } = await supa.storage
    .from(bucket)
    .createSignedUrl(objectName, 60 * 60 * 24 * 7);

  if (signErr) {
    return new Response(JSON.stringify({ error: signErr.message, hint: "signed_url_failed" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  // DB-Eintrag
  const { data: rf, error: insErr } = await supa
    .from("report_files")
    .insert({
      report_id: report.id,
      storage_path: objectName,
      mime: file.type,
      filename: file.name,
      size_bytes: file.size,
    })
    .select("id, storage_path, mime, filename, size_bytes, created_at")
    .single();

  if (insErr) {
    return new Response(JSON.stringify({ error: insErr.message, hint: "insert_file_row_failed" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ file: rf, url: signed?.signedUrl, path: upRes?.path }), {
    headers: { "Content-Type": "application/json" }
  });
}
