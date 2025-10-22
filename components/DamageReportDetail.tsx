import React from 'react';

type DamageReport = {
  id?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  status?: string;
  vehicle?: string;
  licensePlate?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  attachments?: Array<{ id?: string | number; name?: string; url?: string }>;
  [key: string]: any;
};

type Props = {
  report?: DamageReport | null;
  loading?: boolean;
  error?: string | null;
  onBack?: () => void;
  onEdit?: (report: DamageReport) => void;
  onDelete?: (report: DamageReport) => void;
};

function formatDate(val?: string | Date) {
  if (!val) return '';
  try {
    const d = typeof val === 'string' ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
  } catch {
    return '';
  }
}

export default function DamageReportDetail(props: Props) {
  const { report, loading, error, onBack, onEdit, onDelete } = props ?? {};

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-lg font-semibold">Detailansicht</p>
          {typeof onBack === 'function' && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-red-100"
            >
              Zurück
            </button>
          )}
        </div>
        <p className="text-sm opacity-90">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="w-full rounded-xl border border-gray-200 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detailansicht</h2>
          {typeof onBack === 'function' && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Zurück
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">Kein Schadenfall ausgewählt.</p>
      </div>
    );
  }

  const {
    id,
    title,
    subtitle,
    description,
    status,
    vehicle,
    licensePlate,
    createdAt,
    updatedAt,
    attachments,
    ...rest
  } = report;

  return (
    <div className="w-full rounded-xl border border-gray-200">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold">{title ?? 'Schadenfall'}</h2>
          {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {typeof onBack === 'function' && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Zurück
            </button>
          )}
          {typeof onEdit === 'function' && (
            <button
              type="button"
              onClick={() => onEdit(report)}
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Bearbeiten
            </button>
          )}
          {typeof onDelete === 'function' && (
            <button
              type="button"
              onClick={() => onDelete(report)}
              className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
            >
              Löschen
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="block text-gray-500">ID</span>
            <span className="font-medium">{id ?? '—'}</span>
          </div>
          <div className="text-sm">
            <span className="block text-gray-500">Status</span>
            <span className="rounded-full border px-2 py-0.5 text-xs">
              {status ?? '—'}
            </span>
          </div>
          <div className="text-sm">
            <span className="block text-gray-500">Fahrzeug</span>
            <span className="font-medium">{vehicle ?? '—'}</span>
          </div>
          <div className="text-sm">
            <span className="block text-gray-500">Kennzeichen</span>
            <span className="font-medium">{licensePlate ?? '—'}</span>
          </div>
          <div className="text-sm">
            <span className="block text-gray-500">Erstellt</span>
            <span className="font-medium">{formatDate(createdAt) || '—'}</span>
          </div>
          <div className="text-sm">
            <span className="block text-gray-500">Aktualisiert</span>
            <span className="font-medium">{formatDate(updatedAt) || '—'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="block text-gray-500">Beschreibung</span>
            <span className="whitespace-pre-wrap">
              {description?.trim() || '—'}
            </span>
          </div>

          {Array.isArray(attachments) && attachments.length > 0 && (
            <div className="text-sm">
              <span className="block text-gray-500">Anhänge</span>
              <ul className="list-inside list-disc">
                {attachments.map((a, i) => (
                  <li key={a?.id ?? i}>
                    {a?.url ? (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {a?.name ?? a?.url}
                      </a>
                    ) : (
                      <span>{a?.name ?? 'Anhang'}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Debug-Section (optional) */}
      {rest && Object.keys(rest).length > 0 && (
        <details className="mx-4 mb-4 rounded-lg border border-gray-200 p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Weitere Felder
          </summary>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">
            {JSON.stringify(rest, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
