// src/App.tsx (with routing)
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import CustomAlert from './components/CustomAlert';
import AdminRoutes from './AdminRoutes';
import { useTelegram } from './hooks/useTelegram';
import { useCart } from './hooks/useCart';
import { getMenu, createOrder } from './services/api';
import { MenuItem } from './types/types';
import './index.css';

const MainApp: React.FC = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTelegramReady, setIsTelegramReady] = useState(false);
  
  // Initialize Telegram hook
  const { getUserData } = useTelegram();
  
  // Initialize Telegram WebApp
  useEffect(() => {
    const initTelegram = () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        setIsTelegramReady(true);
      } else {
        setTimeout(initTelegram, 100);
      }
    };
    
    initTelegram();
  }, []); 

  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    closeCart,
    addToCart, 
    removeFromCart, 
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();

  // Fetch menu items on component mount
  useEffect(() => {
    const getMenuItems = async () => {
      try {
        setIsLoading(true);
        const data = await getMenu();
        setMenuItems(data);
        setError(null);
      } catch (err) {
        setError('Menyuni yuklashda xatolik yuz berdi');
        console.error('Failed to fetch menu items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch menu items after Telegram WebApp is ready
    if (isTelegramReady) {
      getMenuItems();
    }
  }, [isTelegramReady]);

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, closeCart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      // Get Telegram user data
      const userData = getUserData();
      
      // Send order to API with user data
      const result = await createOrder({
        items: cart,
        total: getTotalPrice(),
        user: userData
      });
      
      if (result.success) {
        setAlertType('success');
        setAlertMessage("Buyurtmangiz uchun rahmat✅ Tez siz bilan bog'lanamiz😊");
        clearCart();
        closeCart();
      } else {
        setAlertType('error');
        setAlertMessage(result.message || "Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage("Serverga ulanishda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.");
    }
    
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  // Wrapper for addToCart that just takes an ID
  const handleAddToCart = (id: number) => {
    const item = menuItems.find(item => item.id === id);
    if (item) {
      addToCart(item);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        cartCount={getTotalItems()} 
        onCartClick={toggleCart} 
      />
      
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-24">
        <Hero onOrderNow={toggleCart} />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-opacity-90"
            >
              Qayta urinish
            </button>
          </div>
        ) : (
          <MenuList 
            items={menuItems} 
            onAddToCart={addToCart} 
          />
        )}
      </main>
      
      <Cart 
        isOpen={isCartOpen}
        items={cart}
        total={getTotalPrice()}
        onClose={closeCart}
        onAddItem={handleAddToCart}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <CustomAlert 
        isOpen={alertOpen}
        onClose={closeAlert}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
