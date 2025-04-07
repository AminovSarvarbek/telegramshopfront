import React from 'react';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '../types/types';

type MenuListProps = {
  items: MenuItemType[];
  onAddToCart: (item: MenuItemType) => void;
};

const MenuList: React.FC<MenuListProps> = ({ items, onAddToCart }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Bizning Menyu</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map(item => (
          <MenuItem 
            key={item.id} 
            item={item} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>
    </section>
  );
};

export default MenuList;