/*
Barrierefreiheitsmaßnahmen für DamageReportList-Komponente:

1. ARIA-Labels und Rollen:
   - Hauptcontainer als <section role="region" aria-label="Schadenfall-Übersicht"> kennzeichnen.
   - Die Liste der Schadenfälle als <div role="list"> auszeichnen.
2. Tastatur-Navigation:
   - Sicherstellen, dass alle ReportCards per Tab erreichbar sind (über tabIndex und Weitergabe an ReportCard).
   - Visuellen Fokuszustand für die Liste und Karten hervorheben.
3. Screenreader-Unterstützung:
   - Überschriften und wichtige Felder mit aria-label oder aria-labelledby versehen.
   - Lade- und Fehlerzustände mit role="status" auszeichnen.
4. Weitere Maßnahmen:
   - Semantische HTML-Struktur (section, header, div) verwenden.
   - Dokumentation der Änderungen im Quellcode.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { listReports } from '../src/lib/api';
import { DamageReport, ReportStatus } from '../types';
import { PlusIcon } from './ui/Icons';
import { ReportCard } from './ReportCard';

interface DamageReportListProps {
  onNewReport: () => void;
  onEditReport: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export const DamageReportList: React.FC<DamageReportListProps> = ({
  onNewReport,
  onEditReport,
  onViewDetails,
}) => {
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await listReports();
      const data = response.reports || [];
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(`Fehler beim Laden der Schadensmeldungen: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <section role="region" aria-label="Schadenfall-Übersicht" className="damage-report-list">
      <header>
        <h1 id="damage-list-title">Schadenfall-Übersicht</h1>
        <button
          type="button"
          aria-label="Neuen Schadenfall anlegen"
          onClick={onNewReport}
          className="new-report-btn"
        >
          <PlusIcon aria-hidden="true" /> Neuer Schadenfall
        </button>
      </header>
      {isLoading ? (
        <div role="status" aria-live="polite">Lade Schadenfälle…</div>
      ) : error ? (
        <div role="status" aria-live="assertive">{error}</div>
      ) : reports.length === 0 ? (
        <div role="status" aria-live="polite">Keine Schadenfälle vorhanden.</div>
      ) : (
        <div role="list" aria-labelledby="damage-list-title" className="report-list-grid">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              id={report.id}
              status={report.status}
              createdAt={report.createdAt}
              vehicle={report.vehicle}
              onClick={() => onViewDetails(report.id)}
            />
          ))}
        </div>
      )}
    </section>
  );



export default DamageReportList;
