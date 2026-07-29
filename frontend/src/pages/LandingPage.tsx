import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, Sparkles, Search, Cpu, Zap, ArrowRight, ShieldCheck, 
  Layers, CheckCircle2, Star, Image as ImageIcon, RefreshCw,
  Watch, Footprints, Flame, Sparkle
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategoryTab, setActiveCategoryTab] = useState<'Footwear' | 'Watches' | 'Perfumes' | 'Slippers'>('Footwear');

  const showcaseCategoryImages = {
    Footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    Watches: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    Perfumes: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    Slippers: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
  };

  const currentCategoryProducts = MOCK_PRODUCTS.filter(p => 
    p.category.toLowerCase() === activeCategoryTab.toLowerCase()
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-hero">
      
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-primary-600/15 via-secondary-600/15 to-accent-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        
        {/* Startup Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 dark:bg-slate-900/90 border border-primary-500/30 text-slate-200 text-xs font-bold mb-8 shadow-xl backdrop-blur-md animate-pulse">
          <Sparkle className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          <span>Computer Vision & PyTorch ResNet50 Powered Search</span>
        </div>

        {/* Seamless Large Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.15] mb-6">
          Search Products <br className="hidden sm:inline" />
          Using <span className="text-gradient">Images</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Upload any photo of shoes, watches, perfumes, or slippers to discover visually identical products from our catalog in milliseconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => navigate('/search')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Search Products Visually
          </button>

          <button
            onClick={() => navigate('/results')}
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            Explore Catalog
          </button>
        </div>

        {/* Interactive Visual Showcase Card */}
        <div className="relative max-w-5xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Category Tabs Bar */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'Footwear', label: 'Shoes & Sneakers', icon: Footprints },
              { id: 'Watches', label: 'Watches', icon: Watch },
              { id: 'Perfumes', label: 'Perfumes', icon: Flame },
              { id: 'Slippers', label: 'Slippers & Slides', icon: Sparkles }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
            
            {/* Target Input Box */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> Input Photo</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">Live AI Preprocessed</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl aspect-square bg-slate-900">
                <img
                  src={showcaseCategoryImages[activeCategoryTab]}
                  alt="Search Input"
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/90 text-cyan-300 text-[11px] font-mono px-3 py-1 rounded-full border border-cyan-500/40 shadow-lg">
                  2048-dim Feature Vector Match
                </div>
              </div>
            </div>

            {/* AI Vector Connection Arrow */}
            <div className="md:col-span-2 flex flex-col items-center justify-center py-4 md:py-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse">
                <ArrowRight className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 mt-2 uppercase tracking-widest">FAISS L2</span>
            </div>

            {/* Matching Results Showcase */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <span>Visual Match Results</span>
                <span className="text-cyan-400 font-extrabold">98.4% Match</span>
              </div>

              <div className="space-y-2.5">
                {(currentCategoryProducts.length > 0 ? currentCategoryProducts : MOCK_PRODUCTS).slice(0, 3).map((p, idx) => (
                  <div key={p.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 hover:border-cyan-500/40 transition-colors">
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <p className="text-[11px] text-slate-400">${p.price.toFixed(2)} • {p.brand}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
                      {[98.4, 96.2, 94.5][idx]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Modern Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Visual AI Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Powered by high-performance computer vision algorithms and real-time similarity indexing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-primary-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Webcam & File Search</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload photos from your computer, drag & drop images, or capture instant snapshots using your webcam.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-secondary-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">ResNet50 Deep Embeddings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Extracts 2048-dimensional visual feature representations encoding shapes, colors, and textures.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-accent-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/10 text-accent-600 dark:text-accent-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">FAISS Similarity Search</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sub-millisecond vector indexing returns top visually matching items with exact match score breakdowns.
            </p>
          </div>

        </div>
      </section>

      {/* Seamless Workflow Steps */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              How Visual Search Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">From photo upload to recommendations in 4 steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Upload Photo", desc: "Drag & drop image or snap webcam photo" },
              { step: "02", title: "OpenCV Preprocessing", desc: "Resize to 224x224 and RGB normalize" },
              { step: "03", title: "ResNet50 & FAISS", desc: "Generate 2048D embedding & vector query" },
              { step: "04", title: "Buy & Checkout", desc: "Explore matching items, add to cart & buy" }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 relative">
                <span className="text-3xl font-extrabold font-mono text-primary-500/40 block mb-2">{item.step}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Trusted by E-Commerce Shoppers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Sarah Jenkins", role: "Fashion Enthusiast", text: "Finding exact matches for sneakers and watches used to take hours. VisionSearch AI identified the exact shoes in seconds!" },
            { name: "Marcus Chen", role: "Tech Reviewer", text: "The ResNet50 feature matching is scary accurate. Even with different lighting, it matched the exact watch and perfume." },
            { name: "Elena Rostova", role: "Style Designer", text: "I uploaded a photo of velvet slippers and found 4 visually identical options with full pricing and instant checkout!" }
          ].map((t, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">"{t.text}"</p>
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h5>
                <p className="text-[11px] text-slate-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
