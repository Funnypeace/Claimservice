/*
Barrierefreiheitsmaßnahmen für DamageReportDetail-Komponente:

1. ARIA-Labels und Rollen:
   - Hauptcontainer als <section role="region" aria-label="Schadenfall-Detailansicht"> kennzeichnen.
   - Wichtige Bereiche (Versicherungsnehmer, Fahrzeug, Schaden, Dokumente) als <section> mit aria-labelledby auszeichnen.
2. Tastatur-Navigation:
   - Sicherstellen, dass alle interaktiven Elemente (z.B. Zurück-Button, Dokument-Links) per Tab erreichbar sind.
   - Visuellen Fokuszustand für Buttons und Links hervorheben.
3. Screenreader-Unterstützung:
   - Überschriften und wichtige Felder mit aria-label oder aria-labelledby versehen.
   - Lade- und Fehlerzustände mit role="status" auszeichnen.
4. Weitere Maßnahmen:
   - Semantische HTML-Struktur (section, header, dl, dt, dd) verwenden.
   - Dokumentation der Änderungen im Quellcode.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { getReportById } from '../services/damageReportService';
import { DamageReport, UploadedFile } from '../types';

interface DamageReportDetailProps {
  reportId: string;
  onBack: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode; sectionId: string }> = ({ title, children, sectionId }) => (
  <section aria-labelledby={sectionId} className="py-5 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt id={sectionId} className="text-sm font-medium text-slate-500">{title}</dt>
    <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">{children}</dd>
  </section>
);

export const DamageReportDetail: React.FC<DamageReportDetailProps> = ({ reportId, onBack }) => {
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
    return (
      <div role="status" aria-live="polite" className="text-center p-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" aria-label="Lade Schadenfall-Daten"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div role="status" aria-live="assertive" className="text-center p-12">
        <span>Schadenfall nicht gefunden.</span>
      </div>
    );
  }

  return (
    <section role="region" aria-label="Schadenfall-Detailansicht" className="damage-report-detail">
      <header className="flex items-center justify-between mb-6">
        <h1 id="damage-detail-title" className="text-2xl font-bold">Schadenfall-Details</h1>
        <button
          type="button"
          aria-label="Zurück zur Übersicht"
          onClick={onBack}
          className="btn btn-secondary focus:outline focus:ring-2 focus:ring-blue-500"
        >
          Zurück
        </button>
      </header>
      <dl aria-labelledby="damage-detail-title" className="space-y-4">
        <DetailSection title="Status" sectionId="status-label">
          <span id="status-label">{report.status}</span>
        </DetailSection>
        <DetailSection title="Erstellungsdatum" sectionId="created-label">
          <span id="created-label">{new Date(report.createdAt).toLocaleString()}</span>
        </DetailSection>
        <DetailSection title="Versicherungsnehmer" sectionId="insured-label">
          <div>
            <div><span className="sr-only">Name: </span>{report.insured.name}</div>
            <div><span className="sr-only">Policennummer: </span>{report.insured.policyNumber}</div>
            <div><span className="sr-only">E-Mail: </span>{report.insured.email}</div>
            <div><span className="sr-only">Telefon: </span>{report.insured.phone}</div>
          </div>
        </DetailSection>
        <DetailSection title="Fahrzeug" sectionId="vehicle-label">
          <div>
            <div><span className="sr-only">Marke: </span>{report.vehicle.brand}</div>
            <div><span className="sr-only">Modell: </span>{report.vehicle.model}</div>
            <div><span className="sr-only">Kennzeichen: </span>{report.vehicle.licensePlate}</div>
            <div><span className="sr-only">VIN: </span>{report.vehicle.vin}</div>
          </div>
        </DetailSection>
        <DetailSection title="Schadensdetails" sectionId="damage-label">
          <div>
            <div><span className="sr-only">Datum: </span>{new Date(report.damageDate).toLocaleDateString()}</div>
            <div><span className="sr-only">Beschreibung: </span>{report.description}</div>
          </div>
        </DetailSection>
        <DetailSection title="Dokumente & Fotos" sectionId="docs-label">
          <ul className="flex flex-wrap gap-4" aria-label="Hochgeladene Dokumente">
            {report.files && report.files.length > 0 ? (
              report.files.map((file: UploadedFile) => (
                <li key={file.id}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={0}
                    aria-label={`Dokument öffnen: ${file.name}`}
                    className="focus:outline focus:ring-2 focus:ring-blue-500"
                  >
                    <img src={file.thumbnailUrl || file.url} alt={file.name} className="w-20 h-20 object-cover rounded" />
                    <div className="truncate text-xs mt-1" aria-label="Dateiname">{file.name}</div>
                  </a>
                </li>
              ))
            ) : (
              <li><span>Keine Dokumente vorhanden.</span></li>
            )}
          </ul>
        </DetailSection>
      </dl>
    </section>
  );
}

export default DamageReportDetail;
