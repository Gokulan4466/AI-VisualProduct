import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VoiceSearchModal } from './components/VoiceSearchModal';

import { LandingPage } from './pages/LandingPage';
import { VisualSearchPage } from './pages/VisualSearchPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="min-h-screen flex flex-col justify-between selection:bg-primary-600 selection:text-white">
                <Navbar onOpenVoiceSearch={() => setIsVoiceModalOpen(true)} />

                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/search" element={<VisualSearchPage />} />
                    <Route path="/results" element={<SearchResultsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                  </Routes>
                </main>

                <Footer />

                <VoiceSearchModal
                  isOpen={isVoiceModalOpen}
                  onClose={() => setIsVoiceModalOpen(false)}
                />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
