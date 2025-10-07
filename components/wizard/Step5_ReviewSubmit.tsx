import React from 'react';
import { DamageReport } from '../../types';

interface Step5Props {
  reportData: Omit<DamageReport, 'id' | 'createdAt' | 'updatedAt'>;
}

const ReviewSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">{title}</h4>
        <div className="space-y-2 text-sm">{children}</div>
    </div>
);

const ReviewItem: React.FC<{ label: string, value?: string | number }> = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-slate-500">{label}:</span>
        <span className="text-slate-900 font-medium text-right">{value || '-'}</span>
    </div>
);

const Step5Review: React.FC<Step5Props> = ({ reportData }) => {
  const { policyholder, vehicle, damageDescription, incidentDate, files } = reportData;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Überprüfung und Absenden</h3>
        <p className="mt-1 text-sm text-slate-500">Bitte überprüfen Sie alle Angaben sorgfältig, bevor Sie die Meldung einreichen.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReviewSection title="Versicherungsnehmer">
          <ReviewItem label="Name" value={policyholder?.name ?? ""} />
          <ReviewItem label="Policennummer" value={policyholder?.policyNumber ?? ""} />
          <ReviewItem label="E-Mail" value={policyholder?.email ?? ""} />
          <ReviewItem label="Telefon" value={policyholder?.phone ?? ""} />
        </ReviewSection>

        <ReviewSection title="Fahrzeug">
          <ReviewItem label="Marke" value={vehicle?.make ?? ""} />
          <ReviewItem label="Modell" value={vehicle?.model ?? ""} />
          <ReviewItem label="Kennzeichen" value={vehicle?.licensePlate ?? ""} />
          <ReviewItem label="VIN" value={vehicle?.vin ?? ""} />
        </ReviewSection>

        <ReviewSection title="Schadensdetails">
          <ReviewItem label="Schadensdatum" value={new Date(incidentDate).toLocaleDateString('de-DE')} />
          <div>
            <span className="text-slate-500 text-sm">Beschreibung:</span>
            <p className="mt-1 text-sm text-slate-900 font-medium bg-slate-50 p-3 rounded-md whitespace-pre-wrap">{damageDescription}</p>
          </div>
        </ReviewSection>

        <ReviewSection title="Dokumente & Fotos">
          {files.length > 0 ? (
            <ul className="grid grid-cols-3 gap-2">
              {files.map((file, index) => (
                <li key={index} className="border rounded">
                    <img src={file.dataUrl} alt={file.name} className="w-full h-16 object-cover rounded-t"/>
                    <p className="text-xs p-1 truncate">{file.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Keine Dateien hochgeladen.</p>
          )}
        </ReviewSection>
      </div>
    </div>
  );
};

export default Step5Review;
