
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  "Versicherungsnehmer",
  "Fahrzeug",
  "Schadendetails",
  "Dokumente",
  "Übersicht"
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <nav aria-label="Progress" className="pt-5">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.slice(0, totalSteps).map((stepName, stepIdx) => {
          const stepNumber = stepIdx + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={stepName} className="md:flex-1">
              <div className="group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4
                ${isCompleted ? 'border-blue-600' : isCurrent ? 'border-blue-600' : 'border-slate-200 group-hover:border-slate-300'}"
              >
                <span className={`text-sm font-medium transition-colors ${isCompleted ? 'text-blue-600' : isCurrent ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  Schritt {stepNumber}
                </span>
                <span className="text-sm font-medium text-slate-800">{stepName}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressBar;
