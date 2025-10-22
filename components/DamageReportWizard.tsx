import React, { useState, useEffect, useCallback } from 'react';
import { DamageReport, ReportStatus } from '../types';
import { getReportById, createReport, updateReport } from '../services/damageReportService';
import { toISOFromInput } from '../src/lib/date';

import ProgressBar from '../ui/ProgressBar';
import Step1Policyholder from '../wizard/Step1_PolicyholderInfo';
import Step2Vehicle from '../wizard/Step2_VehicleInfo';
import Step3Damage from '../wizard/Step3_DamageDetails';
import Step4Uploads from '../wizard/Step4_Uploads';
import Step5Review from '../wizard/Step5_ReviewSubmit';

const TOTAL_STEPS = 5;

const emptyReport: Omit<DamageReport, 'id' | 'createdAt'  | 'updatedAt'> = {
  status: ReportStatus.DRAFT,
  policyholder: { name: '', policyNumber: '', email: '', phone: '' },
  vehicle: { make: '', model: '', licensePlate: '', vin: '' },
  damageDescription: '',
  incidentDate: '',
  files: [],
};

interface DamageReportWizardProps {
  reportId?: string | null;
  onBack?: () => void;
  onSaveSuccess?: () => void;
}

export default function DamageReportWizard({
  reportId,
  onBack,
  onSaveSuccess,
}: DamageReportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<Omit<DamageReport, 'id' | 'createdAt' | 'updatedAt'>>(emptyReport);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Daten laden
  useEffect(() => {
    if (reportId) {
      const fetchData = async () => {
        try {
          const data = await getReportById(reportId);
          if (data) {
            const { id, createdAt, updatedAt, ...restData } = data;
            setReportData(restData as typeof reportData);
          }
        } catch (err) {
          console.error('Fehler beim Laden:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [reportId]);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((p) => p + 1);
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const handleSave = useCallback(
    async (draft = true) => {
      setIsSaving(true);
      setValidationErrors({});
      try {
        const finalData: Omit<DamageReport, 'id' | 'createdAt' | 'updatedAt'> = {
          ...reportData,
          status: draft ? ReportStatus.DRAFT : ReportStatus.SUBMITTED,
        };
        if (reportId) {
          await updateReport(reportId, finalData);
        } else {
          await createReport(finalData);
        }
        onSaveSuccess?.();
      } catch (error: any) {
        console.error('Fehler beim Speichern:', error);
        setValidationErrors({ global: error.message || 'Ein Fehler ist aufgetreten.' });
      } finally {
        setIsSaving(false);
      }
    },
    [reportData, reportId, onSaveSuccess]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Lade Schaden…</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Zurück zur Liste
        </button>
      )}

      <h1 className="text-2xl font-bold mb-6">
        {reportId ? 'Schaden bearbeiten' : 'Neuer Schaden'}
      </h1>

      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {validationErrors.global && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {validationErrors.global}
        </div>
      )}

      <div className="mt-6">
        {currentStep === 1 && (
          <Step1Policyholder
            data={reportData.policyholder}
            errors={validationErrors}
            onChange={(ph) => setReportData({ ...reportData, policyholder: ph })}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <Step2Vehicle
            data={reportData.vehicle}
            errors={validationErrors}
            onChange={(v) => setReportData({ ...reportData, vehicle: v })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 3 && (
          <Step3Damage
            damageDescription={reportData.damageDescription || ''}
            incidentDate={reportData.incidentDate || ''}
            errors={validationErrors}
            onChange={(desc, date) =>
              setReportData({ ...reportData, damageDescription: desc, incidentDate: date })
            }
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 4 && (
          <Step4Uploads
            files={reportData.files || []}
            onChange={(f) => setReportData({ ...reportData, files: f })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 5 && (
          <Step5Review
            reportData={reportData}
            onPrev={handlePrev}
            onSaveDraft={() => handleSave(true)}
            onSubmit={() => handleSave(false)}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
