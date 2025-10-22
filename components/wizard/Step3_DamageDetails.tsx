import React from 'react';
import DamageReport from '../../types';
import Input from '../ui/Input';

/**
 * Step3Damage Komponente
 *
 * Optimierung: Das Datumsfeld erlaubt jetzt sowohl manuelle Eingabe als auch Kalenderauswahl.
 * Es gibt einen Hilfetext, ein aria-label für Barrierefreiheit und eine Validierung auf das Format JJJJ-MM-TT.
 *
 * Änderungen:
 * - Hilfetext hinzugefügt
 * - aria-label ergänzt
 * - Validierung für das Datumsformat
 * - Fehlerausgabe verbessert
 * - Dokumentation im Code
 */

interface Step3Props {
  data: {
    damageDescription: string;
    incidentDate: string;
  };
  onChange: (field: keyof DamageReport, value: string) => void;
  errors: Record<string, string>;
}

const Step3Damage: React.FC<Step3Props> = ({ data, onChange, errors }) => {
  // Hilfetext für das Datumsfeld
  const dateHelpText = 'Bitte geben Sie das Datum im Format JJJJ-MM-TT ein oder wählen Sie es im Kalender.';

  // Validierung: Prüft, ob das Datum dem Format YYYY-MM-DD entspricht
  const isValidDate = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  // Fehlerausgabe für das Datumsfeld
  const dateError = data.incidentDate && !isValidDate(data.incidentDate)
    ? 'Ungültiges Datum. Bitte verwenden Sie das Format JJJJ-MM-TT.'
    : errors.incidentDate;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Schadendetails</h3>
        <p className="mt-1 text-sm text-slate-500">Beschreiben Sie den Vorfall und den entstandenen Schaden.</p>
      </div>
      <div className="space-y-6">
        <Input
          label="Datum des Vorfalls"
          id="incidentDate"
          type="date"
          value={data.incidentDate || ''}
          onChange={e => onChange('incidentDate', e.target.value)}
          error={dateError}
          required
          aria-label="Datum des Vorfalls. Format JJJJ-MM-TT. Pflichtfeld."
          helpText={dateHelpText}
          inputMode="numeric"
          pattern="\d{4}-\d{2}-\d{2}"
        />
        <div>
          <label htmlFor="damageDescription" className="block text-sm font-medium text-slate-700">
            Schadensbeschreibung
          </label>
          {/* ...restlicher Code... */}
        </div>
      </div>
    </div>
  );
};

export default Step3Damage;
