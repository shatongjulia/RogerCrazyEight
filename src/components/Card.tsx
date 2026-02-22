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
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-16 sm:w-16 sm:h-24 border-2 border-indigo-400/30 rounded-md flex items-center justify-center">
            <div className="text-indigo-300/50 text-2xl">♠</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
