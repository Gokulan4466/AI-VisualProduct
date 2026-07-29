import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      setIsListening(false);
    }
  }, [isOpen]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.start();
      } catch (err) {
        console.error('Speech recognition error:', err);
        setIsListening(false);
        setTranscript("Searching for red sneakers...");
      }
    } else {
      setTranscript("Red sneakers and wireless headphones...");
      setIsListening(false);
    }
  };

  const handleSearch = () => {
    if (transcript) {
      onClose();
      navigate(`/results?search=${encodeURIComponent(transcript)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-8 shadow-2xl border border-slate-700 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative inline-block mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-500 ${
            isListening 
              ? 'bg-gradient-to-tr from-accent-500 via-primary-600 to-secondary-600 shadow-2xl shadow-cyan-500/50 scale-110 animate-pulse'
              : 'bg-slate-800 border border-slate-700 text-slate-400'
          }`}>
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <MicOff className="w-10 h-10" />}
          </div>
          {isListening && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {isListening ? 'Listening for product search...' : 'Voice Search Ready'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Say something like <span className="text-cyan-400 font-medium">"Search red running sneakers"</span> or <span className="text-purple-400 font-medium">"Find leather jacket"</span>
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[64px] flex items-center justify-center mb-6">
          <p className="text-sm font-semibold text-slate-200 italic">
            {transcript ? `"${transcript}"` : 'Listening... Speak now'}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={startListening}
            className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            Try Again
          </button>
          <button
            onClick={handleSearch}
            disabled={!transcript}
            className="px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-lg shadow-primary-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" /> Search Catalog
          </button>
        </div>

      </div>
    </div>
  );
};
