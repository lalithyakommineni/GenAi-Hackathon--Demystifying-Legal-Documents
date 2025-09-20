import React, { useState, useCallback, useRef } from 'react';
import { DocumentTextIcon, UploadIcon } from './Icons';

interface FileUploadProps {
  onFileChange: (file: { dataUrl: string | null; name: string | null }) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      const ALLOWED_MIME_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (file.type.startsWith('image/') || ALLOWED_MIME_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreview(base64String);
          setFileName(file.name);
          onFileChange({ dataUrl: base64String, name: file.name });
          setIsImage(file.type.startsWith('image/'));
        };
        reader.readAsDataURL(file);
      } else {
        // Handle unsupported file type
        console.warn(`Unsupported file type: ${file.type}`);
        setPreview(null);
        setFileName('');
        onFileChange({ dataUrl: null, name: null });
        setIsImage(false);
      }
    } else {
        setPreview(null);
        setFileName('');
        onFileChange({ dataUrl: null, name: null });
        setIsImage(false);
    }
  }, [onFileChange]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
        className={`w-full h-48 p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-colors
        ${isDragging ? 'border-indigo-400 bg-indigo-900/20' : 'border-gray-600 bg-gray-900 hover:border-gray-500'}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
        className="hidden"
      />
      {preview ? (
        <div className="flex flex-col items-center">
            {isImage ? (
                <img src={preview} alt="Preview" className="max-h-28 rounded-md object-contain" />
            ) : (
                <DocumentTextIcon className="w-16 h-16 text-gray-400" />
            )}
            <p className="mt-2 text-sm text-gray-300 truncate max-w-xs">{fileName}</p>
        </div>
      ) : (
        <div className="text-gray-400">
          <UploadIcon className="w-10 h-10 mx-auto" />
          <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
          <p className="text-xs">PNG, JPG, PDF, DOCX, XLSX</p>
        </div>
      )}
    </div>
  );
};
