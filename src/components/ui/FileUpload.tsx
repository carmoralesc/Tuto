import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
}

const FileUpload = React.memo<FileUploadProps>(({ label, accept = '.pdf', onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-50' : selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-300'
        }`}
      >
        <input type="file" accept={accept} onChange={handleChange} className="hidden" id={`file-${label}`} />
        <label htmlFor={`file-${label}`} className="cursor-pointer">
          {selectedFile ? (
            <div className="flex items-center justify-center gap-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
          ) : (
            <div className="text-gray-500">
              <svg className="mx-auto w-10 h-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm">Arrastra un archivo aquí o <span className="text-blue-600 font-medium">selecciona</span></p>
              <p className="text-xs mt-1 text-gray-400">Solo archivos PDF</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';
export default FileUpload;
