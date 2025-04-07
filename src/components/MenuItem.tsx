import React, { useState } from 'react';
import { MenuItem as MenuItemType } from '../types/types';

type MenuItemProps = {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
};

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SYXNtIHRvcGlsbWFkaTwvdGV4dD48L3N2Zz4=';

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-food overflow-hidden transition-all duration-300 hover:shadow-xl ${isAdded ? 'added-animation' : ''}`}>
      <div className="relative h-36 sm:h-48 overflow-hidden">
        <img 
          src={imageError ? PLACEHOLDER_IMAGE : item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-burger text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
          ${item.price.toFixed(2)}
        </div>
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="font-bold text-base sm:text-lg text-pepper">{item.name}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 mb-2 sm:mb-4 line-clamp-2">{item.description}</p>
        <button 
          className={`w-full py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
            isAdded ? 'bg-green-500 text-white' : 'bg-red-600 text-white hover:bg-opacity-90'
          }`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? '✓ Qo\'shildi' : 'Savatga qo\'shish'}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;