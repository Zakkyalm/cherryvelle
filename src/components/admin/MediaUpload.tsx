'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X, Video, Image as ImageIcon, Link, AlertCircle, CheckCircle2 } from 'lucide-react';

// ─── Video config ─────────────────────────────────────────────────────────────
const VIDEO_MAX_BYTES = 1 * 1024 * 1024; // 1 MB
const VIDEO_MAX_LABEL = '1 MB';
const VIDEO_ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const VIDEO_ACCEPTED_LABEL = 'MP4, WebM, OGG, MOV';
const VIDEO_ACCEPT_ATTR = 'video/mp4,video/webm,video/ogg,video/quicktime';

// ─── Image config ─────────────────────────────────────────────────────────────
const IMAGE_MAX_BYTES = 500 * 1024; // 500 KB
const IMAGE_MAX_LABEL = '500 KB';
const IMAGE_ACCEPTED_TYPES = ['image/webp'];
const IMAGE_ACCEPTED_LABEL = 'WEBP only';
const IMAGE_ACCEPT_ATTR = 'image/webp';

type InputMode = 'upload' | 'url';

// ─── Video Upload sub-component ───────────────────────────────────────────────

interface VideoUploadProps {
  value: string;
  onChange: (value: string) => void;
}

function VideoUploadField({ value, onChange }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<InputMode>(
    value && (value.startsWith('blob:') || value === '') ? 'upload' : value ? 'url' : 'upload'
  );
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState(
    value && !value.startsWith('blob:') ? value : ''
  );

  const processFile = useCallback(
    (file: File) => {
      setError('');
      if (!VIDEO_ACCEPTED_TYPES.includes(file.type)) {
        setError(`Unsupported format. Please upload ${VIDEO_ACCEPTED_LABEL}.`);
        return;
      }
      if (file.size > VIDEO_MAX_BYTES) {
        setError(
          `File too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max: ${VIDEO_MAX_LABEL}.`
        );
        return;
      }
      setProgress(0);
      const objectUrl = URL.createObjectURL(file);
      let current = 0;
      const interval = setInterval(() => {
        current += Math.random() * 25 + 10;
        if (current >= 100) {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => { setProgress(null); onChange(objectUrl); }, 400);
        } else {
          setProgress(Math.round(current));
        }
      }, 120);
    },
    [onChange]
  );

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

  const handleClear = () => { setError(''); setProgress(null); setUrlInput(''); onChange(''); };

  const handleUrlApply = () => {
    setError('');
    const trimmed = urlInput.trim();
    if (!trimmed) { setError('Please enter a valid video URL.'); return; }
    onChange(trimmed);
  };

  const hasVideo = Boolean(value);

  return (
    <div className="space-y-2">
      {/* Mode tabs */}
      <div className="flex rounded-xl border border-cherry-100 overflow-hidden w-full sm:w-auto sm:inline-flex">
        {(['upload', 'url'] as InputMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(''); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${m === 'url' ? 'border-l border-cherry-100' : ''}
              ${mode === m ? 'bg-cherry-700 text-white' : 'bg-white text-cherry-400 hover:text-cherry-600 hover:bg-cherry-50'}`}
          >
            {m === 'upload' ? <Upload className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
            {m === 'upload' ? 'Upload File' : 'URL Input'}
          </button>
        ))}
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <>
          {hasVideo ? (
            <div className="relative rounded-2xl overflow-hidden border border-cherry-100 bg-cherry-900">
              <video key={value} src={value} controls playsInline className="w-full max-h-64 object-contain" />
              <button type="button" onClick={handleClear} aria-label="Remove video"
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Video ready
              </div>
            </div>
          ) : progress !== null ? (
            <div className="rounded-2xl border border-cherry-100 bg-cherry-50/40 px-6 py-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cherry-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-cherry-500 animate-pulse" />
              </div>
              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex justify-between text-xs text-cherry-500 font-medium">
                  <span>Uploading video…</span><span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-cherry-100 overflow-hidden">
                  <div className="h-full rounded-full bg-cherry-600 transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div
              role="button" tabIndex={0} aria-label="Upload video"
              onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors py-10 px-6
                ${dragging ? 'border-cherry-500 bg-cherry-50 scale-[1.01]' : 'border-cherry-200 bg-cherry-50/40 hover:border-cherry-400 hover:bg-cherry-50'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-cherry-200' : 'bg-cherry-100'}`}>
                <Upload className={`w-7 h-7 transition-colors ${dragging ? 'text-cherry-700' : 'text-cherry-500'}`} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-cherry-700">{dragging ? 'Drop video here' : 'Click or drag & drop to upload'}</p>
                <p className="text-xs text-cherry-400">{VIDEO_ACCEPTED_LABEL}</p>
                <p className="text-xs text-cherry-300">Max size: {VIDEO_MAX_LABEL}</p>
              </div>
            </div>
          )}
          <input ref={inputRef} type="file" accept={VIDEO_ACCEPT_ATTR} className="hidden" onChange={handleFileChange} aria-hidden="true" />
        </>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="url" className="admin-input flex-1 min-w-0"
              placeholder="e.g. /vdo.mp4 or https://cdn.example.com/video.mp4"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlApply()}
            />
            <button type="button" onClick={handleUrlApply}
              className="shrink-0 px-4 py-2.5 bg-cherry-700 text-white text-sm font-semibold rounded-xl hover:bg-cherry-800 transition-colors">
              Apply
            </button>
          </div>
          <p className="text-xs text-cherry-300">
            Place .mp4 files in the <code className="bg-cherry-50 px-1 rounded">/public</code> folder and reference them as <code className="bg-cherry-50 px-1 rounded">/filename.mp4</code>
          </p>
          {hasVideo && (
            <div className="relative rounded-2xl overflow-hidden border border-cherry-100 bg-cherry-900 mt-2">
              <video key={value} src={value} controls playsInline className="w-full max-h-64 object-contain" />
              <button type="button" onClick={handleClear} aria-label="Remove video"
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Video ready
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />{error}
        </p>
      )}
    </div>
  );
}

