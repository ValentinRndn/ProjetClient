import { useRef, useState } from "react";
import { Upload, X, File, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  compact?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
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
  compact = false,
  disabled = false,
  isLoading = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (disabled || isLoading) return;

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
    if (disabled || isLoading) return;

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
    if (disabled || isLoading) return;

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
    if (disabled || isLoading) return;
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Version compacte (bouton simple)
  if (compact) {
    return (
      <div className="shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled || isLoading}
        />
        {value ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              Téléversé
            </span>
            <button
              type="button"
              onClick={removeFile}
              disabled={disabled || isLoading}
              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            isLoading={isLoading}
          >
            {!isLoading && <Upload className="w-4 h-4" />}
            Téléverser
          </Button>
        )}
      </div>
    );
  }

  // Version standard (zone de drop)
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!value ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            disabled || isLoading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer",
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
          onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            disabled={disabled || isLoading}
          />
          {isLoading ? (
            <Loader2 className="w-8 h-8 mx-auto text-indigo-500 mb-2 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          )}
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
              disabled={disabled || isLoading}
              className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
