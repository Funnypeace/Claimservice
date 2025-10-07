import React from 'react';
import { DamageReport, ReportStatus } from '../types';
import { EditIcon, EyeIcon } from './ui/Icons';

interface ReportCardProps {
    report: DamageReport;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
}

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    const statusClasses = status === ReportStatus.SUBMITTED
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const ReportCard: React.FC<ReportCardProps> = ({ report, onView, onEdit }) => {
    const formattedDate = new Date(report.createdAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const isDraft = report.status === ReportStatus.DRAFT;

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-lg transition-transform hover:scale-105 duration-300 flex flex-col">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <p className="text-sm text-slate-500">Fall-ID: {report.id.substring(0, 8)}</p>
                    <StatusBadge status={report.status} />
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 truncate">
                    {report?.vehicle?.make ?? ""} {report?.vehicle?.model ?? ""}
                </h3>
                <p className="text-sm text-slate-600">{report?.vehicle?.licensePlate ?? ""}</p>
                <p className="mt-3 text-sm text-slate-500">Gemeldet am: {formattedDate}</p>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex justify-end space-x-3">
                {isDraft ? (
                    <button
                        onClick={() => onEdit(report.id)}
                        className="inline-flex items-center rounded-md border border-transparent bg-yellow-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                        <EditIcon className="mr-2 h-4 w-4"/>
                        Entwurf bearbeiten
                    </button>
                ) : (
                    <button
                        onClick={() => onView(report.id)}
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <EyeIcon className="mr-2 h-4 w-4"/>
                        Details ansehen
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReportCard;
