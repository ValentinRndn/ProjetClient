import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

// ============================================
// TEXT INPUT
// ============================================
export const TextInput = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder,
  type = 'text',
  pattern,
  maxLength,
  disabled = false
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block font-semibold text-bleu-nuit">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      pattern={pattern}
      maxLength={maxLength}
      disabled={disabled}
      required={required}
      aria-invalid={error ? 'true' : 'false'}
      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:border-indigo-violet focus:ring-indigo-violet/20'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
    />
    {error && (
      <p className="text-red-600 text-sm flex items-center gap-2">
        <AlertCircle size={16} />
        {error}
      </p>
    )}
  </div>
);

// ============================================
// SELECT
// ============================================
export const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  placeholder = 'Sélectionnez une option',
  disabled = false
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block font-semibold text-bleu-nuit">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:border-indigo-violet focus:ring-indigo-violet/20'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-600 text-sm flex items-center gap-2">
        <AlertCircle size={16} />
        {error}
      </p>
    )}
  </div>
);

// ============================================
// TEXTAREA
// ============================================
export const TextArea = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder,
  maxLength,
  rows = 5,
  showCounter = false
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block font-semibold text-bleu-nuit">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      required={required}
      aria-invalid={error ? 'true' : 'false'}
      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:border-indigo-violet focus:ring-indigo-violet/20'
      }`}
    />
    {showCounter && maxLength && (
      <p className="text-sm text-gray-600 text-right">
        {value?.length || 0}/{maxLength}
      </p>
    )}
    {error && (
      <p className="text-red-600 text-sm flex items-center gap-2">
        <AlertCircle size={16} />
        {error}
      </p>
    )}
  </div>
);

// ============================================
// CHECKBOX GROUP
// ============================================
export const CheckboxGroup = ({
  label,
  name,
  options,
  selectedValues = [],
  onChange,
  error
}) => {
  const handleChange = (optionValue) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange({ target: { name, value: newValues } });
  };

  return (
    <div className="space-y-3">
      <label className="block font-semibold text-bleu-nuit">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="w-5 h-5 text-indigo-violet border-gray-300 rounded focus:ring-2 focus:ring-indigo-violet cursor-pointer"
            />
            <span className="text-bleu-nuit">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-red-600 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================
// RADIO GROUP
// ============================================
export const RadioGroup = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  error,
  required
}) => (
  <div className="space-y-3">
    <label className="block font-semibold text-bleu-nuit">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
            selectedValue === option.value
              ? 'border-indigo-violet bg-indigo-violet/5'
              : 'border-gray-300 hover:border-indigo-violet/50'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            required={required}
            className="w-5 h-5 text-indigo-violet border-gray-300 focus:ring-2 focus:ring-indigo-violet cursor-pointer"
          />
          <div>
            <div className="font-bold text-bleu-nuit">{option.label}</div>
            {option.description && (
              <div className="text-sm text-gray-600 mt-1">{option.description}</div>
            )}
          </div>
        </label>
      ))}
    </div>
    {error && (
      <p className="text-red-600 text-sm flex items-center gap-2">
        <AlertCircle size={16} />
        {error}
      </p>
    )}
  </div>
);

// ============================================
// TAG SELECTOR
// ============================================
export const TagSelector = ({
  label,
  availableTags = [],
  selectedTags = [],
  onChange,
  placeholder = 'Rechercher...',
  allowCustom = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm && allowCustom) {
      e.preventDefault();
      addTag(searchTerm);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-semibold text-bleu-nuit">{label}</label>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-violet text-white rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                aria-label={`Retirer ${tag}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20 transition-all"
        />

        {/* Dropdown */}
        {isOpen && searchTerm && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {filteredTags.length > 0 ? (
                filteredTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-violet/10 transition-colors text-bleu-nuit"
                  >
                    {tag}
                  </button>
                ))
              ) : allowCustom ? (
                <button
                  type="button"
                  onClick={() => addTag(searchTerm)}
                  className="w-full px-4 py-3 text-left hover:bg-indigo-violet/10 transition-colors text-bleu-nuit"
                >
                  Ajouter "{searchTerm}"
                </button>
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  Aucun résultat
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// FILE UPLOADER
// ============================================
export const FileUploader = ({
  label,
  name,
  accept,
  onChange,
  preview,
  error,
  required,
  maxSize = 10 * 1024 * 1024, // 10MB
  helperText
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.size > maxSize) {
      alert(`Le fichier est trop volumineux. Taille maximum : ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <label className="block font-semibold text-bleu-nuit">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {helperText && (
        <p className="text-sm text-gray-600">{helperText}</p>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-indigo-violet bg-indigo-violet/5'
            : error
            ? 'border-red-500'
            : 'border-gray-300 hover:border-indigo-violet'
        }`}
      >
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={handleChange}
          required={required && !preview}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="space-y-3">
            {accept?.includes('image') && (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-cover"
              />
            )}
            <p className="text-sm text-gray-600">Fichier sélectionné</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange({ file: null, preview: null });
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Supprimer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto text-gray-400" size={48} />
            <div>
              <p className="font-medium text-bleu-nuit">
                Glissez un fichier ici ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {accept || 'Tous les formats'} • Max {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
};
