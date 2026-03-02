import { motion, AnimatePresence } from 'motion/react';
import { useCrazyEights } from './useCrazyEights';
import { Card } from './components/Card';
import { SUITS, SUIT_SYMBOLS, SUIT_COLORS, Suit } from './types';
import { Trophy, RotateCcw, Info, Hand as HandIcon, Layers, User } from 'lucide-react';

export default function App() {
  const { state, startNewGame, playCard, drawCard, chooseSuit, isValidMove } = useCrazyEights();

  const isPlayerTurn = state.turn === 'player' && state.status === 'playing';

  return (
    <div className="min-h-screen bg-[#1a472a] text-white font-sans selection:bg-yellow-400 selection:text-black flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold shadow-lg">
            J
          </div>
          <h1 className="text-xl font-bold tracking-tight">Julia Crazy Eights</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">当前状态</span>
            <span className="text-sm font-medium text-yellow-400">{state.lastAction}</span>
          </div>
          <button
            onClick={startNewGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Restart Game"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 flex flex-col gap-6 flex-1 w-full overflow-y-auto pb-24 sm:pb-4">
        {state.status === 'idle' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-5xl font-black mb-4 tracking-tighter">疯狂 8 点</h2>
              <p className="text-white/60 max-w-md mx-auto mb-8">
                经典的扑克牌游戏，数字 8 是万能牌。清空你的手牌，打败 Julia！
              </p>
              <button
                onClick={startNewGame}
                className="px-12 py-4 bg-yellow-400 text-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
              >
                开始游戏
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* AI Area */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full border border-white/10">
                <User size={14} className="text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Julia</span>
                <span className="text-xs bg-indigo-500 px-2 rounded-full">{state.aiHand.length} 张牌</span>
              </div>
              <div className="flex -space-x-12 sm:-space-x-16 overflow-visible py-4">
                {state.aiHand.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card card={card} isFaceUp={false} className="opacity-80 scale-90" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Table Center */}
            <div className="flex-1 flex items-center justify-center gap-12 sm:gap-24">
              {/* Draw Pile */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-black/20 rounded-lg translate-y-2 translate-x-1"></div>
                  <div className="absolute inset-0 bg-black/20 rounded-lg translate-y-1 translate-x-0.5"></div>
                  <Card
                    card={{} as any}
                    isFaceUp={false}
                    isPlayable={isPlayerTurn && state.deck.length > 0}
                    onClick={drawCard}
                    className="relative z-10"
                  />
                  {state.deck.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow-lg">
                      {state.deck.length}
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-1">
                  <Layers size={10} /> 摸牌堆
                </span>
              </div>

              {/* Discard Pile */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <AnimatePresence mode="popLayout">
                    {state.discardPile.slice(-1).map((card) => (
                      <motion.div
                        key={card.id}
                        initial={{ scale: 1.5, rotate: 45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card card={card} isFaceUp={true} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {state.currentSuit && (
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-100 ${SUIT_COLORS[state.currentSuit]}`}>
                      {SUIT_SYMBOLS[state.currentSuit]}
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-1">
                  弃牌堆
                </span>
              </div>
            </div>

            {/* Player Area */}
            <div className="flex flex-col items-center gap-4 mt-auto">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full border border-white/10">
                <User size={14} className="text-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-widest">你</span>
                <span className="text-xs bg-yellow-500 text-black px-2 rounded-full font-bold">{state.playerHand.length} 张牌</span>
              </div>
              <div className="w-full overflow-x-auto pb-4 px-4 no-scrollbar">
                <div className="flex justify-center min-w-max -space-x-10 sm:-space-x-12 px-8">
                  {state.playerHand.map((card) => (
                    <Card
                      key={card.id}
                      card={card}
                      isFaceUp={true}
                      isPlayable={isPlayerTurn && isValidMove(card)}
                      onClick={() => playCard(card)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Suit Picker Modal */}
      <AnimatePresence>
        {state.status === 'choosing_suit' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full text-center"
            >
              <h3 className="text-2xl font-bold mb-2">万能 8 点！</h3>
              <p className="text-white/60 mb-8 text-sm">请选择接下来的花色。</p>
              <div className="grid grid-cols-2 gap-4">
                {SUITS.map((suit) => (
                  <button
                    key={suit}
                    onClick={() => chooseSuit(suit)}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-white/5 
                      hover:bg-white/10 transition-all hover:scale-105 active:scale-95
                      ${SUIT_COLORS[suit]}
                    `}
                  >
                    <span className="text-4xl">{SUIT_SYMBOLS[suit]}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">{suit}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {state.status === 'game_over' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 p-12 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black mx-auto mb-6 shadow-xl">
                {state.winner === 'player' ? <Trophy size={40} /> : <HandIcon size={40} />}
              </div>
              <h2 className="text-4xl font-black mb-2 tracking-tight">
                {state.winner === 'player' ? '获得胜利！' : '遗憾落败！'}
              </h2>
              <p className="text-white/60 mb-10">
                {state.winner === 'player' 
                  ? "你打败了 Julia！你的牌技令她印象深刻。" 
                  : "Julia 这次更快。别让她再次赢过你！"}
              </p>
              <button
                onClick={startNewGame}
                className="w-full py-4 bg-yellow-400 text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> 再次挑战
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-md border-t border-white/10 flex justify-between items-center z-40">
        <div className="flex flex-col">
          <span className="text-[8px] uppercase tracking-widest opacity-50 font-bold">状态</span>
          <span className="text-xs font-medium text-yellow-400 truncate max-w-[200px]">{state.lastAction}</span>
        </div>
        {isPlayerTurn && (
          <div className="flex items-center gap-2">
            <button 
              onClick={drawCard}
              disabled={state.deck.length === 0}
              className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold disabled:opacity-50"
            >
              摸牌
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
