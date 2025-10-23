
import React, { useState, useCallback, useEffect } from 'react';
import DamageReportList from './components/DamageReportList';
import DamageReportWizard from './components/DamageReportWizard';
import DamageReportDetail from './components/DamageReportDetail';
import { DamageReport } from './types';
import { getReports, getReportById } from './services/damageReportService';

type View = 'list' | 'wizard' | 'detail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<DamageReport | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error: any) {
      console.error('Fehler beim Laden der Schadenfälle:', error);
      setListError(error?.message ?? 'Schadenfälle konnten nicht geladen werden.');
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleStartNewReport = useCallback(() => {
    setActiveReportId(null);
    setActiveReport(null);
    setView('wizard');
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveReportId(null);
    setActiveReport(null);
    setView('list');
  }, []);

  const handleSelectReport = useCallback(async (report: DamageReport) => {
    const reportId = report.publicId ?? report.id ?? null;
    if (!reportId) {
      setActiveReport(null);
      setActiveReportId(null);
      setDetailError('Der ausgewählte Schaden enthält keine gültige ID.');
      setView('detail');
      return;
    }

    setDetailLoading(true);
    setDetailError(null);
    setView('detail');
    setActiveReportId(String(reportId));
    try {
      const fullReport = await getReportById(String(reportId));
      setActiveReport(fullReport ?? report);
      if (!fullReport) {
        setDetailError('Der ausgewählte Schaden konnte nicht geladen werden.');
      }
    } catch (error: any) {
      console.error('Fehler beim Laden des Schadens:', error);
      setDetailError(error?.message ?? 'Der Schaden konnte nicht geladen werden.');
      setActiveReport(report);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleEditReport = useCallback((report: DamageReport) => {
    const reportId = report.publicId ?? report.id ?? null;
    if (!reportId) {
      setDetailError('Der ausgewählte Schaden kann nicht bearbeitet werden.');
      return;
    }
    setActiveReportId(String(reportId));
    setActiveReport(report);
    setView('wizard');
  }, []);

  const handleSaveSuccess = useCallback(async () => {
    await loadReports();
    handleBackToList();
  }, [handleBackToList, loadReports]);

  const renderView = () => {
    switch (view) {
      case 'wizard':
        return (
          <DamageReportWizard
            reportId={activeReportId}
            onBack={handleBackToList}
            onSaveSuccess={handleSaveSuccess}
          />
        );
      case 'detail':
        return (
          <DamageReportDetail
            report={activeReport}
            loading={detailLoading}
            error={detailError}
            onBack={handleBackToList}
            onEdit={handleEditReport}
          />
        );
      case 'list':
      default:
        return (
          <DamageReportList
            reports={reports}
            loading={listLoading}
            error={listError}
            onCreate={handleStartNewReport}
            onSelect={handleSelectReport}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Kfz-Schadenaufnahme</h1>
           {view !== 'list' && (
              <button
                onClick={handleBackToList}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                Zurück zur Übersicht
              </button>
           )}
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Kfz-Schadenaufnahme App. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default App;
