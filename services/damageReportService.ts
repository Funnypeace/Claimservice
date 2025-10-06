import { DamageReport, ReportStatus } from '../types';
import { createReport as createReportAPI, updateReport as updateReportAPI, getReport as getReportAPI, uploadFile } from '../src/lib/api';

// Note: This service now uses the backend API instead of localStorage.
// The mock data functions are kept for potential future use but not actively used.

const getInitialMockData = (): DamageReport[] => [
  {
    id: 'b7a8d2e0-5f6a-4b1c-8e4d-9a2c1b4e6f8c',
    status: ReportStatus.SUBMITTED,
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    policyholder: {
      name: 'Max Mustermann',
      policyNumber: 'V-123456789',
      email: 'max.mustermann@example.com',
      phone: '0123-4567890',
    },
    vehicle: {
      make: 'Volkswagen',
      model: 'Golf VIII',
      licensePlate: 'B-MW-1234',
      vin: 'WVWZZZAUZNP123456',
    },
    damageDescription: 'Auffahrunfall an der Ampel. Stoßstange vorne rechts beschädigt.',
    incidentDate: '2023-10-25',
    files: [],
  },
  {
    id: 'c3f9a1b2-8c7d-4e6f-9a1b-5e2d3f4a5b6c',
    status: ReportStatus.DRAFT,
    createdAt: new Date('2023-10-27T14:30:00Z').toISOString(),
    updatedAt: new Date('2023-10-27T14:30:00Z').toISOString(),
    policyholder: {
      name: 'Erika Mustermann',
      policyNumber: 'V-987654321',
      email: 'erika.mustermann@example.com',
      phone: '0987-6543210',
    },
    vehicle: {
      make: 'BMW',
      model: '3er',
      licensePlate: 'M-XY-5678',
      vin: 'WBA3K123456L78901',
    },
    damageDescription: 'Parkschaden am hinteren linken Kotflügel.',
    incidentDate: '2023-10-27',
    files: [],
  },
];

// REMOVED: localStorage functions are no longer used
// const getAllReportsFromStorage = () => {...}
// const saveAllReportsToStorage = () => {...}

// Note: getReports and getReportById are not implemented in the new API
// These would need to be added to the backend or handled differently
export const getReports = async (): Promise<DamageReport[]> => {
  // TODO: Implement a backend endpoint to list all reports
  // For now, return empty array or throw error
  throw new Error('getReports: Not implemented with new API');
};

export const getReportById = async (id: string): Promise<DamageReport | undefined> => {
  // Use publicId if available, otherwise this needs backend support
  // The new API uses publicId, not internal id
  throw new Error('getReportById: Use getReportByPublicId instead');
};

export const getReportByPublicId = async (publicId: string): Promise<DamageReport> => {
  return await getReportAPI(publicId);
};

export const createReport = async (reportData: Omit<DamageReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string; publicId: string; editToken: string; report: DamageReport }> => {
  // Call the backend API to create the report
  const response = await createReportAPI(reportData);
  return response;
};

export const updateReport = async (id: string, editToken: string, reportData: Partial<DamageReport>): Promise<DamageReport> => {
  const response = await updateReportAPI(id, editToken, reportData);
  return response;
};

export { uploadFile };
