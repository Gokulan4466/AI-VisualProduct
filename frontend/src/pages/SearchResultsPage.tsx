import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, 
  Search, Check, ShieldCheck, Heart, Grid, Layers
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts, MOCK_PRODUCTS } from '../services/api';
import { Product, VisualSearchResponse, MatchResult } from '../types';

export const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchDataState = location.state?.searchData as VisualSearchResponse | undefined;

  const [products, setProducts] = useState<MatchResult[]>([]);
  const [queryImageUrl, setQueryImageUrl] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(245.8);
  const [detectedCategory, setDetectedCategory] = useState<string>("Footwear");

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchDataState?.detectedCategory || searchParams.get('category') || 'All'
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<'similarity' | 'price-asc' | 'price-desc' | 'rating'>('similarity');

  useEffect(() => {
    if (searchDataState) {
      const cat = searchDataState.detectedCategory || 'Watches';
      setSelectedCategory(cat);
      setQueryImageUrl(searchDataState.queryImage);
      setProcessingTime(searchDataState.processingTimeMs);
      setDetectedCategory(cat);

      // Filter matches strictly to the detected category (e.g. Watches only)
      const matchingCategoryItems = searchDataState.topMatches.filter(
        m => m.product.category.toLowerCase() === cat.toLowerCase()
      );
      setProducts(matchingCategoryItems.length > 0 ? matchingCategoryItems : searchDataState.topMatches);
    } else {
      // Default initial catalog display prioritizing Watches first
      const watchesFirst = [...MOCK_PRODUCTS].sort((a, b) => {
        if (a.category === 'Watches' && b.category !== 'Watches') return -1;
        if (a.category !== 'Watches' && b.category === 'Watches') return 1;
        return 0;
      });

      const initialMatches: MatchResult[] = watchesFirst.map((prod, i) => {
        const sim = Number(Math.max(75.0, 98.4 - (i * 0.4)).toFixed(1));
        return {
          product: prod,
          similarityPercentage: sim,
          confidenceScore: Number((sim / 100).toFixed(2)),
          breakdown: {
            overall: sim,
            colorMatch: Number(Math.min(99.9, sim + 0.6).toFixed(1)),
            shapeMatch: Number(Math.min(99.9, sim + 0.2).toFixed(1)),
            textureMatch: Number(Math.min(99.9, sim + 0.8).toFixed(1))
          }
        };
      });
      setProducts(initialMatches);
    }
  }, [searchDataState]);

  // Apply Client Filters & Sorting
  const filteredMatches = products.filter(match => {
    const p = match.product;
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedBrand !== 'All' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    if (selectedColor !== 'All' && !p.color.toLowerCase().includes(selectedColor.toLowerCase())) return false;
    if (p.price > maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'similarity') return b.similarityPercentage - a.similarityPercentage;
    if (sortBy === 'price-asc') return a.product.price - b.product.price;
    if (sortBy === 'price-desc') return b.product.price - a.product.price;
    if (sortBy === 'rating') return b.product.rating - a.product.rating;
    return 0;
  });

  const categories = ['All', 'Footwear', 'Perfumes', 'Eyewear'];
  const brands = ['All', 'AeroStride', 'SonicTech', 'Vanguard Wristwear', 'VogueCraft', 'Nordic Haven', 'PulseWear', 'OpticLux'];
  const colors = ['All', 'Red', 'Black', 'White', 'Brown', 'Yellow', 'Titanium', 'Gold'];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Search Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {queryImageUrl ? (
          <div className="flex items-center gap-5 w-full md:w-auto">
            <img
              src={queryImageUrl}
              alt="Uploaded Search Query"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-cyan-500/50 shadow-xl bg-slate-900"
            />
            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Query Image Matched
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Top Visually Similar Products
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ResNet50 + FAISS matched <span className="font-bold text-cyan-500">{filteredMatches.length} items</span> in <span className="font-mono text-emerald-400 font-bold">{processingTime}ms</span>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Visual Product Catalog
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browse products indexed with 2048-dimensional visual feature vectors.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => navigate('/search')}
            className="px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> New Image Search
          </button>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Filters (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary-500" /> Catalog Filters
            </h3>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setSelectedColor('All');
                setMaxPrice(1500);
              }}
              className="text-[11px] text-slate-400 hover:text-primary-500 font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Brand</label>
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Dominant Color</label>
            <select
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>Max Price</span>
              <span className="font-mono text-primary-500">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Sort Results By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="similarity">Visual Similarity % (Highest First)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating (Highest)</option>
            </select>
          </div>

        </div>

        {/* Right Results Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing <strong className="text-slate-900 dark:text-white">{filteredMatches.length}</strong> products</span>
            <span className="font-mono">FAISS Index: ResNet50 (L2 Norm)</span>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matching Products Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting your filters or performing another visual search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map(m => (
                <ProductCard
                  key={m.product.id}
                  product={m.product}
                  similarityPercentage={m.similarityPercentage}
                  breakdown={m.breakdown}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
