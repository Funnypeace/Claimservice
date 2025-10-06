
import React from 'react';
import { Vehicle } from '../../types';
import Input from '../ui/Input';

interface Step2Props {
  data: Vehicle;
  onChange: (field: keyof Vehicle, value: string) => void;
  errors: Record<string, string>;
}

const Step2Vehicle: React.FC<Step2Props> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Fahrzeuginformationen</h3>
        <p className="mt-1 text-sm text-slate-500">Geben Sie hier die Daten des betroffenen Fahrzeugs ein.</p>
      </div>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <Input
          label="Marke"
          id="make"
          type="text"
          value={data.make}
          onChange={(e) => onChange('make', e.target.value)}
          error={errors.make}
          required
        />
        <Input
          label="Modell"
          id="model"
          type="text"
          value={data.model}
          onChange={(e) => onChange('model', e.target.value)}
          error={errors.model}
          required
        />
        <Input
          label="Amtliches Kennzeichen"
          id="licensePlate"
          type="text"
          value={data.licensePlate}
          onChange={(e) => onChange('licensePlate', e.target.value)}
          error={errors.licensePlate}
          required
        />
        <Input
          label="Fahrgestellnummer (VIN)"
          id="vin"
          type="text"
          value={data.vin}
          onChange={(e) => onChange('vin', e.target.value)}
        />
      </div>
    </div>
  );
};

export default Step2Vehicle;
