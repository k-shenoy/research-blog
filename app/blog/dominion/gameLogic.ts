import { Card, CardType, GameState, Player, GamePhase } from './types';
import { getCardByName, getRandomKingdomCards, getTreasureCards, getVictoryCards, getCurseCard } from './cards';

// Utility functions
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const drawCards = (player: Player, count: number): void => {
  const drawnCards: Card[] = [];
  
  for (let i = 0; i < count; i++) {
    if (player.deck.length === 0) {
      if (player.discard.length === 0) break; // No more cards to draw
      
      // Shuffle discard pile into deck
      player.deck = shuffleArray(player.discard);
      player.discard = [];
    }
    
    if (player.deck.length > 0) {
      const card = player.deck.pop()!;
      drawnCards.push(card);
    }
  }
  
  player.hand.push(...drawnCards);
};

export const createStartingDeck = (): Card[] => {
  const deck: Card[] = [];
  
  // Add 7 Coppers
  for (let i = 0; i < 7; i++) {
    deck.push(getCardByName('Copper')!);
  }
  
  // Add 3 Estates
  for (let i = 0; i < 3; i++) {
    deck.push(getCardByName('Estate')!);
  }
  
  return shuffleArray(deck);
};

export const createSupply = (kingdomCards: Card[]): { [cardName: string]: Card[] } => {
  const supply: { [cardName: string]: Card[] } = {};
  
  // Basic treasure cards (for 2 players)
  supply['Copper'] = Array(46).fill(null).map(() => getCardByName('Copper')!);
  supply['Silver'] = Array(40).fill(null).map(() => getCardByName('Silver')!);
  supply['Gold'] = Array(30).fill(null).map(() => getCardByName('Gold')!);
  
  // Victory cards (for 2 players)
  supply['Estate'] = Array(8).fill(null).map(() => getCardByName('Estate')!);
  supply['Duchy'] = Array(8).fill(null).map(() => getCardByName('Duchy')!);
  supply['Province'] = Array(8).fill(null).map(() => getCardByName('Province')!);
  
  // Curse cards (for 2 players)
  supply['Curse'] = Array(10).fill(null).map(() => getCurseCard());
  
  // Kingdom cards (10 copies each)
  kingdomCards.forEach(card => {
    supply[card.name] = Array(10).fill(null).map(() => ({ ...card }));
  });
  
  return supply;
};

export const createInitialGameState = (): GameState => {
  const kingdomCards = getRandomKingdomCards(10);
  const supply = createSupply(kingdomCards);
  
  // Create players
  const players: Player[] = [
    {
      id: 1,
      name: 'Player 1',
      hand: [],
      deck: createStartingDeck(),
      discard: [],
      playArea: [],
      actions: 1,
      buys: 1,
      coins: 0
    },
    {
      id: 2,
      name: 'Player 2',
      hand: [],
      deck: createStartingDeck(),
      discard: [],
      playArea: [],
      actions: 1,
      buys: 1,
      coins: 0
    }
  ];
  
  // Draw initial hands
  players.forEach(player => {
    drawCards(player, 5);
  });
  
  return {
    players,
    currentPlayer: 0,
    phase: GamePhase.ACTION,
    supply,
    trash: [],
    gameLog: ['Game started!', 'Player 1\'s turn begins.'],
    gameEnded: false,
    pendingChoice: undefined
  };
};

export const calculateVictoryPoints = (player: Player): number => {
  let points = 0;
  const allCards = [...player.hand, ...player.deck, ...player.discard];
  
  allCards.forEach(card => {
    if (card.name === 'Gardens') {
      // Gardens: 1 VP per 10 cards
      points += Math.floor(allCards.length / 10);
    } else if (card.victoryPoints !== undefined) {
      points += card.victoryPoints;
    }
  });
  
  return points;
};

export const checkGameEnd = (gameState: GameState): boolean => {
  const supply = gameState.supply;
  
  // Check if Province pile is empty
  if (supply['Province'].length === 0) {
    return true;
  }
  
  // Check if 3 supply piles are empty
  const emptyPiles = Object.values(supply).filter(pile => pile.length === 0).length;
  if (emptyPiles >= 3) {
    return true;
  }
  
  return false;
};

