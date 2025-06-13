import { Card, CardType, GameState, Player } from './types';
import { drawCards } from './gameLogic';
import { getCardByName } from './cards';

export interface CardEffect {
  (gameState: GameState, cardIndex: number, additionalArgs?: any): GameState;
}

// Simple card effects that just give bonuses
export const applySimpleCardEffect = (gameState: GameState, card: Card): GameState => {
  const newState = { ...gameState };
  const currentPlayer = newState.players[newState.currentPlayer];
  
  if (card.cards) {
    drawCards(currentPlayer, card.cards);
    newState.gameLog.push(`${currentPlayer.name} draws ${card.cards} card(s).`);
  }
  
  if (card.actions) {
    currentPlayer.actions += card.actions;
    newState.gameLog.push(`${currentPlayer.name} gets +${card.actions} action(s).`);
  }
  
  if (card.buys) {
    currentPlayer.buys += card.buys;
    newState.gameLog.push(`${currentPlayer.name} gets +${card.buys} buy(s).`);
  }
  
  if (card.coins) {
    currentPlayer.coins += card.coins;
    newState.gameLog.push(`${currentPlayer.name} gets +${card.coins} coin(s).`);
  }
  
  return newState;
};

// Specific card effects for complex cards
export const playAction = (gameState: GameState, cardIndex: number): GameState => {
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
    trash: [...gameState.trash],
    gameLog: [...gameState.gameLog]
  };
  const currentPlayer = newState.players[newState.currentPlayer];
  
  if (cardIndex < 0 || cardIndex >= currentPlayer.hand.length) {
    return gameState;
  }
  
  const card = currentPlayer.hand[cardIndex];
  
  if (card.type !== CardType.ACTION || currentPlayer.actions < 1) {
    return gameState;
  }
  
  // Move card from hand to play area
  currentPlayer.hand.splice(cardIndex, 1);
  currentPlayer.playArea.push(card);
  currentPlayer.actions -= 1;
  
  newState.gameLog.push(`${currentPlayer.name} plays ${card.name}.`);
  
  // Apply card effects
  switch (card.name) {
    case 'Cellar':
      return applyCellarEffect(newState);
    case 'Chapel':
      return applyChapelEffect(newState);
    case 'Harbinger':
      return applyHarbingerEffect(newState);
    case 'Merchant':
      return applyMerchantEffect(newState);
    case 'Vassal':
      return applyVassalEffect(newState);
    case 'Workshop':
      return applyWorkshopEffect(newState);
    case 'Bureaucrat':
      return applyBureaucratEffect(newState);
    case 'Militia':
      return applyMilitiaEffect(newState);
    case 'Moneylender':
      return applyMoneylenderEffect(newState);
    case 'Poacher':
      return applyPoacherEffect(newState);
    case 'Remodel':
      return applyRemodelEffect(newState);
    case 'Throne Room':
      return applyThroneRoomEffect(newState);
    case 'Bandit':
      return applyBanditEffect(newState);
    case 'Library':
      return applyLibraryEffect(newState);
    case 'Mine':
      return applyMineEffect(newState);
    case 'Sentry':
      return applySentryEffect(newState);
    case 'Witch':
      return applyWitchEffect(newState);
    case 'Artisan':
      return applyArtisanEffect(newState);
    default:
      // Apply simple effects for cards with just bonuses
      return applySimpleCardEffect(newState, card);
  }
};

// Specific card effect implementations
const applyCellarEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Cellar', cost: 2, effect: '', type: CardType.ACTION, actions: 1, cards: 0 });
  
  const currentPlayer = newState.players[newState.currentPlayer];
  
  if (currentPlayer.hand.length > 0) {
    newState.pendingChoice = {
      type: 'discard',
      playerId: newState.currentPlayer,
      prompt: 'Choose any number of cards to discard (you will draw that many)',
      options: currentPlayer.hand.map((card, index) => ({ card, index })),
      min: 0,
      max: currentPlayer.hand.length,
      callback: 'cellarDiscard'
    };
  }
  
  return newState;
};

const applyChapelEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  if (currentPlayer.hand.length > 0) {
    gameState.pendingChoice = {
      type: 'trash',
      playerId: gameState.currentPlayer,
      prompt: 'Choose up to 4 cards to trash',
      options: currentPlayer.hand.map((card, index) => ({ card, index })),
      min: 0,
      max: Math.min(4, currentPlayer.hand.length),
      callback: 'chapelTrash'
    };
  }
  
  return gameState;
};

