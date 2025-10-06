export async function createReport(data: any) {
  const res = await fetch('/api/report/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`create failed: ${res.status} ${t}`);
  }
  return res.json();
}
export async function updateReport(id: string, editToken: string, patch: any) {
  const res = await fetch('/api/report/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, editToken, patch }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`update failed: ${res.status} ${t}`);
  }
  return res.json();
}
export async function getReport(publicId: string) {
  const res = await fetch(`/api/report/get?publicId=${encodeURIComponent(publicId)}`);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`get failed: ${res.status} ${t}`);
  }
  return res.json();
}
export async function uploadFile(id: string, editToken: string, file: File) {
  const form = new FormData();
  form.append('id', id);
  form.append('editToken', editToken);
  form.append('file', file);
  
  const res = await fetch('/api/report/upload', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`upload failed: ${res.status} ${t}`);
  }
  return res.json();
}
export async function getFileUrl(path: string) {
  const res = await fetch(`/api/report/file-url?path=${encodeURIComponent(path)}`);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`get file URL failed: ${res.status} ${t}`);
  }
  return res.json();
}