export const getWinner = (gameState: GameState): number | null => {
  const player1VP = calculateVictoryPoints(gameState.players[0]);
  const player2VP = calculateVictoryPoints(gameState.players[1]);
  
  if (player1VP > player2VP) return 0;
  if (player2VP > player1VP) return 1;
  return null; // Tie
};

export const cleanupPhase = (gameState: GameState): GameState => {
  const newState = { 
    ...gameState, 
    players: gameState.players.map((player, index) => ({
      ...player,
      hand: [...player.hand],
      playArea: [...player.playArea],
      deck: [...player.deck],
      discard: [...player.discard]
    })),
    gameLog: [...gameState.gameLog]
  };
  const currentPlayer = newState.players[newState.currentPlayer];
  
  // Move all cards from hand and play area to discard
  currentPlayer.discard.push(...currentPlayer.hand, ...currentPlayer.playArea);
  currentPlayer.hand = [];
  currentPlayer.playArea = [];
  
  // Draw new hand
  drawCards(currentPlayer, 5);
  
  // Reset counters for next turn
  currentPlayer.actions = 1;
  currentPlayer.buys = 1;
  currentPlayer.coins = 0;
  
  // Switch to next player
  newState.currentPlayer = (newState.currentPlayer + 1) % 2;
  newState.phase = GamePhase.ACTION;
  
  // Add to game log
  newState.gameLog.push(`${currentPlayer.name} ends their turn.`);
  newState.gameLog.push(`${newState.players[newState.currentPlayer].name}'s turn begins.`);
  
  // Check for game end
  if (checkGameEnd(newState)) {
    newState.gameEnded = true;
    newState.winner = getWinner(newState) ?? undefined;
  }
  
  return newState;
};

export const playTreasure = (gameState: GameState, cardIndex: number): GameState => {
  const newState = { 
    ...gameState, 
    players: gameState.players.map((player, index) => ({
      ...player,
      hand: [...player.hand],
      playArea: [...player.playArea],
      deck: [...player.deck],
      discard: [...player.discard]
    })),
    gameLog: [...gameState.gameLog]
  };
  const currentPlayer = newState.players[newState.currentPlayer];
  
  if (cardIndex < 0 || cardIndex >= currentPlayer.hand.length) {
    return gameState;
  }
  
  const card = currentPlayer.hand[cardIndex];
  
  if (card.type !== CardType.TREASURE) {
    return gameState;
  }
  
  // Move card from hand to play area
  currentPlayer.hand.splice(cardIndex, 1);
  currentPlayer.playArea.push(card);
  
  // Add coins
  if (card.coins) {
    currentPlayer.coins += card.coins;
  }
  
  newState.gameLog.push(`${currentPlayer.name} plays ${card.name} for ${card.coins} coin(s).`);
  
  return newState;
};

export const buyCard = (gameState: GameState, cardName: string): GameState => {
  const newState = { 
    ...gameState, 
    players: gameState.players.map((player, index) => ({
      ...player,
      hand: [...player.hand],
      playArea: [...player.playArea],
      deck: [...player.deck],
      discard: [...player.discard]
    })),
    supply: Object.fromEntries(
      Object.entries(gameState.supply).map(([name, cards]) => [name, [...cards]])
    ),
    gameLog: [...gameState.gameLog]
  };
  const currentPlayer = newState.players[newState.currentPlayer];
  const supply = newState.supply;
  
  if (!supply[cardName] || supply[cardName].length === 0) {
    return gameState; // Card not available
  }
  
  const card = supply[cardName][0];
  
  if (currentPlayer.coins < card.cost || currentPlayer.buys < 1) {
    return gameState; // Can't afford or no buys left
  }
  
  // Remove card from supply and add to player's discard
  supply[cardName].shift();
  currentPlayer.discard.push(card);
  
  // Subtract cost and buy
  currentPlayer.coins -= card.cost;
  currentPlayer.buys -= 1;
  
  newState.gameLog.push(`${currentPlayer.name} buys ${card.name}.`);
  
  return newState;
};