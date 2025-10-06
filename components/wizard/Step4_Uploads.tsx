
import React, { useCallback } from 'react';
import { UploadedFile } from '../../types';
import { UploadIcon, TrashIcon } from '../ui/Icons';

interface Step4Props {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

const Step4Uploads: React.FC<Step4Props> = ({ files, onFilesChange }) => {

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const newUploadedFiles: Promise<UploadedFile>[] = selectedFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: e.target?.result as string,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newUploadedFiles).then(newFiles => {
        onFilesChange([...files, ...newFiles]);
      });
    }
  }, [files, onFilesChange]);

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Fotos & Dokumente hochladen</h3>
        <p className="mt-1 text-sm text-slate-500">Laden Sie Fotos vom Schaden, dem Fahrzeugschein und anderen relevanten Dokumenten hoch.</p>
      </div>
      
      <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 pt-5 pb-6">
        <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
            <div className="flex text-sm text-slate-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                    <span>Dateien auswählen</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                </label>
                <p className="pl-1">oder per Drag & Drop</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG, GIF bis zu 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div>
            <h4 className="text-md font-medium text-slate-800">Hochgeladene Dateien:</h4>
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {files.map((file, index) => (
                    <li key={index} className="relative group aspect-w-1 aspect-h-1">
                        <img src={file.dataUrl} alt={file.name} className="object-cover shadow-lg rounded-md w-full h-full" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors flex items-center justify-center">
                            <button onClick={() => removeFile(index)} className="p-2 bg-white/70 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon className="h-5 w-5"/>
                            </button>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 truncate">{file.name}</p>
                    </li>
                ))}
            </ul>
        </div>
      )}

    </div>
  );
};

export default Step4Uploads;
