import React, { useMemo } from 'react';

/**
 * Vorsichtige, tolerante Props-Definition:
 * - Alle Props sind optional, damit bestehende Aufrufer nicht brechen.
 * - onSelect/onCreate werden nur aufgerufen, wenn sie existieren.
 * - reports kann beliebig geformt sein (id/title/fallback), daher any.
 */
type DamageReport = {
  id?: string | number;
  title?: string;
  subtitle?: string;
  status?: string;
  createdAt?: string | Date;
  [key: string]: any;
};

type Props = {
  reports?: DamageReport[] | null;
  loading?: boolean;
  error?: string | null;
  onSelect?: (report: DamageReport) => void;
  onCreate?: () => void;
  /** Optional: eigene leere-Status-Nachricht */
  emptyMessage?: string;
};

function formatDate(val: string | Date | undefined) {
  if (!val) return '';
  try {
    const d = typeof val === 'string' ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
  } catch {
    return '';
  }
}

function getKey(r: DamageReport, idx: number) {
  if (r?.id != null) return String(r.id);
  if (r?.uuid != null) return String(r.uuid);
  // Fallback-Key
  return `row-${idx}`;
}

/**
 * TOP-LEVEL DEFAULT EXPORT:
 * Keine export-Anweisung am Dateiende innerhalb eines Blocks etc.
 * Dadurch kein „Unexpected export"-Fehler bei Vercel/Rollup.
 */
export default function DamageReportList(props: Props) {
  const {
    reports,
    loading,
    error,
    onSelect,
    onCreate,
    emptyMessage = 'Keine Schadenfälle gefunden.',
  } = props ?? {};

  const data: DamageReport[] = useMemo(() => {
    if (!Array.isArray(reports)) return [];
    return reports;
  }, [reports]);

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-3/5 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
        <p className="font-medium">Fehler beim Laden</p>
        <p className="text-sm opacity-90">{error}</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full rounded-xl border border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Schadenfälle</h2>
          {typeof onCreate === 'function' && (
            <button
              type="button"
              onClick={onCreate}
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Neu anlegen
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Schadenfälle</h2>
        {typeof onCreate === 'function' && (
          <button
            type="button"
            onClick={onCreate}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Neu anlegen
          </button>
        )}
      </div>

      <ul className="divide-y">
        {data.map((r, idx) => {
          const key = getKey(r, idx);
          const title =
            r?.title ??
            r?.headline ??
            r?.subject ??
            `Schadenfall ${key.replace('row-', '#')}`;
          const subtitle =
            r?.subtitle ??
            r?.plate ??
            r?.licensePlate ??
            r?.vehicle ??
            r?.description ??
            '';
          const status = r?.status ?? r?.state ?? r?.phase ?? '';
          const created = formatDate(r?.createdAt ?? r?.created_at ?? r?.created);

          return (
            <li
              key={key}
              className="cursor-pointer px-4 py-3 hover:bg-gray-50"
              onClick={() => {
                if (typeof onSelect === 'function') onSelect(r);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{title}</p>
                  {(subtitle || created) && (
                    <p className="truncate text-xs text-gray-600">
                      {subtitle}
                      {subtitle && created ? ' · ' : ''}
                      {created}
                    </p>
                  )}
                </div>
                {status && (
                  <span className="ml-3 shrink-0 rounded-full border px-2 py-0.5 text-xs">
                    {status}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
