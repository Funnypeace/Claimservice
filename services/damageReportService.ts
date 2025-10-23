import { DamageReport, Policyholder, Vehicle, ReportStatus, ReportAttachment } from '../types';
import {
  createReport as createReportAPI,
  updateReport as updateReportAPI,
  getReport as getReportAPI,
  listReports as listReportsAPI,
  uploadFile,
} from '../src/lib/api';

const TOKEN_STORAGE_KEY = 'claimservice:editTokens';

type StoredTokens = Record<string, string>;

function readStoredTokens(): StoredTokens {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredTokens;
  } catch (error) {
    console.warn('Konnte gespeicherte Tokens nicht lesen:', error);
    return {};
  }
}

function persistToken(id: string | null | undefined, publicId: string | null | undefined, token: string) {
  if (typeof window === 'undefined') return;
  try {
    const tokens = readStoredTokens();
    if (id) tokens[String(id)] = token;
    if (publicId) tokens[String(publicId)] = token;
    window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.warn('Konnte Bearbeitungstoken nicht speichern:', error);
  }
}

function restoreToken(id: string | null | undefined, publicId: string | null | undefined): string | undefined {
  const tokens = readStoredTokens();
  return tokens[String(id ?? '')] ?? tokens[String(publicId ?? '')];
}

function normalizeDateValue(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
    const match = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (match) {
      const [, d, m, y] = match;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function normalizePolicyholder(raw: any): Policyholder {
  const base = raw ?? {};
  return {
    name: base.name ?? base.fullName ?? '',
    policyNumber: base.policyNumber ?? base.policy_number ?? '',
    email: base.email ?? '',
    phone: base.phone ?? '',
  };
}

function normalizeVehicle(raw: any): Vehicle {
  const base = raw ?? {};
  return {
    make: base.make ?? base.brand ?? '',
    model: base.model ?? base.type ?? '',
    licensePlate: base.licensePlate ?? base.license_plate ?? '',
    vin: base.vin ?? base.vehicleIdentificationNumber ?? '',
  };
}

function mapStatus(raw: any): ReportStatus {
  if (!raw) return ReportStatus.DRAFT;
  const value = String(raw).toLowerCase();
  if (value === 'submitted' || value === ReportStatus.SUBMITTED.toLowerCase()) {
    return ReportStatus.SUBMITTED;
  }
  return ReportStatus.DRAFT;
}

function toFrontendReport(report: any): DamageReport {
  const id = report?.id ? String(report.id) : '';
  const publicId = report?.public_id ?? report?.publicId ?? '';
  const incidentDate = normalizeDateValue(report?.incident_date ?? report?.incidentDate);
  const createdAt = report?.created_at ?? report?.createdAt ?? new Date().toISOString();
  const updatedAt = report?.updated_at ?? report?.updatedAt ?? createdAt;
  const policyholder = normalizePolicyholder(report?.policyholder);
  const vehicle = normalizeVehicle(report?.vehicle);

  const base: DamageReport = {
    id,
    publicId: publicId || undefined,
    status: mapStatus(report?.status),
    createdAt,
    updatedAt,
    policyholder,
    vehicle,
    damageDescription: report?.damage_description ?? report?.damageDescription ?? '',
    incidentDate,
    files: Array.isArray(report?.files) ? report.files : [],
    title: policyholder.name || report?.title || undefined,
    subtitle: vehicle.licensePlate || vehicle.make || undefined,
  };

  const token = restoreToken(id || null, publicId || null);
  if (token) {
    base.editToken = token;
  }

  return base;
}

function toAttachment(file: any): ReportAttachment {
  return {
    id: file?.id ? String(file.id) : undefined,
    filename: file?.filename ?? file?.name ?? undefined,
    storagePath: file?.storage_path ?? file?.storagePath ?? undefined,
    mime: file?.mime ?? file?.type ?? undefined,
    sizeBytes: file?.size_bytes ?? file?.sizeBytes ?? undefined,
    createdAt: file?.created_at ?? file?.createdAt ?? undefined,
    url: file?.url ?? undefined,
    name: file?.filename ?? file?.name ?? undefined,
  };
}

function toApiPayload(report: Partial<DamageReport>) {
  return {
    incident_date: normalizeDateValue(report.incidentDate ?? ''),
    damage_description: report.damageDescription ?? '',
    policyholder: report.policyholder ?? null,
    vehicle: report.vehicle ?? null,
    extra: (report as any).extra ?? null,
  };
}

export async function getReports(): Promise<DamageReport[]> {
  const response = await listReportsAPI().catch((error) => {
    console.error('Fehler beim Laden der Schadenliste:', error);
    throw error;
  });

  const reports = Array.isArray(response?.reports)
    ? response.reports
    : Array.isArray(response)
      ? response
      : [];

  return reports.map(toFrontendReport);
}

export async function getReportById(id: string): Promise<DamageReport | undefined> {
  if (!id) return undefined;
  const response = await getReportAPI(id).catch((error) => {
    console.error('Fehler beim Abrufen eines Schadens:', error);
    throw error;
  });

  const report = response?.report ?? response;
  if (!report) return undefined;

  const mapped = toFrontendReport(report);
  if (Array.isArray(response?.files)) {
    mapped.attachments = response.files.map(toAttachment);
  }

  if (response?.editToken && !mapped.editToken) {
    mapped.editToken = response.editToken;
  }

  return mapped;
}

export async function getReportByPublicId(publicId: string): Promise<DamageReport | undefined> {
  return getReportById(publicId);
}

export async function createReport(report: Partial<DamageReport>) {
  const payload = toApiPayload(report);
  const result = await createReportAPI(payload);
  if (result?.editToken) {
    persistToken(result?.id, result?.publicId, result.editToken);
  }
  return result;
}

export async function updateReport(id: string, report: Partial<DamageReport>) {
  const token = report.editToken ?? restoreToken(id, (report as any)?.publicId);
  if (!token) {
    throw new Error('Es ist kein Bearbeitungstoken für diesen Schaden vorhanden.');
  }

  const payload = toApiPayload(report);
  const result = await updateReportAPI(id, token, payload);
  if (result?.editToken) {
    persistToken(result?.id, result?.publicId, result.editToken);
  }
  return result;
}

export { uploadFile };
