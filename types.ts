
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

export interface DamageReport {
  id: string;
  status: ReportStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  policyholder: Policyholder;
  vehicle: Vehicle;
  damageDescription: string;
  incidentDate: string;
  files: UploadedFile[];
}
