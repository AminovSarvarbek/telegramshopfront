import React from 'react';
import { CartItem } from '../types/types';

type CartProps = {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onAddItem: (id: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
};

const Cart: React.FC<CartProps> = ({
  isOpen,
  items,
  total,
  onClose,
  onAddItem,
  onRemoveItem,
  onCheckout
}) => {
  return (
    <>
      <div 
        className={`cart-sidebar fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-lg z-50 flex flex-col ${
          isOpen ? 'open' : ''
        }`}
      >
        <div className="p-5 bg-red-600  bg-gradient-to-r from-burger to-ketchup text-white flex justify-between items-center">
          <h2 className="text-xl text-white font-bold">Sizning buyurtmangiz</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-bun transition-colors"
            aria-label="Savatni yopish"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500">Savatingiz bo'sh</p>
              <p className="text-gray-400 text-sm mt-1">Savatga mazali taomlarni qo'shing</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center justify-between mb-5 pb-5 border-b">
                <div>
                  <h3 className="font-bold text-pepper">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                  <p className="font-semibold text-burger mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center border rounded-full overflow-hidden">
                  <button 
                    className="px-3 py-1 text-pepper hover:bg-gray-100"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Mahsulotni olib tashlash"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x">{item.quantity}</span>
                  <button 
                    className="px-3 py-1 text-burger hover:bg-gray-100"
                    onClick={() => onAddItem(item.id)}
                    aria-label="Mahsulotni qo'shish"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="border-t p-5">
          <div className="flex justify-between font-bold mb-4 text-lg">
            <span>Jami:</span>
            <span className="text-burger">${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={onCheckout}
            disabled={items.length === 0}
            className={`w-full py-3 px-4 rounded-full font-bold transition-all ${
              items.length === 0
                ? 'bg-red-600 text-white cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-opacity-90 hover:scale-105'
            }`}
          >
            To'lovga o'tish
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Cart;