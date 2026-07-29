import React from 'react';
import { Sparkles, Camera, Cpu, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Vision<span className="text-gradient">Search AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise-grade visual search & computer vision similarity matching engine powered by ResNet50, OpenCV, and FAISS Vector Search.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-mono text-cyan-400 border border-slate-700">
                PyTorch 2.4
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-mono text-purple-400 border border-slate-700">
                FAISS Vector CPU
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-mono text-blue-400 border border-slate-700">
                FastAPI
              </span>
            </div>
          </div>

          {/* Core Features */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core AI Features</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/search" className="hover:text-primary-400 transition-colors flex items-center gap-2"><Camera className="w-3.5 h-3.5 text-accent-400" /> Visual Image Upload</Link></li>
              <li><Link to="/search" className="hover:text-primary-400 transition-colors flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-purple-400" /> Webcam Capture Search</Link></li>
              <li><Link to="/results" className="hover:text-primary-400 transition-colors">FAISS Vector Indexing</Link></li>
              <li><Link to="/admin" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Admin Search Analytics</Link></li>
            </ul>
          </div>

          {/* Application Pages */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Application Pages</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Landing Showcase</Link></li>
              <li><Link to="/search" className="hover:text-primary-400 transition-colors">Visual Search Lab</Link></li>
              <li><Link to="/cart" className="hover:text-primary-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/admin" className="hover:text-primary-400 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Tech Spec */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">System Spec</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Extracts 2048-dimensional normalized embedding vectors from input images and performs sub-millisecond similarity scoring.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              API Server Status: Operational
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Intelligent Visual Product Search AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Next-Gen E-Commerce AI.
          </div>
        </div>
      </div>
    </footer>
  );
};
