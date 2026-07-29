import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  similarityPercentage?: number;
  breakdown?: {
    colorMatch: number;
    shapeMatch: number;
    textureMatch: number;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, similarityPercentage, breakdown }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        
        {/* Similarity Score Pill */}
        {similarityPercentage !== undefined && (
          <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full border border-cyan-500/40 shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="text-cyan-400 font-mono">{similarityPercentage.toFixed(1)}%</span> Match
          </div>
        )}

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            -{product.discount}% OFF
          </div>
        )}

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick Wishlist Floating Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute bottom-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isWished
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
          }`}
          title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-white' : ''}`} />
        </button>

      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {product.rating} <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block group-hover:text-primary-600 transition-colors">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>

          {/* AI Feature Breakdown Sub-Bar */}
          {breakdown && (
            <div className="mb-3 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[10px] space-y-1">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Color Match</span>
                <span className="font-mono font-bold text-cyan-500">{breakdown.colorMatch}%</span>
              </div>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${breakdown.colorMatch}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
              In Stock ({product.stock} left)
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 hover:scale-105'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
