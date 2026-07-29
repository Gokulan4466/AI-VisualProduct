import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Camera, Search, ShoppingBag, Heart, Sun, Moon, 
  User as UserIcon, LogOut, ShieldCheck, Mic
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  onOpenVoiceSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVoiceSearch }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
              Vision<span className="text-gradient">Search AI</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              Visual AI Commerce
            </span>
          </div>
        </Link>

        {/* Navigation Links (Dashboard option removed) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800">
          <Link
            to="/search"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/search')
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            Visual Search
          </Link>

          <Link
            to="/results"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/results')
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            Catalog
          </Link>

          <Link
            to="/admin"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              isActive('/admin')
                ? 'bg-secondary-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Voice Search Button */}
          {onOpenVoiceSearch && (
            <button
              onClick={onOpenVoiceSearch}
              title="Voice Search"
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Mic className="w-5 h-5 text-accent-500 hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/results?wishlist=true"
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Cart Link */}
          <Link
            to="/cart"
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors relative"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {user?.name || "Virtual-AI"}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl shadow-2xl p-2 border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800 mb-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || "Virtual-AI"}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || "virtual-ai@visionsearch.io"}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-lg shadow-primary-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
};
