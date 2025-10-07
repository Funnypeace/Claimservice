import React, { useState, useEffect, useCallback } from 'react';
import { getReportById } from '../services/damageReportService';
import { DamageReport, UploadedFile } from '../types';

interface DamageReportDetailProps {
  reportId: string;
  onBack: () => void;
}

const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-slate-500">{title}</dt>
        <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
);

const DamageReportDetail: React.FC<DamageReportDetailProps> = ({ reportId, onBack }) => {
  const [report, setReport] = useState<DamageReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    if (!reportId) return;
    setIsLoading(true);
    const data = await getReportById(reportId);
    setReport(data || null);
    setIsLoading(false);
  }, [reportId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (isLoading) {
    return <div className="text-center p-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
    </div>;
  }

  if (!report) {
    return <div className="text-center p-12 text-red-500">Schadensmeldung nicht gefunden.</div>;
  }
  
  const { policyholder, vehicle, damageDescription, incidentDate, files, status, createdAt } = report;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl font-semibold leading-6 text-slate-900">
                Details zur Schadensmeldung
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Fall-ID: {report.id}
            </p>
        </div>

      <div className="border-t border-slate-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-slate-200">
            <div className="px-4 sm:px-6">
                 <DetailSection title="Status">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'Eingereicht' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {status}
                    </span>
                </DetailSection>
                 <DetailSection title="Gemeldet am">{new Date(createdAt).toLocaleString('de-DE')}</DetailSection>
            </div>

            <div className="px-4 py-3 sm:px-6 bg-slate-50 mt-4">
                <h3 className="text-lg font-medium text-slate-900">Versicherungsnehmer</h3>
            </div>
            <div className="px-4 sm:px-6">
                <DetailSection title="Name">{policyholder?.name ?? ""}</DetailSection>
                <DetailSection title="Policennummer">{policyholder?.policyNumber ?? ""}</DetailSection>
                <DetailSection title="E-Mail">{policyholder?.email ?? ""}</DetailSection>
                <DetailSection title="Telefon">{policyholder?.phone ?? ""}</DetailSection>
            </div>
            
            <div className="px-4 py-3 sm:px-6 bg-slate-50 mt-4">
                <h3 className="text-lg font-medium text-slate-900">Fahrzeug</h3>
            </div>
            <div className="px-4 sm:px-6">
                <DetailSection title="Marke">{vehicle?.make ?? ""}</DetailSection>
                <DetailSection title="Modell">{vehicle?.model ?? ""}</DetailSection>
                <DetailSection title="Kennzeichen">{vehicle?.licensePlate ?? ""}</DetailSection>
                <DetailSection title="Fahrgestellnummer (VIN)">{vehicle?.vin ?? ""}</DetailSection>
            </div>

            <div className="px-4 py-3 sm:px-6 bg-slate-50 mt-4">
                <h3 className="text-lg font-medium text-slate-900">Schadensdetails</h3>
            </div>
            <div className="px-4 sm:px-6">
                <DetailSection title="Schadensdatum">{new Date(incidentDate).toLocaleDateString('de-DE')}</DetailSection>
                <DetailSection title="Beschreibung">
                    <p className="whitespace-pre-wrap">{damageDescription}</p>
                </DetailSection>
                <DetailSection title="Dokumente & Fotos">
                    {files.length > 0 ? (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {files.map((file, index) => (
                                <li key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                                    <a href={file.dataUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={file.dataUrl} alt={file.name} className="w-full h-24 object-cover" />
                                        <div className="p-2 text-xs truncate">{file.name}</div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        "Keine Dateien hochgeladen."
                    )}
                </DetailSection>
            </div>
        </dl>
      </div>
    </div>
  );
};

export default DamageReportDetail;
