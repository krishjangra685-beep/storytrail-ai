'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, Loader2, Sparkles, MapPin, Lightbulb,
  Image as ImageIcon, X, AlertCircle, ChevronRight
} from 'lucide-react';
import { analyzeImageFile, analyzeImageBase64 } from '@/lib/api';
import type { VisionResponse } from '@/types';
import { fileToBase64 } from '@/lib/utils';

export default function ScannerPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<VisionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userContext, setUserContext] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, or WebP)');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
    setError(null);
    setIsLoading(true);
    try {
      const res = await analyzeImageFile(file, userContext || undefined);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setError('Camera access denied. Please allow camera access or upload an image.');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreview(dataUrl);
    setCameraActive(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());

    setResult(null);
    setError(null);
    setIsLoading(true);
    try {
      const base64 = dataUrl.split(',')[1]!;
      const res = await analyzeImageBase64({ imageBase64: base64, mimeType: 'image/jpeg', userContext: userContext || undefined });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraActive(false);
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    stopCamera();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass border border-blue-500/20 px-4 py-2 rounded-full text-sm text-blue-300 mb-6">
            <Camera className="w-3.5 h-3.5" />
            Gemini Vision Scanner
          </div>
          <h1 className="text-display text-white mb-4">
            Point. Shoot. <span className="gradient-text">Discover.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Upload any photo or use your camera — temples, food, art, monuments. Gemini AI instantly reveals their history, story, and cultural significance.
          </p>
        </motion.div>

        {/* Optional context */}
        <div className="max-w-lg mx-auto mb-6">
          <input
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
            placeholder="Add context (optional): e.g. 'This is in Rajasthan, India'"
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 text-sm"
          />
        </div>

        {/* Camera / Upload area */}
        {!preview && !cameraActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
              isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/[0.1] hover:border-white/[0.2]'
            }`}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg mb-1">Drop your image here</p>
                <p className="text-zinc-500 text-sm">or choose an option below</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-glass flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                <button
                  onClick={startCamera}
                  className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
                >
                  <Camera className="w-4 h-4" />
                  Use Camera
                </button>
              </div>
              <p className="text-xs text-zinc-600">Supports JPEG, PNG, WebP • Max 10MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </motion.div>
        )}

        {/* Camera view */}
        {cameraActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-3xl overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-3xl" />
            <div className="absolute inset-0 flex items-end justify-center pb-8 gap-4">
              <button onClick={stopCamera} className="btn-glass p-4 rounded-2xl">
                <X className="w-6 h-6" />
              </button>
              <button onClick={capturePhoto} className="btn-primary p-5 rounded-2xl shadow-2xl shadow-violet-500/40">
                <Camera className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Preview */}
        {preview && !cameraActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <div className="relative rounded-3xl overflow-hidden mb-6">
              <img src={preview} alt="Scanned" className="w-full max-h-80 object-cover" />
              {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse-glow">
                    <Sparkles className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <p className="text-white font-medium">Gemini is analyzing your image...</p>
                </div>
              )}
            </div>
            <button onClick={reset} className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              {/* Identified */}
              <div className="glass border border-violet-500/20 bg-violet-500/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Identified</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{result.identified}</h2>
                <span className="text-sm text-violet-300 capitalize mt-1 inline-block">{result.category.replace('_', ' ')}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3">📜 History</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{result.history}</p>
                </div>
                <div className="glass border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-blue-400 mb-3">📖 Story</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{result.story}</p>
                </div>
                <div className="glass border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-3">🌏 Cultural Context</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{result.culturalContext}</p>
                </div>
                {result.architecture && (
                  <div className="glass border border-white/[0.08] rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-purple-400 mb-3">🏛️ Architecture</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{result.architecture}</p>
                  </div>
                )}
              </div>

              <div className="glass border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" /> Fascinating Facts
                </h3>
                <div className="space-y-2">
                  {result.interestingFacts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold text-sm">{i + 1}.</span>
                      <p className="text-zinc-400 text-sm">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.nearbyAttractions.length > 0 && (
                <div className="glass border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" /> Nearby Attractions
                  </h3>
                  <div className="space-y-2">
                    {result.nearbyAttractions.map((place, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <p className="text-zinc-400 text-sm">{place}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={reset} className="btn-glass w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" />
                Scan Another Image
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
