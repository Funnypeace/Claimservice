
import React, { useState, useCallback } from 'react';
import DamageReportList from './components/DamageReportList';
import DamageReportWizard from './components/DamageReportWizard';
import DamageReportDetail from './components/DamageReportDetail';

type View = 'list' | 'wizard' | 'detail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const handleStartNewReport = useCallback(() => {
    setActiveReportId(null);
    setView('wizard');
  }, []);

  const handleEditReport = useCallback((id: string) => {
    setActiveReportId(id);
    setView('wizard');
  }, []);
  
  const handleViewDetails = useCallback((id: string) => {
    setActiveReportId(id);
    setView('detail');
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveReportId(null);
    setView('list');
  }, []);

  const renderView = () => {
    switch (view) {
      case 'wizard':
        return <DamageReportWizard reportId={activeReportId} onBack={handleBackToList} onSaveSuccess={handleBackToList} />;
      case 'detail':
        return <DamageReportDetail reportId={activeReportId!} onBack={handleBackToList} />;
      case 'list':
      default:
        return <DamageReportList onNewReport={handleStartNewReport} onEditReport={handleEditReport} onViewDetails={handleViewDetails} />;
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
