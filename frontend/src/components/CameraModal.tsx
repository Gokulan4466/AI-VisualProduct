import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageBase64: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('Unable to access camera. Please allow camera permissions or try uploading an image instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center border border-primary-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live Camera Search</h3>
              <p className="text-xs text-slate-400">Position the product in frame to capture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative bg-slate-950 min-h-[360px] flex items-center justify-center">
          {errorMsg ? (
            <div className="p-8 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-rose-300">{errorMsg}</p>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Snapshot"
              className="w-full max-h-[420px] object-contain rounded-lg"
            />
          ) : (
            <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Target Bounding Overlay Box */}
              <div className="absolute inset-0 border-2 border-dashed border-cyan-400/60 m-12 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-xs font-mono bg-slate-900/80 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/40 shadow-lg">
                  AI Target Area
                </span>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retake Photo
              </button>
              <button
                onClick={confirmCapture}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-xs font-bold shadow-lg shadow-primary-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Check className="w-4 h-4" /> Search Product Now
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={takeSnapshot}
                disabled={!!errorMsg}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl ring-4 ring-rose-500/30 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
