import { Card, CardType } from './types';

export const ALL_CARDS: Card[] = [
  // Treasure Cards
  { name: 'Copper', cost: 0, effect: '1 Coin', type: CardType.TREASURE, coins: 1 },
  { name: 'Silver', cost: 3, effect: '2 Coins', type: CardType.TREASURE, coins: 2 },
  { name: 'Gold', cost: 6, effect: '3 Coins', type: CardType.TREASURE, coins: 3 },
  
  // Victory Cards
  { name: 'Estate', cost: 2, effect: '1 Victory Point', type: CardType.VICTORY, victoryPoints: 1 },
  { name: 'Duchy', cost: 5, effect: '3 Victory Points', type: CardType.VICTORY, victoryPoints: 3 },
  { name: 'Province', cost: 8, effect: '6 Victory Points', type: CardType.VICTORY, victoryPoints: 6 },
  
  // Curse Cards
  { name: 'Curse', cost: 0, effect: '-1 Victory Point', type: CardType.CURSE, victoryPoints: -1 },
  
  // Action Cards
  { 
    name: 'Cellar', 
    cost: 2, 
    effect: '+1 Action. Discard any number of cards then draw that many.', 
    type: CardType.ACTION, 
    actions: 1 
  },
  { 
    name: 'Chapel', 
    cost: 2, 
    effect: 'Trash up to 4 cards from your hand.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Moat', 
    cost: 2, 
    effect: '+2 Cards. Reaction: When another player plays an Attack card you may reveal this from your hand to be unaffected by it.', 
    type: CardType.ACTION, 
    cards: 2 
  },
  { 
    name: 'Harbinger', 
    cost: 3, 
    effect: '+1 Card +1 Action. Look through your discard pile. You may put a card from it onto your deck.', 
    type: CardType.ACTION, 
    cards: 1, 
    actions: 1 
  },
  { 
    name: 'Merchant', 
    cost: 3, 
    effect: '+1 Card +1 Action. The first time you play a Silver this turn +1 Coin.', 
    type: CardType.ACTION, 
    cards: 1, 
    actions: 1 
  },
  { 
    name: 'Vassal', 
    cost: 3, 
    effect: '+2 Coins. Discard the top card of your deck. If it\'s an Action card you may play it.', 
    type: CardType.ACTION, 
    coins: 2 
  },
  { 
    name: 'Village', 
    cost: 3, 
    effect: '+1 Card +2 Actions.', 
    type: CardType.ACTION, 
    cards: 1, 
    actions: 2 
  },
  { 
    name: 'Workshop', 
    cost: 3, 
    effect: 'Gain a card costing up to 4 Coins.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Bureaucrat', 
    cost: 4, 
    effect: 'Gain a Silver onto your deck. Each other player reveals a Victory card from their hand and puts it onto their deck (or reveals a hand with no Victory cards).', 
    type: CardType.ACTION 
  },
  { 
    name: 'Gardens', 
    cost: 4, 
    effect: 'Worth 1 Victory Point per 10 cards you have (rounded down).', 
    type: CardType.VICTORY 
  },
  { 
    name: 'Militia', 
    cost: 4, 
    effect: '+2 Coins. Each other player discards down to 3 cards in hand.', 
    type: CardType.ACTION, 
    coins: 2 
  },
  { 
    name: 'Moneylender', 
    cost: 4, 
    effect: 'You may trash a Copper from your hand. If you do +3 Coins.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Poacher', 
    cost: 4, 
    effect: '+1 Card +1 Action +1 Coin. Discard a card per empty Supply pile.', 
    type: CardType.ACTION, 
    cards: 1, 
    actions: 1, 
    coins: 1 
  },
  { 
    name: 'Remodel', 
    cost: 4, 
    effect: 'Trash a card from your hand. Gain a card costing up to 2 Coins more than the trashed card.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Smithy', 
    cost: 4, 
    effect: '+3 Cards.', 
    type: CardType.ACTION, 
    cards: 3 
  },
  { 
    name: 'Throne Room', 
    cost: 4, 
    effect: 'You may play an Action card from your hand twice.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Bandit', 
    cost: 5, 
    effect: 'Gain a Gold. Each other player reveals the top 2 cards of their deck trashes a revealed Treasure other than Copper and discards the rest.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Council Room', 
    cost: 5, 
    effect: '+4 Cards +1 Buy. Each other player draws a card.', 
    type: CardType.ACTION, 
    cards: 4, 
    buys: 1 
  },
  { 
    name: 'Festival', 
    cost: 5, 
    effect: '+2 Actions +1 Buy +2 Coins.', 
    type: CardType.ACTION, 
    actions: 2, 
    buys: 1, 
    coins: 2 
  },
  { 
    name: 'Laboratory', 
    cost: 5, 
    effect: '+2 Cards +1 Action.', 
    type: CardType.ACTION, 
    cards: 2, 
    actions: 1 
  },
  { 
    name: 'Library', 
    cost: 5, 
    effect: 'Draw until you have 7 cards in hand skipping any Action cards you choose to; set those aside discarding them afterwards.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Market', 
    cost: 5, 
    effect: '+1 Card +1 Action +1 Buy +1 Coin.', 
    type: CardType.ACTION, 
    cards: 1, 
    actions: 1, 
    buys: 1, 
    coins: 1 
  },
  { 
    name: 'Mine', 
    cost: 5, 
    effect: 'You may trash a Treasure from your hand. Gain a Treasure to your hand costing up to 3 Coins more than it.', 
    type: CardType.ACTION 
  },
  { 
    name: 'Sentry', 
    cost: 5, 
    effect: '+1 Card +1 Action. Look at the top 2 cards of your deck. Trash and/or discard any of them. Put the rest back on top in any order.', 
    type: CardType.ACTION, 
    cards: 1, 
    actions: 1 
  },
  { 
    name: 'Witch', 
    cost: 5, 
    effect: '+2 Cards. Each other player gains a Curse card.', 
    type: CardType.ACTION, 
    cards: 2 
  },
  { 
    name: 'Artisan', 
    cost: 6, 
    effect: 'Gain a card to your hand costing up to 5 Coins. Put a card from your hand onto your deck.', 
    type: CardType.ACTION 
  }
];

// Helper functions to get cards by type
export const getCardByName = (name: string): Card | undefined => {
  return ALL_CARDS.find(card => card.name === name);
};

export const getTreasureCards = (): Card[] => {
  return ALL_CARDS.filter(card => card.type === CardType.TREASURE);
};

export const getVictoryCards = (): Card[] => {
  return ALL_CARDS.filter(card => card.type === CardType.VICTORY);
};

export const getActionCards = (): Card[] => {
  return ALL_CARDS.filter(card => card.type === CardType.ACTION);
};

export const getCurseCard = (): Card => {
  return ALL_CARDS.find(card => card.name === 'Curse')!;
};

// Kingdom card selection (for 2-player game)
export const getRandomKingdomCards = (count: number = 10): Card[] => {
  const actionCards = getActionCards();
  const shuffled = [...actionCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};