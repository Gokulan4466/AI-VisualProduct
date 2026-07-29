import React from 'react';
import { Cpu, CheckCircle2, Sparkles, Database, Layers, Scan } from 'lucide-react';

interface AIProgressLoaderProps {
  currentStep: number; // 0 to 4
}

const STEPS = [
  { label: "Image Preprocessing", icon: Scan, desc: "OpenCV resizing to 224x224 & RGB normalization" },
  { label: "ResNet50 Deep Feature Extraction", icon: Cpu, desc: "Generating 2048-dimensional feature embedding vector" },
  { label: "FAISS Vector Indexing", icon: Database, desc: "Comparing vector space distance against product catalog" },
  { label: "Confidence Ranking", icon: Layers, desc: "Computing color, shape & texture similarity scores" }
];

export const AIProgressLoader: React.FC<AIProgressLoaderProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xl mx-auto glass-card rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6 animate-fadeIn">
      
      <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-white">AI Vision Search in Progress</h3>
          <p className="text-xs text-slate-400">Executing Deep Learning Computer Vision Pipeline...</p>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                isDone
                  ? 'bg-slate-900/40 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-primary-950/60 border-primary-500 shadow-lg shadow-primary-500/20 text-white ring-2 ring-primary-500/40'
                  : 'bg-slate-900/20 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                isDone
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isCurrent
                  ? 'bg-primary-600 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">{step.label}</h4>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800 animate-pulse">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-mono text-emerald-400">Completed</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="pt-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
          <span>Pipeline Progress</span>
          <span className="text-cyan-400 font-bold">{Math.min(100, (currentStep + 1) * 25)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 transition-all duration-500"
            style={{ width: `${Math.min(100, (currentStep + 1) * 25)}%` }}
          />
        </div>
      </div>

    </div>
  );
};
