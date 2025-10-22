import { DamageReport, ReportStatus } from '../types';
import { createReport as createReportAPI, updateReport as updateReportAPI, getReport as getReportAPI, uploadFile } from '../src/lib/api';

// Helper function to normalize date to ISO format (YYYY-MM-DD)
function normalizeDate(dateStr: string) {
  if (!dateStr) return '';
  // If already in ISO format (YYYY-MM-DD), return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Handle German date format (DD.MM.YYYY or D.M.YYYY)
  const germanMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (germanMatch) {
    const day = germanMatch[1].padStart(2, '0');
    const month = germanMatch[2].padStart(2, '0');
    const year = germanMatch[3];
    return `${year}-${month}-${day}`;
  }
  // Try parsing as a general date and converting to ISO
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  // Return original if we can't parse it
  return dateStr;
}

// Note: This service now uses the backend API instead of localStorage.
// The mock data functions are kept for potential future use but not actively used.
const getInitialMockData = (): DamageReport[] => [];

// --- FIX: Platzhalterfunktionen angepasst, damit sie den Build nicht mehr abbrechen ---

export async function getReports(): Promise<DamageReport[]> {
  // TODO: Implementierung mit Backend-API, aktuell Dummy-Implementierung
  return [];
}

export async function getReportById(id: string): Promise<DamageReport | undefined> {
  // TODO: Implementierung mit Backend-API, aktuell Dummy-Implementierung
  return undefined;
}

export async function getReportByPublicId(publicId: string): Promise<DamageReport | undefined> {
  return getReportAPI(publicId);
}

export async function createReport(report: DamageReport): Promise<DamageReport> {
  return createReportAPI(report);
}

export async function updateReport(id: string, report: Partial<DamageReport>): Promise<DamageReport> {
  return updateReportAPI(id, report);
}

export { uploadFile };
