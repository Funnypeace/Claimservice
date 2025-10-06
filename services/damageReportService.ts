
import { DamageReport, ReportStatus } from '../types';

const LOCAL_STORAGE_KEY = 'damageReports';

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

const getAllReportsFromStorage = (): DamageReport[] => {
  try {
    const reportsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (reportsJson) {
      return JSON.parse(reportsJson);
    } else {
      const initialData = getInitialMockData();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return getInitialMockData();
  }
};

const saveAllReportsToStorage = (reports: DamageReport[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
};

// Simulate async API calls
export const getReports = async (): Promise<DamageReport[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reports = getAllReportsFromStorage();
      resolve(reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, 500);
  });
};

export const getReportById = async (id: string): Promise<DamageReport | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reports = getAllReportsFromStorage();
      resolve(reports.find((report) => report.id === id));
    }, 300);
  });
};

export const createReport = async (reportData: Omit<DamageReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<DamageReport> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reports = getAllReportsFromStorage();
      const newReport: DamageReport = {
        ...reportData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedReports = [newReport, ...reports];
      saveAllReportsToStorage(updatedReports);
      resolve(newReport);
    }, 500);
  });
};

export const updateReport = async (id: string, reportData: Partial<DamageReport>): Promise<DamageReport> => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reports = getAllReportsFromStorage();
      const reportIndex = reports.findIndex((report) => report.id === id);
      if (reportIndex !== -1) {
        const updatedReport = {
          ...reports[reportIndex],
          ...reportData,
          updatedAt: new Date().toISOString(),
        };
        reports[reportIndex] = updatedReport;
        saveAllReportsToStorage(reports);
        resolve(updatedReport);
      } else {
        reject(new Error('Report not found'));
      }
    }, 500);
  });
};
