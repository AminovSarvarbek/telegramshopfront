import React from 'react';

type NavbarProps = {
  cartCount: number;
  onCartClick: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-extrabold">
            <span className="text-red-600">DURGER</span>
            <span className="text-yellow-400">KING</span>
          </span>
        </div>
        <button 
          onClick={onCartClick} 
          className="relative p-2 transition-transform hover:scale-105 flex items-center"
          aria-label="Savatni ochish"
        >
          {cartCount > 0 && (
            <span className="mr-1 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
              {cartCount}
            </span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;