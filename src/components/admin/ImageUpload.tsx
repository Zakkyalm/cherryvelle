'use client';

import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

const MAX_SIZE_BYTES = 500 * 1024; // 500 KB

interface ImageUploadProps {
  value: string;          // current image (URL or base64 data URL)
  onChange: (value: string) => void;
  altValue?: string;      // current alt text
  onAltChange?: (alt: string) => void;
  previewHeight?: string; // tailwind height class, e.g. "h-32"
  label?: string;
  required?: boolean;
  altPlaceholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  altValue = '',
  onAltChange,
  previewHeight = 'h-32',
  label = 'Image',
  required = false,
  altPlaceholder = 'e.g. Cherryvelle skincare product banner',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    setError('');

    // Accept only WEBP — reject all other image formats
    if (file.type !== 'image/webp') {
      setError('Only WEBP files are accepted. Please convert your image to WEBP and try again.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`File is too large (${(file.size / 1024).toFixed(0)} KB). Maximum allowed size is 500 KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // reset input so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleClear = () => {
    setError('');
    onChange('');
  };

  return (
    <div>
      <label className="admin-label">
        {label} {required && '*'}
      </label>

      {value ? (
        /* Preview */
        <div className={`relative mt-1 rounded-xl overflow-hidden border border-cherry-100 ${previewHeight}`}>
          <img
            src={value}
            alt={altValue || 'Image preview'}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            aria-label="Remove image"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className={`mt-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${previewHeight}
            ${dragging
              ? 'border-cherry-500 bg-cherry-50'
              : 'border-cherry-200 bg-cherry-50/40 hover:border-cherry-400 hover:bg-cherry-50'
            }`}
        >
          <div className="w-10 h-10 rounded-full bg-cherry-100 flex items-center justify-center">
            <Upload className="w-5 h-5 text-cherry-500" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-cherry-600">Click or drag &amp; drop to upload</p>
            <p className="text-xs text-cherry-300 mt-0.5">WEBP only · Max 500 KB</p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/webp"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Error message */}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
          <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Alt text input — always shown when onAltChange is provided */}
      {onAltChange !== undefined && (
        <div className="mt-2">
          <label className="admin-label">
            Alt Text *
            <span className="ml-1 text-cherry-300 font-normal">(required for SEO &amp; accessibility)</span>
          </label>
          <input
            type="text"
            className="admin-input"
            placeholder={altPlaceholder}
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
            required
          />
        </div>
      )}
    </div>
  );
}
