import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, CreditCard 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, discountTotal, total } = useCart();
  const navigate = useNavigate();

  const [checkoutModal, setCheckoutModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('100 AI Vision Blvd, Tech District, CA');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderSuccess(orderId);
    clearCart();
    setCheckoutModal(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-primary-600" /> Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your selected visual search items and complete your order
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        )}
      </div>

      {orderSuccess ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-emerald-500/50 shadow-2xl max-w-xl mx-auto space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Order Confirmed!</h2>
          <p className="text-xs text-slate-300">
            Thank you for your purchase. Your order ID is <span className="font-mono font-bold text-emerald-400">{orderSuccess}</span>.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => {
                setOrderSuccess(null);
                navigate('/dashboard');
              }}
              className="px-6 py-3 rounded-full bg-primary-600 text-white font-bold text-xs shadow-lg shadow-primary-500/30"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
          <ShoppingBag className="w-14 h-14 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart is Currently Empty</h3>
          <p className="text-xs text-slate-400">Discover visually similar products using our AI Visual Search tool.</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600 text-white font-bold text-xs shadow-lg shadow-primary-500/25"
          >
            <Sparkles className="w-4 h-4" /> Start Visual Search
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-700/40 bg-slate-900"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-primary-500 uppercase">{item.product.brand}</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{item.product.name}</h3>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-mono font-bold text-xs text-slate-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box (4 cols) */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 h-fit">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Discount Savings</span>
                  <span className="font-mono">-${discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold">FREE Express</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-slate-900 dark:text-white">${(subtotal * 0.08).toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-xl font-mono text-cyan-400">${(subtotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutModal(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-xs shadow-xl shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-bit Encrypted Secure Payment
            </div>
          </div>

        </div>
      )}

      {/* Checkout Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-card rounded-3xl p-8 border border-slate-700 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" /> Complete Purchase
            </h3>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Shipping Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Credit Card">Credit / Debit Card (Visa / Mastercard)</option>
                  <option value="Apple Pay">Apple Pay / Google Pay</option>
                  <option value="Crypto">Crypto (USDC / ETH)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Total to Pay:</span>
                <span className="text-cyan-400 font-mono">${(subtotal * 1.08).toFixed(2)}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-primary-600 text-white font-extrabold shadow-lg shadow-primary-500/25"
                >
                  Confirm & Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
