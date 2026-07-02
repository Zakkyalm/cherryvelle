'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X, Video, Link, AlertCircle, CheckCircle2 } from 'lucide-react';

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
const MAX_SIZE_LABEL = '1 MB';
const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const ACCEPTED_LABEL = 'MP4, WebM, OGG, MOV';

type InputMode = 'upload' | 'url';

interface VideoUploadProps {
  value: string; // current video src (URL or object URL / data URL)
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function VideoUpload({
  value,
  onChange,
  label = 'Video Source',
  required = false,
}: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<InputMode>('upload');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null); // 0–100 or null
  const [urlInput, setUrlInput] = useState(value.startsWith('http') || value.startsWith('/') ? value : '');

  // ─── File processing ───────────────────────────────────────────────────────

  const processFile = useCallback((file: File) => {
    setError('');

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(`Unsupported format. Please upload ${ACCEPTED_LABEL}.`);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File is too large (${sizeMb} MB). Maximum allowed size is ${MAX_SIZE_LABEL}.`);
      return;
    }

    // Simulate chunked read with progress
    setProgress(0);
    const objectUrl = URL.createObjectURL(file);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 25 + 10; // random step 10–35
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setProgress(null);
          onChange(objectUrl);
        }, 400);
      } else {
        setProgress(Math.round(current));
      }
    }, 120);
  }, [onChange]);

  // ─── Event handlers ────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
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
    setProgress(null);
    setUrlInput('');
    onChange('');
  };

  const handleUrlApply = () => {
    setError('');
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please enter a valid video URL.');
      return;
    }
    onChange(trimmed);
  };

  // ─── Derived ───────────────────────────────────────────────────────────────

  const hasVideo = Boolean(value);

  return (
    <div className="space-y-2">
      {/* Label */}
      <p className="admin-label mb-0">
        {label} {required && '*'}
      </p>

      {/* Mode tabs */}
      <div className="flex rounded-xl border border-cherry-100 overflow-hidden w-full sm:w-auto sm:inline-flex">
        <button
          type="button"
          onClick={() => { setMode('upload'); setError(''); }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors
            ${mode === 'upload'
              ? 'bg-cherry-700 text-white'
              : 'bg-white text-cherry-400 hover:text-cherry-600 hover:bg-cherry-50'
            }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => { setMode('url'); setError(''); }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors border-l border-cherry-100
            ${mode === 'url'
              ? 'bg-cherry-700 text-white'
              : 'bg-white text-cherry-400 hover:text-cherry-600 hover:bg-cherry-50'
            }`}
        >
          <Link className="w-3.5 h-3.5" />
          URL Input
        </button>
      </div>

      {/* ── Upload mode ─────────────────────────────────────────────────────── */}
      {mode === 'upload' && (
        <>
          {hasVideo ? (
            /* Video preview */
            <div className="relative rounded-2xl overflow-hidden border border-cherry-100 bg-cherry-900">
              <video
                key={value}
                src={value}
                controls
                playsInline
                className="w-full max-h-64 object-contain"
              />
              <button
                type="button"
                onClick={handleClear}
                aria-label="Remove video"
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Video ready
              </div>
            </div>
          ) : progress !== null ? (
            /* Upload progress */
            <div className="rounded-2xl border border-cherry-100 bg-cherry-50/40 px-6 py-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cherry-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-cherry-500 animate-pulse" />
              </div>
              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex justify-between text-xs text-cherry-500 font-medium">
                  <span>Uploading video…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-cherry-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cherry-600 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload video"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors py-10 px-6
                ${dragging
                  ? 'border-cherry-500 bg-cherry-50 scale-[1.01]'
                  : 'border-cherry-200 bg-cherry-50/40 hover:border-cherry-400 hover:bg-cherry-50'
                }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors
                ${dragging ? 'bg-cherry-200' : 'bg-cherry-100'}`}
              >
                <Upload className={`w-7 h-7 transition-colors ${dragging ? 'text-cherry-700' : 'text-cherry-500'}`} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-cherry-700">
                  {dragging ? 'Drop video here' : 'Click or drag & drop to upload'}
                </p>
                <p className="text-xs text-cherry-400">{ACCEPTED_LABEL}</p>
                <p className="text-xs text-cherry-300">Max size: {MAX_SIZE_LABEL}</p>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={handleFileChange}
            aria-hidden="true"
          />
        </>
      )}

      {/* ── URL mode ─────────────────────────────────────────────────────────── */}
      {mode === 'url' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              className="admin-input flex-1 min-w-0"
              placeholder="e.g. /vdo.mp4 or https://cdn.example.com/video.mp4"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlApply()}
            />
            <button
              type="button"
              onClick={handleUrlApply}
              className="shrink-0 px-4 py-2.5 bg-cherry-700 text-white text-sm font-semibold rounded-xl hover:bg-cherry-800 transition-colors"
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-cherry-300">
            Place .mp4 files in the <code className="bg-cherry-50 px-1 rounded">/public</code> folder and reference them as <code className="bg-cherry-50 px-1 rounded">/filename.mp4</code>
          </p>

          {/* Preview after URL applied */}
          {hasVideo && (
            <div className="relative rounded-2xl overflow-hidden border border-cherry-100 bg-cherry-900 mt-2">
              <video
                key={value}
                src={value}
                controls
                playsInline
                className="w-full max-h-64 object-contain"
              />
              <button
                type="button"
                onClick={handleClear}
                aria-label="Remove video"
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Video ready
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {error}
        </p>
      )}
    </div>
  );
}
