import React, { useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

/**
 * Optimierte Input-Komponente für Datumsfelder:
 * - Unterstützt manuelle Eingabe und Kalenderauswahl (type="date" und type="text" mit pattern)
 * - Browserübergreifend nutzbar
 * - Barrierefreiheit: ARIA-Labels, Hilfetexte
 * - Validierung für Datumsformat (YYYY-MM-DD)
 * - Hilfetext und Fehleranzeige
 */
const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  helpText,
  type = 'text',
  required,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Hilfetext-ID für aria-describedby
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Validierung für Datumsfelder (YYYY-MM-DD)
  const validateDate = (value: string) => {
    if (!required && !value) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  };

  // Handler für onBlur: Validierung bei Datumsfeldern
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type === 'date' || (type === 'text' && props.pattern === '\\d{4}-\\d{2}-\\d{2}')) {
      if (!validateDate(e.target.value)) {
        if (inputRef.current) {
          inputRef.current.setCustomValidity('Bitte ein gültiges Datum im Format JJJJ-MM-TT eingeben.');
        }
      } else {
        if (inputRef.current) {
          inputRef.current.setCustomValidity('');
        }
      }
    }
    if (props.onBlur) props.onBlur(e);
  };

  // Für Datumsfelder: type="date" für native Kalender, fallback auf type="text" mit pattern
  const inputType = type === 'date' && !('showPicker' in document.createElement('input')) ? 'text' : type;
  const pattern = type === 'date' && inputType === 'text' ? '\\d{4}-\\d{2}-\\d{2}' : props.pattern;

  const errorClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span aria-hidden="true" className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          ref={inputRef}
          id={id}
          type={inputType}
          pattern={pattern}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
          className={`block w-full rounded-md shadow-sm sm:text-sm ${errorClasses}`}
          required={required}
          onBlur={handleBlur}
          {...props}
        />
        {helpText && (
          <p id={helpId} className="mt-2 text-sm text-slate-500">
            {helpText}
          </p>
        )}
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;

/**
 * Änderungen:
 * - Unterstützung für Datumsfelder: Sowohl manuelle Eingabe als auch Kalenderauswahl möglich (type="date" und Fallback auf type="text" mit pattern)
 * - Validierung für Datumsformat (YYYY-MM-DD) bei Blur
 * - Hilfetexte und ARIA-Labels für Barrierefreiheit ergänzt
 * - Fehlerausgabe und Hilfetext mit aria-describedby verknüpft
 * - Dokumentation der Änderungen im Code
 */
