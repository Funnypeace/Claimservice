/**
 * API Helper for Claimservice
 * Provides functions for creating, updating, retrieving, and listing reports
 */

// ============================================================================
// Report Creation
// ============================================================================

/**
 * Create a new report
 * @param data - Report data
 * @returns Promise with created report data including id and editToken
 */
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

// Alias for consistency
export const create = createReport;

// ============================================================================
// Report Updates
// ============================================================================

/**
 * Update an existing report
 * @param id - Report ID
 * @param editToken - Edit token for authorization
 * @param patch - Partial data to update
 * @returns Promise with updated report data
 */
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

// Alias for consistency
export const update = updateReport;

// ============================================================================
// Report Retrieval
// ============================================================================

/**
 * Get a single report by public ID
 * @param publicId - Public ID of the report
 * @returns Promise with report data
 */
export async function getReport(publicId: string) {
  const res = await fetch(`/api/report/get?publicId=${encodeURIComponent(publicId)}`);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`get failed: ${res.status} ${t}`);
  }
  return res.json();
}

// Alias for consistency
export const get = getReport;

/**
 * List reports with optional filters
 * @param filters - Optional filters (e.g., { claimNumber, dateFrom, dateTo, status })
 * @returns Promise with array of reports
 */
export async function listReports(filters?: any) {
  const params = new URLSearchParams();
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] != null) {
        params.append(key, String(filters[key]));
      }
    });
  }
  
  const url = params.toString() 
    ? `/api/report/list?${params.toString()}`
    : '/api/report/list';
  
  const res = await fetch(url);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`list failed: ${res.status} ${t}`);
  }
  return res.json();
}

// Alias for consistency
export const list = listReports;

// ============================================================================
// File Operations
// ============================================================================

/**
 * Upload a file to a report
 * @param id - Report ID
 * @param editToken - Edit token for authorization
 * @param file - File to upload
 * @returns Promise with upload result including file path
 */
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

// Alias for consistency
export const upload = uploadFile;

/**
 * Get a signed URL for a file
 * @param path - File path
 * @returns Promise with signed URL
 */
export async function getFileUrl(path: string) {
  const res = await fetch(`/api/report/file-url?path=${encodeURIComponent(path)}`);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`get file URL failed: ${res.status} ${t}`);
  }
  return res.json();
}

// Alias for consistency
export const fileUrl = getFileUrl;

// ============================================================================
// Convenience Exports
// ============================================================================

// Export all functions as a namespace object for flexibility
export default {
  createReport,
  create,
  updateReport,
  update,
  getReport,
  get,
  listReports,
  list,
  uploadFile,
  upload,
  getFileUrl,
  fileUrl,
};
