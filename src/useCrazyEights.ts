import { useState, useCallback, useEffect } from 'react';
import { CardData, GameState, Suit, Rank, SUITS, RANKS } from './types';

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({ id: `${rank}-${suit}`, suit, rank });
    });
  });
  return deck;
};

const shuffle = (deck: CardData[]): CardData[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentSuit: null,
    turn: 'player',
    status: 'idle',
    winner: null,
    lastAction: '欢迎来到 Julia 疯狂 8 点！',
  });

  const startNewGame = useCallback(() => {
    const fullDeck = shuffle(createDeck());
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Find a non-8 card for the start of the discard pile
    let firstCardIndex = fullDeck.findIndex(c => c.rank !== '8');
    if (firstCardIndex === -1) firstCardIndex = 0;
    const firstCard = fullDeck.splice(firstCardIndex, 1)[0];

    setState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile: [firstCard],
      currentSuit: firstCard.suit,
      turn: 'player',
      status: 'playing',
      winner: null,
      lastAction: '游戏开始！轮到你了。',
    });
  }, []);

  const isValidMove = useCallback((card: CardData, currentDiscard: CardData, activeSuit: Suit | null) => {
    if (card.rank === '8') return true;
    return card.suit === activeSuit || card.rank === currentDiscard.rank;
  }, []);

  const playCard = useCallback((card: CardData, isPlayer: boolean) => {
    setState(prev => {
      const hand = isPlayer ? prev.playerHand : prev.aiHand;
      const newHand = hand.filter(c => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];
      
      const nextStatus = card.rank === '8' ? (isPlayer ? 'choosing_suit' : 'playing') : 'playing';
      const nextTurn = card.rank === '8' ? (isPlayer ? 'player' : 'player') : (isPlayer ? 'ai' : 'player');
      
      // If AI plays an 8, it picks a suit immediately
      let nextSuit = card.rank === '8' ? prev.currentSuit : card.suit;
      if (!isPlayer && card.rank === '8') {
        // AI picks the suit it has the most of
        const suitCounts = newHand.reduce((acc, c) => {
          acc[c.suit] = (acc[c.suit] || 0) + 1;
          return acc;
        }, {} as Record<Suit, number>);
        nextSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => 
          (suitCounts[a] || 0) > (suitCounts[b] || 0) ? a : b
        , 'hearts' as Suit);
      }

      const winner = newHand.length === 0 ? (isPlayer ? 'player' : 'ai') : null;

      const suitNames: Record<Suit, string> = {
        hearts: '红心',
        diamonds: '方块',
        clubs: '梅花',
        spades: '黑桃'
      };

      return {
        ...prev,
        playerHand: isPlayer ? newHand : prev.playerHand,
        aiHand: isPlayer ? prev.aiHand : newHand,
        discardPile: newDiscardPile,
        currentSuit: nextSuit,
        status: winner ? 'game_over' : nextStatus,
        winner,
        turn: winner ? prev.turn : (card.rank === '8' && isPlayer ? 'player' : (isPlayer ? 'ai' : 'player')),
        lastAction: `${isPlayer ? '你' : 'Julia'} 打出了 ${suitNames[card.suit]} ${card.rank}。`,
      };
    });
  }, []);

  const chooseSuit = useCallback((suit: Suit) => {
    const suitNames: Record<Suit, string> = {
      hearts: '红心',
      diamonds: '方块',
      clubs: '梅花',
      spades: '黑桃'
    };
    setState(prev => ({
      ...prev,
      currentSuit: suit,
      status: 'playing',
      turn: 'ai',
      lastAction: `你选择了 ${suitNames[suit]}。轮到 Julia 了。`,
    }));
  }, []);

  const drawCard = useCallback((isPlayer: boolean) => {
    setState(prev => {
      if (prev.deck.length === 0) {
        return {
          ...prev,
          turn: isPlayer ? 'ai' : 'player',
          lastAction: `牌堆已空！${isPlayer ? '你' : "Julia"} 的回合被跳过。`,
        };
      }

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const hand = isPlayer ? prev.playerHand : prev.aiHand;
      const newHand = [...hand, drawnCard];

      return {
        ...prev,
        deck: newDeck,
        playerHand: isPlayer ? newHand : prev.playerHand,
        aiHand: isPlayer ? prev.aiHand : newHand,
        turn: isPlayer ? 'ai' : 'player',
        lastAction: `${isPlayer ? '你' : 'Julia'} 摸了一张牌。`,
      };
    });
  }, []);

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.turn === 'ai' && !state.winner) {
      const timer = setTimeout(() => {
        const topCard = state.discardPile[state.discardPile.length - 1];
        const playableCards = state.aiHand.filter(c => isValidMove(c, topCard, state.currentSuit));

        if (playableCards.length > 0) {
          // Play a random playable card (could be smarter, but this is a start)
          const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
          playCard(cardToPlay, false);
        } else {
          drawCard(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.turn, state.aiHand, state.discardPile, state.currentSuit, state.winner, playCard, drawCard, isValidMove]);

  return {
    state,
    startNewGame,
    playCard: (card: CardData) => playCard(card, true),
    drawCard: () => drawCard(true),
    chooseSuit,
    isValidMove: (card: CardData) => isValidMove(card, state.discardPile[state.discardPile.length - 1], state.currentSuit),
  };
};
