import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Camera, Image as ImageIcon, Sparkles, X, Search, 
  RefreshCw, Mic, FileText, CheckCircle2, ArrowRight, Sparkle,
  Watch, Footprints, Flame
} from 'lucide-react';
import { executeVisualSearch, MOCK_PRODUCTS } from '../services/api';
import { AIProgressLoader } from '../components/AIProgressLoader';
import { CameraModal } from '../components/CameraModal';
import { VoiceSearchModal } from '../components/VoiceSearchModal';

export const VisualSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const sampleImages = [
    { title: "Red Performance Shoe", category: "Footwear", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", icon: Footprints },
    { title: "Chronos Leather Watch", category: "Watches", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80", icon: Watch },
    { title: "Royal Amber Oud Perfume", category: "Perfumes", url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80", icon: Flame },
    { title: "Velvet Cloud Slippers", category: "Slippers", url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80", icon: Sparkles }
  ];

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setSelectedImage(sampleUrl);
    setPreviewUrl(sampleUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCameraCapture = (base64Image: string) => {
    setSelectedImage(base64Image);
    setPreviewUrl(base64Image);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleStartSearch = async () => {
    if (!selectedImage) return;

    setIsSearching(true);
    setPipelineStep(0);

    const stepInterval = setInterval(() => {
      setPipelineStep(prev => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          return 3;
        }
        return prev + 1;
      });
    }, 600);

    try {
      const response = await executeVisualSearch(selectedImage);
      setTimeout(() => {
        setIsSearching(false);
        navigate('/results', { state: { searchData: response } });
      }, 2600);
    } catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 bg-slate-50/50 dark:bg-slate-950/50">
      
      {/* Header Banner - Seamless & Clean White Light Theme */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold shadow-sm">
          <Sparkle className="w-4 h-4 text-cyan-500 fill-cyan-500 animate-spin-slow" />
          <span>ResNet50 + FAISS Instant Visual Search</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Visual Product <span className="text-gradient">Search</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          Upload any photo of shoes, watches, perfumes, or slippers to instantly discover visually identical products from our 50+ item catalog.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 backdrop-blur-xl">
        
        {isSearching ? (
          <AIProgressLoader currentStep={pipelineStep} />
        ) : previewUrl ? (
          /* Preview Mode */
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                <ImageIcon className="w-4 h-4 text-cyan-500" /> Target Photo Selected
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Select Different Photo
              </button>
            </div>

            <div className="relative max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-xl bg-slate-900">
              <img
                src={previewUrl}
                alt="Selected Product"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/90 text-cyan-300 text-[11px] font-mono px-3 py-1 rounded-full border border-cyan-500/40 shadow-lg">
                Ready for ResNet50 Embedding
              </div>
            </div>

            {/* Start Search Action */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleStartSearch}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                Find Visually Similar Products
              </button>
            </div>
          </div>
        ) : (
          /* Drag & Drop Upload Zone */
          <div className="space-y-8">
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                isDragging
                  ? 'border-primary-500 bg-primary-500/5 scale-102 shadow-xl'
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-primary-500 bg-slate-50/80 dark:bg-slate-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
              />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Upload className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Drag & Drop Product Image Here
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click to browse from your computer (JPG, PNG, WEBP)
                </p>
              </div>

              <span className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md hover:bg-primary-600 dark:hover:bg-primary-400 transition-all">
                Browse Computer Files
              </span>
            </div>

            {/* Quick Web Cam / Voice Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Camera className="w-4 h-4 text-rose-500" />
                Capture with Webcam
              </button>

              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Mic className="w-4 h-4 text-accent-500" />
                Voice Search Assistant
              </button>
            </div>

            {/* Quick 1-Click Sample Testing Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Try Instant Visual Search with 1-Click Samples:
                </h4>
                <span className="text-[11px] text-cyan-500 font-mono font-bold">50+ Catalog Items</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sampleImages.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(s.url)}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-400 text-left transition-all duration-300 hover:scale-102 group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-900">
                        <img src={s.url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate block">{s.title}</span>
                        <Icon className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Camera & Voice Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />

    </div>
  );
};
