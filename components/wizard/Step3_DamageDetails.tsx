import React from 'react';
import { DamageReport } from '../../types';
import Input from '../ui/Input';

interface Step3Props {
  data: {
    damageDescription: string;
    incidentDate: string;
  };
  onChange: (field: keyof DamageReport, value: string) => void;
  errors: Record<string, string>;
}

const Step3Damage: React.FC<Step3Props> = ({ data, onChange, errors }) => {
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
          value={data.incidentDate || ""}
          onChange={(e) => onChange('incidentDate', e.target.value)}
          error={errors.incidentDate}
          required
        />

        <div>
          <label htmlFor="damageDescription" className="block text-sm font-medium text-slate-700">
            Schadensbeschreibung
          </label>
          <div className="mt-1">
            <textarea
              id="damageDescription"
              name="damageDescription"
              rows={6}
              className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.damageDescription ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
              value={data.damageDescription}
              onChange={(e) => onChange('damageDescription', e.target.value)}
              required
            ></textarea>
            {errors.damageDescription && <p className="mt-2 text-sm text-red-600">{errors.damageDescription}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Damage;
