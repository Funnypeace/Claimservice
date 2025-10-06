
import React, { useState, useEffect, useCallback } from 'react';
import { getReports } from '../services/damageReportService';
import { DamageReport, ReportStatus } from '../types';
import { PlusIcon } from './ui/Icons';
import ReportCard from './ReportCard';

interface DamageReportListProps {
  onNewReport: () => void;
  onEditReport: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const DamageReportList: React.FC<DamageReportListProps> = ({ onNewReport, onEditReport, onViewDetails }) => {
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError('Fehler beim Laden der Schadensmeldungen.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ihre Schadensmeldungen</h2>
        <button
          onClick={onNewReport}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Neuen Schaden melden
        </button>
      </div>

      {isLoading && (
         <div className="text-center py-10">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-slate-500">Lade Meldungen...</p>
        </div>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!isLoading && !error && reports.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-slate-900">Keine Meldungen gefunden</h3>
            <p className="mt-1 text-sm text-slate-500">Sie haben noch keine Schäden gemeldet. Starten Sie jetzt.</p>
            <div className="mt-6">
                 <button
                    onClick={onNewReport}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Erste Meldung erstellen
                </button>
            </div>
        </div>
      )}

      {!isLoading && !error && reports.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onEdit={onEditReport} 
              onView={onViewDetails} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DamageReportList;
