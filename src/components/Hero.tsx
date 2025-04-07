import React from 'react';

type HeroProps = {
  onOrderNow: () => void;
};

const Hero: React.FC<HeroProps> = ({ onOrderNow }) => {
  return (
    <div className="w-full bg-gradient-to-r from-[#cc1010] to-[#e93c19] rounded-2xl mt-4 mb-8 overflow-hidden shadow-food">
      <div className="py-6 px-7 text-white flex flex-col items-start">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
          <span className="text-yellow-300">Olovda</span> pishirilgan mukammallik
        </h1>
        <p className="mb-4 text-sm sm:text-base opacity-90 max-w-md">
          Eng sara mahsulotlardan tayyorlangan mazali burgerlardan bahramand bo'ling
        </p>
        <button 
          onClick={onOrderNow}
          className="bg-[#efb100] text-pepper font-bold px-5 py-2 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 text-sm sm:text-base shadow-md"
        >
          Hozir buyurtma bering
        </button>
      </div>
    </div>
  );
};

export default Hero;