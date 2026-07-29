import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Camera, History, Layers, ArrowUpRight, TrendingUp, 
  Clock, Heart, ShoppingBag, Eye, Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../services/api';
import { SearchHistoryItem } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<SearchHistoryItem[]>([
    {
      id: "h-1",
      timestamp: "Today at 11:20 AM",
      queryImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
      topMatchName: "Apex Runner Pro Sneakers",
      similarity: 98.4
    },
    {
      id: "h-2",
      timestamp: "Today at 10:05 AM",
      queryImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
      topMatchName: "CyberPulse Wireless ANC Headphones",
      similarity: 96.2
    },
    {
      id: "h-3",
      timestamp: "Yesterday",
      queryImageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80",
      topMatchName: "Chronos Elegance Automatic Leather Watch",
      similarity: 94.1
    }
  ]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Welcome Hero Card */}
      <div className="relative glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-600/20 to-accent-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-primary-500/40 shadow-xl"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Visual Search User
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Welcome back, {user?.name.split(' ')[0] || 'Explorer'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Perform visual image queries, review recent AI predictions, and explore recommendations.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-xs shadow-lg shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Camera className="w-4 h-4" /> Start Visual Search
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-8 border-t border-slate-200/80 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Visual Searches</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">24</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Avg Match Score</span>
            <p className="text-2xl font-extrabold text-cyan-500 font-mono mt-0.5">96.4%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Saved Items</span>
            <p className="text-2xl font-extrabold text-purple-400 font-mono mt-0.5">8</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">AI ResNet Index</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">2048D</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Searches & Popular Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Searches (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Visual Searches</h2>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              New Query <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/results')}
                className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/50 cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.queryImageUrl}
                    alt="Search Query"
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-700/40 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                      {item.topMatchName}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {item.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 font-mono text-xs font-bold border border-cyan-800">
                    {item.similarity}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories Grid (4 cols) */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-secondary-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular Categories</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Shoes & Sneakers", count: "520 items", cat: "Footwear", color: "from-blue-600/20 to-cyan-600/20 text-cyan-400" },
              { title: "Watches", count: "480 items", cat: "Watches", color: "from-amber-600/20 to-orange-600/20 text-amber-400" },
              { title: "Perfumes", count: "390 items", cat: "Perfumes", color: "from-purple-600/20 to-pink-600/20 text-purple-400" },
              { title: "Slippers & Slides", count: "320 items", cat: "Slippers", color: "from-rose-600/20 to-red-600/20 text-rose-400" },
              { title: "Eyewear", count: "180 items", cat: "Eyewear", color: "from-emerald-600/20 to-teal-600/20 text-emerald-400" },
              { title: "Electronics", count: "150 items", cat: "Electronics", color: "from-indigo-600/20 to-blue-600/20 text-indigo-400" }
            ].map((c, i) => (
              <button
                key={i}
                onClick={() => navigate(`/results?category=${c.cat}`)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} border border-slate-200/40 dark:border-slate-800 text-left hover:scale-105 transition-transform`}
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</h4>
                <span className="text-[10px] text-slate-400">{c.count}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Recommendations Carousel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Recommended For You</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Based on your recent visual search vector affinity</p>
          </div>
          <button
            onClick={() => navigate('/results')}
            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
          >
            View All Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.slice(0, 4).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              similarityPercentage={[98.4, 96.2, 94.1, 91.5][idx]}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