const applyWorkshopEffect = (gameState: GameState): GameState => {
  const availableCards = Object.entries(gameState.supply)
    .filter(([name, cards]) => cards.length > 0 && getCardByName(name)!.cost <= 4)
    .map(([name]) => name);
  
  if (availableCards.length > 0) {
    gameState.pendingChoice = {
      type: 'gain',
      playerId: gameState.currentPlayer,
      prompt: 'Choose a card to gain (costing up to 4)',
      options: availableCards,
      min: 1,
      max: 1,
      callback: 'workshopGain'
    };
  }
  
  return gameState;
};

const applyMilitiaEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Militia', cost: 4, effect: '', type: CardType.ACTION, coins: 2 });
  
  // Each other player discards down to 3 cards
  const otherPlayerIndex = (newState.currentPlayer + 1) % 2;
  const otherPlayer = newState.players[otherPlayerIndex];
  
  if (otherPlayer.hand.length > 3) {
    const numToDiscard = otherPlayer.hand.length - 3;
    newState.pendingChoice = {
      type: 'discard',
      playerId: otherPlayerIndex,
      prompt: `Choose ${numToDiscard} card(s) to discard`,
      options: otherPlayer.hand.map((card, index) => ({ card, index })),
      min: numToDiscard,
      max: numToDiscard,
      callback: 'militiaDiscard'
    };
  }
  
  return newState;
};

const applyMoneylenderEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  // Find Copper in hand
  const copperIndex = currentPlayer.hand.findIndex(card => card.name === 'Copper');
  if (copperIndex !== -1) {
    // Trash the Copper
    const copper = currentPlayer.hand.splice(copperIndex, 1)[0];
    gameState.trash.push(copper);
    
    // Get +3 Coins
    currentPlayer.coins += 3;
    gameState.gameLog.push(`${currentPlayer.name} trashes a Copper and gets +3 coins.`);
  } else {
    gameState.gameLog.push(`${currentPlayer.name} has no Copper to trash.`);
  }
  
  return gameState;
};

const applyMineEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  // Find the most valuable treasure to upgrade
  const treasures = currentPlayer.hand.filter(card => card.type === CardType.TREASURE);
  
  if (treasures.length === 0) {
    gameState.gameLog.push(`${currentPlayer.name} has no treasures to upgrade.`);
    return gameState;
  }
  
  // Automatically upgrade the best treasure we can
  let treasureToUpgrade = null;
  let upgradeTo = null;
  
  // Try to upgrade Copper to Silver
  const copper = treasures.find(card => card.name === 'Copper');
  if (copper && gameState.supply['Silver'].length > 0) {
    treasureToUpgrade = copper;
    upgradeTo = 'Silver';
  }
  
  // Try to upgrade Silver to Gold (better upgrade)
  const silver = treasures.find(card => card.name === 'Silver');
  if (silver && gameState.supply['Gold'].length > 0) {
    treasureToUpgrade = silver;
    upgradeTo = 'Gold';
  }
  
  if (treasureToUpgrade && upgradeTo) {
    // Remove treasure from hand and trash it
    const index = currentPlayer.hand.indexOf(treasureToUpgrade);
    currentPlayer.hand.splice(index, 1);
    gameState.trash.push(treasureToUpgrade);
    
    // Gain upgraded treasure to hand
    const newTreasure = gameState.supply[upgradeTo].shift()!;
    currentPlayer.hand.push(newTreasure);
    
    gameState.gameLog.push(`${currentPlayer.name} trashes ${treasureToUpgrade.name} and gains ${upgradeTo} to hand.`);
  } else {
    gameState.gameLog.push(`${currentPlayer.name} cannot upgrade any treasures.`);
  }
  
  return gameState;
};

const applyRemodelEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  if (currentPlayer.hand.length > 0) {
    gameState.pendingChoice = {
      type: 'trash',
      playerId: gameState.currentPlayer,
      prompt: 'Choose a card to trash (you will gain a card costing up to 2 more)',
      options: currentPlayer.hand.map((card, index) => ({ card, index })),
      min: 0,
      max: 1,
      callback: 'remodelTrash'
    };
  }
  
  return gameState;
};

const applyWitchEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Witch', cost: 5, effect: '', type: CardType.ACTION, cards: 2 });
  
  // Each other player gains a Curse
  const otherPlayerIndex = (newState.currentPlayer + 1) % 2;
  const otherPlayer = newState.players[otherPlayerIndex];
  
  if (newState.supply['Curse'].length > 0) {
    const curse = newState.supply['Curse'].shift()!;
    otherPlayer.discard.push(curse);
    newState.gameLog.push(`${otherPlayer.name} gains a Curse.`);
  }
  
  return newState;
};

const applyHarbingerEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Harbinger', cost: 3, effect: '', type: CardType.ACTION, cards: 1, actions: 1 });
  
  const currentPlayer = newState.players[newState.currentPlayer];
  
  if (currentPlayer.discard.length > 0) {
    newState.pendingChoice = {
      type: 'order',
      playerId: newState.currentPlayer,
      prompt: 'Choose a card from your discard pile to put on top of your deck (or none)',
      options: currentPlayer.discard.map((card, index) => ({ card, index })),
      min: 0,
      max: 1,
      callback: 'harbingerPutBack'
    };
  }
  
  return newState;
};

const applyMerchantEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Merchant', cost: 3, effect: '', type: CardType.ACTION, cards: 1, actions: 1 });
  
  // Add a special flag to track that Merchant was played this turn
  const currentPlayer = newState.players[newState.currentPlayer];
  if (!currentPlayer.playArea.find(card => card.name === 'Merchant')) {
    // This will be checked when Silver is played
  }
  
  return newState;
};

const applyVassalEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Vassal', cost: 3, effect: '', type: CardType.ACTION, coins: 2 });
  
  const currentPlayer = newState.players[newState.currentPlayer];
  
  // Discard the top card of deck
  if (currentPlayer.deck.length === 0 && currentPlayer.discard.length > 0) {
    // Shuffle discard into deck
    currentPlayer.deck = [...currentPlayer.discard].sort(() => Math.random() - 0.5);
    currentPlayer.discard = [];
  }
  
  if (currentPlayer.deck.length > 0) {
    const topCard = currentPlayer.deck.pop()!;
    currentPlayer.discard.push(topCard);
    newState.gameLog.push(`${currentPlayer.name} discards ${topCard.name} from their deck.`);
    
    // If it's an Action card, they may play it
    if (topCard.type === CardType.ACTION) {
      newState.gameLog.push(`${currentPlayer.name} may play ${topCard.name}.`);
      // For simplicity, automatically play it if beneficial
      if (topCard.cards || topCard.actions || topCard.coins || topCard.buys) {
        // Move from discard back to hand and play it
        const cardIndex = currentPlayer.discard.indexOf(topCard);
        currentPlayer.discard.splice(cardIndex, 1);
        currentPlayer.hand.push(topCard);
        // Would need to recursively call playAction here
      }
    }
  }
  
  return newState;
};

const applyBureaucratEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  // Gain a Silver onto your deck
  if (gameState.supply['Silver'].length > 0) {
    const silver = gameState.supply['Silver'].shift()!;
    currentPlayer.deck.push(silver);
    gameState.gameLog.push(`${currentPlayer.name} gains a Silver onto their deck.`);
  }
  
  // Each other player reveals a Victory card and puts it on their deck
  const otherPlayerIndex = (gameState.currentPlayer + 1) % 2;
  const otherPlayer = gameState.players[otherPlayerIndex];
  
  const victoryCard = otherPlayer.hand.find(card => card.type === CardType.VICTORY);
  if (victoryCard) {
    const index = otherPlayer.hand.indexOf(victoryCard);
    otherPlayer.hand.splice(index, 1);
    otherPlayer.deck.push(victoryCard);
    gameState.gameLog.push(`${otherPlayer.name} puts ${victoryCard.name} on top of their deck.`);
  } else {
    gameState.gameLog.push(`${otherPlayer.name} reveals a hand with no Victory cards.`);
  }
  
  return gameState;
};

const applyPoacherEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Poacher', cost: 4, effect: '', type: CardType.ACTION, cards: 1, actions: 1, coins: 1 });
  
  // Discard a card per empty Supply pile
  const emptyPiles = Object.values(newState.supply).filter(pile => pile.length === 0).length;
  const currentPlayer = newState.players[newState.currentPlayer];
  
  if (emptyPiles > 0 && currentPlayer.hand.length > 0) {
    const numToDiscard = Math.min(emptyPiles, currentPlayer.hand.length);
    newState.pendingChoice = {
      type: 'discard',
      playerId: newState.currentPlayer,
      prompt: `Discard ${numToDiscard} card(s) due to empty supply piles`,
      options: currentPlayer.hand.map((card, index) => ({ card, index })),
      min: numToDiscard,
      max: numToDiscard,
      callback: 'militiaDiscard' // Reuse the same handler
    };
  }
  
  return newState;
};

const applyThroneRoomEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  const actionCards = currentPlayer.hand.filter(card => card.type === CardType.ACTION);
  
  if (actionCards.length > 0) {
    gameState.pendingChoice = {
      type: 'play_action',
      playerId: gameState.currentPlayer,
      prompt: 'Choose an Action card to play twice',
      options: currentPlayer.hand.map((card, index) => ({ card, index })).filter(({ card }) => card.type === CardType.ACTION),
      min: 0,
      max: 1,
      callback: 'throneRoomPlay'
    };
  }
  
  return gameState;
};

const applyBanditEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  // Gain a Gold
  if (gameState.supply['Gold'].length > 0) {
    const gold = gameState.supply['Gold'].shift()!;
    currentPlayer.discard.push(gold);
    gameState.gameLog.push(`${currentPlayer.name} gains a Gold.`);
  }
  
  // Each other player reveals the top 2 cards of their deck, trashes a revealed Treasure other than Copper, and discards the rest
  const otherPlayerIndex = (gameState.currentPlayer + 1) % 2;
  const otherPlayer = gameState.players[otherPlayerIndex];
  
  // Reveal top 2 cards
  const revealedCards: Card[] = [];
  for (let i = 0; i < 2; i++) {
    if (otherPlayer.deck.length === 0 && otherPlayer.discard.length > 0) {
      otherPlayer.deck = [...otherPlayer.discard].sort(() => Math.random() - 0.5);
      otherPlayer.discard = [];
    }
    if (otherPlayer.deck.length > 0) {
      revealedCards.push(otherPlayer.deck.pop()!);
    }
  }
  
  // Trash a treasure other than Copper
  const treasureToTrash = revealedCards.find(card => card.type === CardType.TREASURE && card.name !== 'Copper');
  if (treasureToTrash) {
    const index = revealedCards.indexOf(treasureToTrash);
    revealedCards.splice(index, 1);
    gameState.trash.push(treasureToTrash);
    gameState.gameLog.push(`${otherPlayer.name} trashes ${treasureToTrash.name}.`);
  }
  
  // Discard the rest
  otherPlayer.discard.push(...revealedCards);
  
  return gameState;
};

const applyLibraryEffect = (gameState: GameState): GameState => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  
  // Draw until you have 7 cards, skipping Action cards you choose to
  while (currentPlayer.hand.length < 7) {
    if (currentPlayer.deck.length === 0 && currentPlayer.discard.length > 0) {
      currentPlayer.deck = [...currentPlayer.discard].sort(() => Math.random() - 0.5);
      currentPlayer.discard = [];
    }
    
    if (currentPlayer.deck.length === 0) break;
    
    const card = currentPlayer.deck.pop()!;
    
    if (card.type === CardType.ACTION) {
      // For simplicity, automatically skip Action cards
      currentPlayer.discard.push(card);
      gameState.gameLog.push(`${currentPlayer.name} skips ${card.name}.`);
    } else {
      currentPlayer.hand.push(card);
    }
  }
  
  return gameState;
};

const applySentryEffect = (gameState: GameState): GameState => {
  let newState = applySimpleCardEffect(gameState, { name: 'Sentry', cost: 5, effect: '', type: CardType.ACTION, cards: 1, actions: 1 });
  
  const currentPlayer = newState.players[newState.currentPlayer];
  
  // Look at the top 2 cards of deck
  const topCards: Card[] = [];
  for (let i = 0; i < 2; i++) {
    if (currentPlayer.deck.length === 0 && currentPlayer.discard.length > 0) {
      currentPlayer.deck = [...currentPlayer.discard].sort(() => Math.random() - 0.5);
      currentPlayer.discard = [];
    }
    if (currentPlayer.deck.length > 0) {
      topCards.push(currentPlayer.deck.pop()!);
    }
  }
  
  if (topCards.length > 0) {
    // For simplicity, automatically trash Curses and discard Coppers, keep the rest
    topCards.forEach(card => {
      if (card.name === 'Curse') {
        newState.trash.push(card);
        newState.gameLog.push(`${currentPlayer.name} trashes ${card.name}.`);
      } else if (card.name === 'Copper') {
        currentPlayer.discard.push(card);
        newState.gameLog.push(`${currentPlayer.name} discards ${card.name}.`);
      } else {
        currentPlayer.deck.push(card);
      }
    });
  }
  
  return newState;
};

const applyArtisanEffect = (gameState: GameState): GameState => {
  const availableCards = Object.entries(gameState.supply)
    .filter(([name, cards]) => cards.length > 0 && getCardByName(name)!.cost <= 5)
    .map(([name]) => name);
  
  if (availableCards.length > 0) {
    gameState.pendingChoice = {
      type: 'gain',
      playerId: gameState.currentPlayer,
      prompt: 'Choose a card to gain to your hand (costing up to 5)',
      options: availableCards,
      min: 1,
      max: 1,
      callback: 'artisanGain'
    };
  }
  
  return gameState;
};