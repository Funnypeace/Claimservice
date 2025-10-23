
export enum ReportStatus {
  DRAFT = 'Entwurf',
  SUBMITTED = 'Eingereicht',
}

export interface Policyholder {
  name: string;
  policyNumber: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  make: string;
  model: string;
  licensePlate: string;
  vin: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // For preview
}

export interface ReportAttachment {
  id?: string;
  name?: string;
  filename?: string;
  storagePath?: string;
  mime?: string;
  sizeBytes?: number;
  url?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface DamageReport {
  id: string;
  publicId?: string;
  editToken?: string;
  status: ReportStatus;
  statusLabel?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  policyholder: Policyholder;
  vehicle: Vehicle;
  damageDescription: string;
  incidentDate: string;
  files: UploadedFile[];
  attachments?: ReportAttachment[];
  title?: string;
  subtitle?: string;
  [key: string]: unknown;
}