// ─── Image Upload sub-component ───────────────────────────────────────────────

interface ImageUploadFieldProps {
  value: string;       // current image src
  altValue: string;    // current alt text
  onChange: (src: string) => void;
  onAltChange: (alt: string) => void;
}

function ImageUploadField({ value, altValue, onChange, onAltChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError('');
      if (!IMAGE_ACCEPTED_TYPES.includes(file.type)) {
        setError(`Only WEBP format is supported.`);
        return;
      }
      if (file.size > IMAGE_MAX_BYTES) {
        setError(
          `File too large (${(file.size / 1024).toFixed(0)} KB). Max: ${IMAGE_MAX_LABEL}.`
        );
        return;
      }
      setProgress(0);
      const objectUrl = URL.createObjectURL(file);
      let current = 0;
      const interval = setInterval(() => {
        current += Math.random() * 30 + 15;
        if (current >= 100) {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => { setProgress(null); onChange(objectUrl); }, 300);
        } else {
          setProgress(Math.round(current));
        }
      }, 100);
    },
    [onChange]
  );

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

  const handleClear = () => { setError(''); setProgress(null); onChange(''); };

  const hasImage = Boolean(value);

  return (
    <div className="space-y-3">
      {/* Drop zone or preview */}
      {hasImage ? (
        <div className="relative rounded-2xl overflow-hidden border border-cherry-100 bg-cherry-50">
          <img src={value} alt={altValue || 'Preview'} className="w-full max-h-64 object-contain" />
          <button type="button" onClick={handleClear} aria-label="Remove image"
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Image ready
          </div>
        </div>
      ) : progress !== null ? (
        <div className="rounded-2xl border border-cherry-100 bg-cherry-50/40 px-6 py-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cherry-100 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-cherry-500 animate-pulse" />
          </div>
          <div className="w-full max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs text-cherry-500 font-medium">
              <span>Uploading image…</span><span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-cherry-100 overflow-hidden">
              <div className="h-full rounded-full bg-cherry-600 transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button" tabIndex={0} aria-label="Upload image"
          onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors py-10 px-6
            ${dragging ? 'border-cherry-500 bg-cherry-50 scale-[1.01]' : 'border-cherry-200 bg-cherry-50/40 hover:border-cherry-400 hover:bg-cherry-50'}`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-cherry-200' : 'bg-cherry-100'}`}>
            <ImageIcon className={`w-7 h-7 transition-colors ${dragging ? 'text-cherry-700' : 'text-cherry-500'}`} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-cherry-700">{dragging ? 'Drop image here' : 'Click or drag & drop to upload'}</p>
            <p className="text-xs text-cherry-400">{IMAGE_ACCEPTED_LABEL}</p>
            <p className="text-xs text-cherry-300">Max size: {IMAGE_MAX_LABEL}</p>
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPT_ATTR} className="hidden" onChange={handleFileChange} aria-hidden="true" />

      {/* Alt text */}
      <div>
        <label className="admin-label">
          Alt Text *
          <span className="ml-1 text-cherry-300 font-normal">(required for SEO &amp; accessibility)</span>
        </label>
        <input
          type="text"
          className="admin-input"
          placeholder="e.g. Cherryvelle skincare summer collection promotional image"
          value={altValue}
          onChange={(e) => onAltChange(e.target.value)}
        />
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />{error}
        </p>
      )}
    </div>
  );
}

// ─── Public MediaUpload component ─────────────────────────────────────────────

export type { InputMode };

export interface MediaUploadProps {
  contentType: 'video' | 'image';
  // Video
  videoSrc: string;
  onVideoChange: (src: string) => void;
  poster: string;
  posterAlt: string;
  onPosterChange: (url: string) => void;
  onPosterAltChange: (alt: string) => void;
  // Image
  imageSrc: string;
  imageAlt: string;
  onImageChange: (src: string) => void;
  onImageAltChange: (alt: string) => void;
}

export function MediaUpload({
  contentType,
  videoSrc, onVideoChange,
  poster, posterAlt, onPosterChange, onPosterAltChange,
  imageSrc, imageAlt, onImageChange, onImageAltChange,
}: MediaUploadProps) {
  return (
    <div className="space-y-4">
      {contentType === 'video' && (
        <>
          <div>
            <label className="admin-label">Video Source *</label>
            <VideoUploadField value={videoSrc} onChange={onVideoChange} />
          </div>

          {/* Poster (optional for video) */}
          <div>
            <label className="admin-label">
              Poster / Thumbnail URL
              <span className="ml-1 text-cherry-300 font-normal">(optional fallback image)</span>
            </label>
            <input
              className="admin-input"
              placeholder="https://images.unsplash.com/..."
              value={poster}
              onChange={(e) => onPosterChange(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">
              Poster Alt Text
              <span className="ml-1 text-cherry-300 font-normal">(required for SEO &amp; accessibility)</span>
            </label>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. Cherryvelle skincare glow promotional video thumbnail"
              value={posterAlt}
              onChange={(e) => onPosterAltChange(e.target.value)}
            />
          </div>
        </>
      )}

      {contentType === 'image' && (
        <div>
          <label className="admin-label">Image (WEBP only, max 500 KB) *</label>
          <ImageUploadField
            value={imageSrc}
            altValue={imageAlt}
            onChange={onImageChange}
            onAltChange={onImageAltChange}
          />
        </div>
      )}
    </div>
  );
}
