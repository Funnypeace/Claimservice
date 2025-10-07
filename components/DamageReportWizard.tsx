import React, { useState, useEffect, useCallback } from 'react';
import { DamageReport, ReportStatus } from '../types';
import { getReportById, createReport, updateReport } from '../services/damageReportService';
import { toISOFromInput } from '../src/lib/date';

import ProgressBar from './ui/ProgressBar';
import Step1Policyholder from './wizard/Step1_PolicyholderInfo';
import Step2Vehicle from './wizard/Step2_VehicleInfo';
import Step3Damage from './wizard/Step3_DamageDetails';
import Step4Uploads from './wizard/Step4_Uploads';
import Step5Review from './wizard/Step5_ReviewSubmit';

const TOTAL_STEPS = 5;

const emptyReport: Omit<DamageReport, 'id' | 'createdAt' | 'updatedAt'> = {
  status: ReportStatus.DRAFT,
  policyholder: { name: '', policyNumber: '', email: '', phone: '' },
  vehicle: { make: '', model: '', licensePlate: '', vin: '' },
  damageDescription: '',
  incidentDate: '',
  files: [],
};

interface DamageReportWizardProps {
  reportId: string | null;
  onBack: () => void;
  onSaveSuccess: () => void;
}

const DamageReportWizard: React.FC<DamageReportWizardProps> = ({ reportId, onBack, onSaveSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<Omit<DamageReport, 'id' | 'createdAt' | 'updatedAt'>>(emptyReport);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchReport = useCallback(async () => {
    if (reportId) {
      setIsLoading(true);
      const data = await getReportById(reportId);
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...editableData } = data;
        setReportData(editableData);
      }
      setIsLoading(false);
    } else {
      setReportData(emptyReport);
      setIsLoading(false);
    }
  }, [reportId]);
  
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const validateStep = () => {
    const errors: Record<string, string> = {};
    if (currentStep === 1) {
        if (!reportData.policyholder.name) errors.name = 'Name ist erforderlich.';
        if (!reportData.policyholder.policyNumber) errors.policyNumber = 'Policennummer ist erforderlich.';
        if (!reportData.policyholder.email) errors.email = 'E-Mail ist erforderlich.';
    }
    if (currentStep === 2) {
        if (!reportData?.vehicle?.make) errors.make = 'Marke ist erforderlich.';
        if (!reportData?.vehicle?.model) errors.model = 'Modell ist erforderlich.';
        if (!reportData?.vehicle?.licensePlate) errors.licensePlate = 'Kennzeichen ist erforderlich.';
    }
    if (currentStep === 3) {
        if (!reportData.incidentDate) errors.incidentDate = 'Datum ist erforderlich.';
        if (!reportData.damageDescription) errors.damageDescription = 'Beschreibung ist erforderlich.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
        setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  const handleDataChange = (section: keyof DamageReport, field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as object),
        [field]: value,
      }
    }));
  };

  const handleSimpleChange = (field: keyof DamageReport, value: any) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async (status: ReportStatus) => {
    setIsSaving(true);
    const normalizedIncidentDate = toISOFromInput(reportData.incidentDate);
    const finalReportData = { ...reportData, status, incidentDate: normalizedIncidentDate };
    try {
        if (reportId) {
            await updateReport(reportId, finalReportData);
        } else {
            await createReport(finalReportData);
        }
        onSaveSuccess();
    } catch(e) {
        console.error("Failed to save report", e);
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <div className="text-center p-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-slate-500">Lade Entwurf...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-slate-800">
            {reportId ? 'Schadensmeldung bearbeiten' : 'Neue Schadensmeldung'}
        </h2>
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>
      
      <div className="p-8 min-h-[400px]">
        {currentStep === 1 && <Step1Policyholder data={reportData.policyholder} onChange={(field, value) => handleDataChange('policyholder', field, value)} errors={validationErrors} />}
        {currentStep === 2 && <Step2Vehicle data={reportData.vehicle} onChange={(field, value) => handleDataChange('vehicle', field, value)} errors={validationErrors} />}
        {currentStep === 3 && <Step3Damage data={{damageDescription: reportData.damageDescription, incidentDate: reportData.incidentDate}} onChange={handleSimpleChange} errors={validationErrors} />}
        {currentStep === 4 && <Step4Uploads files={reportData.files} onFilesChange={(files) => handleSimpleChange('files', files)} />}
        {currentStep === 5 && <Step5Review reportData={reportData} />}
      </div>
      
      <div className="bg-slate-50 px-8 py-4 border-t rounded-b-lg flex justify-between items-center">
        <button
          onClick={currentStep === 1 ? onBack : prevStep}
          disabled={isSaving}
          className="px-6 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
        >
          {currentStep === 1 ? 'Abbrechen' : 'Zurück'}
        </button>
        {currentStep < TOTAL_STEPS && (
          <button
            onClick={nextStep}
            disabled={isSaving}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Weiter
          </button>
        )}
        
        {currentStep === TOTAL_STEPS && (
            <div className="space-x-3">
                 <button
                    onClick={() => handleSave(ReportStatus.DRAFT)}
                    disabled={isSaving}
                    className="px-6 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                    {isSaving ? 'Speichern...' : 'Als Entwurf speichern'}
                </button>
                <button
                    onClick={() => handleSave(ReportStatus.SUBMITTED)}
                    disabled={isSaving}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                     {isSaving ? 'Senden...' : 'Schaden einreichen'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default DamageReportWizard;
