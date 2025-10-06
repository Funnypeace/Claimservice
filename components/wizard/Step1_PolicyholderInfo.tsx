
import React from 'react';
import { Policyholder } from '../../types';
import Input from '../ui/Input';

interface Step1Props {
  data: Policyholder;
  onChange: (field: keyof Policyholder, value: string) => void;
  errors: Record<string, string>;
}

const Step1Policyholder: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Daten des Versicherungsnehmers</h3>
        <p className="mt-1 text-sm text-slate-500">Bitte geben Sie die Informationen laut Ihrem Versicherungsschein an.</p>
      </div>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <Input
          label="Vollständiger Name"
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Policennummer"
          id="policyNumber"
          type="text"
          value={data.policyNumber}
          onChange={(e) => onChange('policyNumber', e.target.value)}
          error={errors.policyNumber}
          required
        />
        <Input
          label="E-Mail-Adresse"
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Telefonnummer"
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>
    </div>
  );
};

export default Step1Policyholder;
