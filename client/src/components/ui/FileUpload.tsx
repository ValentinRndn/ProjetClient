import { useRef, useState } from "react";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function FileUpload({
  label,
  accept,
  maxSizeMB = 5,
  value,
  onChange,
  error,
  helperText,
  required,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    // Vérifier la taille
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      alert(`Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB`);
      return;
    }
    onChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!value ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/50",
            "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            <span className="font-medium text-indigo-600">Cliquez pour téléverser</span> ou glissez-déposez
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Taille maximale: {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{value.name}</p>
                <p className="text-xs text-gray-500">
                  {(value.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {(error || helperText) && (
        <p className={cn("mt-1 text-sm", error ? "text-red-600" : "text-gray-500")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
