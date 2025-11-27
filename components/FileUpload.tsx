import React, { useRef, useState } from 'react';
import { Upload, FileText, XCircle, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { DocumentType, QUARTERLY_DOCS, StudentDocument } from '../types';

interface FileUploadProps {
  label: string;
  docType: DocumentType;
  existingFiles: StudentDocument[];
  onUpload: (file: File, docType: DocumentType) => Promise<boolean>;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  docType, 
  existingFiles, 
  onUpload, 
  onDelete,
  isAdmin 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isQuarterly = QUARTERLY_DOCS.includes(docType);
  const maxFiles = isQuarterly ? 4 : 1;
  const canUpload = existingFiles.length < maxFiles || isAdmin;

  const validateFile = async (file: File): Promise<boolean> => {
    setValidating(true);
    setError(null);

    // 1. Check Format
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file format. Please upload PDF or JPG/PNG.");
      setValidating(false);
      return false;
    }

    // 2. Check Size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Max size is 5MB.");
      setValidating(false);
      return false;
    }

    // 3. Simulate Content Validation (OCR/AI check)
    // In a real app, this would send to backend. Here we simulate a delay.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate a random validation failure for demonstration if filename contains "fail"
    if (file.name.toLowerCase().includes('fail')) {
       setError("Validation Failed: Could not detect Student ID or Name in document.");
       setValidating(false);
       return false;
    }

    setValidating(false);
    return true;
  };

  const processUpload = async (file: File) => {
    if (!file) return;
    
    const isValid = await validateFile(file);
    if (isValid) {
      const success = await onUpload(file, docType);
      if (!success) setError("Upload failed. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
           <label className="block text-sm font-semibold text-gray-800">{label}</label>
           {isQuarterly && (
             <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mt-1 inline-block">
               Quarterly Upload ({existingFiles.length}/4)
             </span>
           )}
        </div>
      </div>
      
      {/* Upload Area */}
      {canUpload && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer relative
            ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !validating && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          
          {validating ? (
             <div className="flex flex-col items-center animate-pulse">
                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                   <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-gray-900">Validating Document...</p>
                <p className="text-xs text-gray-500">Checking format and content</p>
             </div>
          ) : (
             <div className="flex flex-col items-center">
               <div className="h-10 w-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                 <Upload size={20} />
               </div>
               <p className="text-sm font-medium text-gray-900">Click to upload or drag</p>
               <p className="text-xs text-gray-500 mt-1">PDF, JPG up to 5MB</p>
             </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center p-2 bg-red-50 text-red-700 rounded-md text-sm">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* File List */}
      <div className="mt-4 space-y-2">
        {existingFiles.map((file) => (
          <div key={file.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                ${file.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                <FileText size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500">{file.fileSize} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize border
                    ${file.status === 'verified' ? 'bg-green-100 text-green-800 border-green-200' : 
                      file.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                    {file.status}
                  </span>
                </div>
              </div>
            </div>
            {(file.status !== 'verified' || isAdmin) && (
              <button 
                onClick={() => onDelete(file.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Remove file"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};