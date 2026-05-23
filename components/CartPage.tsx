'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { ArrowLeft, Trash2, ShoppingCart, Shield, CreditCard, Smartphone, Building } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, setNotification } = useStore();
  const { goHome, goToCategories, goToDashboard } = useAppNavigation();
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash');

  const totalAmount = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0);

  const handleCheckout = () => {
    setNotification('🎉 Order placed successfully! Redirecting to payment...');
    setTimeout(() => {
      clearCart();
      setNotification(null);
      goToDashboard();
    }, 2000);
  };

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: <Smartphone className="w-5 h-5" />, color: 'from-pink-500 to-pink-600' },
    { id: 'nagad', name: 'Nagad', icon: <Smartphone className="w-5 h-5" />, color: 'from-orange-500 to-orange-600' },
    { id: 'rocket', name: 'Rocket', icon: <Smartphone className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' },
    { id: 'card', name: 'Card', icon: <CreditCard className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
    { id: 'bank', name: 'Bank Transfer', icon: <Building className="w-5 h-5" />, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-bridge-primary" />
          Shopping Cart
          {cart.length > 0 && (
            <span className="text-sm font-medium text-text-muted">({cart.length} items)</span>
          )}
        </h1>

        {cart.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <ShoppingCart className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Your cart is empty</h3>
            <p className="text-text-muted mb-6">Explore our services and add items to your cart</p>
            <button 
              onClick={goToCategories}
              className="px-6 py-3 bg-bridge-primary text-white font-medium rounded-xl hover:bg-bridge-primary-light transition-colors cursor-pointer"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.service.id} className="glass rounded-2xl p-4 flex gap-4 border border-border-subtle">
                  <img 
                    src={item.service.thumbnail} 
                    alt={item.service.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2">{item.service.title}</h3>
                    <p className="text-xs text-text-muted mb-2">by {item.service.sellerName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-text-primary">৳{(item.service.price * item.quantity).toLocaleString()}</span>
                      <button 
                        onClick={() => removeFromCart(item.service.id)}
                        className="p-2 text-text-muted hover:text-bridge-accent transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout */}
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6 border border-border-subtle">
                <h3 className="text-lg font-bold text-text-primary mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="text-text-primary">৳{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Platform Fee</span>
                    <span className="text-text-primary">৳{Math.round(totalAmount * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-background-soft"></div>
                  <div className="flex justify-between">
                    <span className="font-bold text-text-primary">Total</span>
                    <span className="text-xl font-bold text-text-primary">৳{Math.round(totalAmount * 1.05).toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <h4 className="text-sm font-bold text-text-primary mb-3">Payment Method</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {paymentMethods.map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        paymentMethod === pm.id 
                          ? 'bg-bridge-primary/20 border border-bridge-primary/50 text-white' 
                          : 'bg-background-soft border border-border-subtle text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {pm.icon}
                      {pm.name}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold rounded-xl hover:shadow-xl hover:shadow-bridge-primary/30 transition-all cursor-pointer"
                >
                  Proceed to Checkout
                </button>

                <div className="flex items-center gap-2 justify-center mt-4 text-xs text-text-muted">
                  <Shield className="w-3.5 h-3.5 text-bridge-secondary" />
                  Secure payment with buyer protection
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
