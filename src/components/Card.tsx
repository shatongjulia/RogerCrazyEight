import React from 'react';
import { motion } from 'motion/react';
import { CardData, SUIT_SYMBOLS, SUIT_COLORS } from '../types';

interface CardProps {
  card: CardData;
  isFaceUp: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ card, isFaceUp, onClick, isPlayable, className }) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 shadow-lg cursor-pointer select-none
        ${isFaceUp ? 'bg-white border-slate-200' : 'bg-indigo-800 border-indigo-900'}
        ${isPlayable ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
        ${className}
      `}
    >
      {isFaceUp ? (
        <div className={`flex flex-col h-full p-2 ${SUIT_COLORS[card.suit]}`}>
          <div className="flex justify-between items-start">
            <span className="text-lg sm:text-xl font-bold leading-none">{card.rank}</span>
            <span className="text-sm sm:text-base leading-none">{SUIT_SYMBOLS[card.suit]}</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl">
            {SUIT_SYMBOLS[card.suit]}
          </div>
          <div className="flex justify-between items-end rotate-180">
            <span className="text-lg sm:text-xl font-bold leading-none">{card.rank}</span>
            <span className="text-sm sm:text-base leading-none">{SUIT_SYMBOLS[card.suit]}</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img 
            src="https://images.unsplash.com/photo-1545165375-1b744b9ed444?auto=format&fit=crop&w=300&q=80" 
            alt="Tropical Plant Card Back"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </motion.div>
  );
};
