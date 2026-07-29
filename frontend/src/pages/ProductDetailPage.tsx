import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Heart, ShoppingBag, Check, ShieldCheck, Truck, 
  RotateCcw, Sparkles, ArrowLeft, Plus, Minus
} from 'lucide-react';
import { fetchProductById, MOCK_PRODUCTS } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id).then(res => {
        setProduct(res.product);
        setSimilarProducts(res.similarProducts);
        setActiveImage(res.product.imageUrl);
      });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen py-20 text-center text-slate-400 font-bold">
        Loading product details...
      </div>
    );
  }

  const isWished = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Results
      </button>

      {/* Main Detail Grid */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-xl">
            <img
              src={activeImage || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Specifications & Purchase (6 cols) */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded-full transition-all ${
                  isWished ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-white' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm text-amber-400 font-bold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-slate-900 dark:text-white">{product.rating}</span>
              <span className="text-slate-400 font-normal text-xs">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-sm text-slate-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Specs Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">{key}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 font-mono font-bold text-xs text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/25'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 rounded-2xl bg-gradient-to-r from-secondary-600 to-accent-600 hover:from-secondary-500 hover:to-accent-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition-all"
              >
                Instant Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-slate-400 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-cyan-400" /> Free Express Shipping
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2-Year Warranty
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-purple-400" /> 30-Day Easy Return
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Visually Similar Recommendations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Visually Similar Product Recommendations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((prod, idx) => (
            <ProductCard
              key={prod.id}
              product={prod}
              similarityPercentage={[96.4, 94.2, 91.8, 89.0][idx] || 88.0}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
