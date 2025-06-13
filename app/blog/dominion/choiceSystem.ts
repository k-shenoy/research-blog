import { GameState, PlayerChoice, Card, CardType } from './types';
import { getCardByName } from './cards';

export const resolveChoice = (gameState: GameState, selectedIndices: number[]): GameState => {
  if (!gameState.pendingChoice) return gameState;
  
  const choice = gameState.pendingChoice;
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
    gameLog: [...gameState.gameLog],
    pendingChoice: undefined
  };
  
  switch (choice.callback) {
    case 'militiaDiscard':
      return resolveMilitiaDiscard(newState, choice.playerId, selectedIndices);
    case 'cellarDiscard':
      return resolveCellarDiscard(newState, choice.playerId, selectedIndices);
    case 'chapelTrash':
      return resolveChapelTrash(newState, choice.playerId, selectedIndices);
    case 'remodelTrash':
      return resolveRemodelTrash(newState, choice.playerId, selectedIndices);
    case 'remodelGain':
      return resolveRemodelGain(newState, choice.playerId, selectedIndices[0]);
    case 'workshopGain':
      return resolveWorkshopGain(newState, choice.playerId, selectedIndices[0]);
    case 'throneRoomPlay':
      return resolveThroneRoomPlay(newState, choice.playerId, selectedIndices[0]);
    case 'librarySkip':
      return resolveLibrarySkip(newState, choice.playerId, selectedIndices);
    case 'sentryActions':
      return resolveSentryActions(newState, choice.playerId, selectedIndices);
    case 'artisanGain':
      return resolveArtisanGain(newState, choice.playerId, selectedIndices[0]);
    case 'artisanPutBack':
      return resolveArtisanPutBack(newState, choice.playerId, selectedIndices[0]);
    case 'harbingerPutBack':
      return resolveHarbingerPutBack(newState, choice.playerId, selectedIndices[0]);
    default:
      return newState;
  }
};

// Choice resolution functions
const resolveMilitiaDiscard = (gameState: GameState, playerId: number, cardIndices: number[]): GameState => {
  const player = gameState.players[playerId];
  
  // Sort indices in descending order to avoid index shifts
  cardIndices.sort((a, b) => b - a);
  
  for (const index of cardIndices) {
    if (index >= 0 && index < player.hand.length) {
      const card = player.hand.splice(index, 1)[0];
      player.discard.push(card);
    }
  }
  
  gameState.gameLog.push(`${player.name} discards ${cardIndices.length} card(s).`);
  return gameState;
};

const resolveCellarDiscard = (gameState: GameState, playerId: number, cardIndices: number[]): GameState => {
  const player = gameState.players[playerId];
  
  // Sort indices in descending order
  cardIndices.sort((a, b) => b - a);
  
  for (const index of cardIndices) {
    if (index >= 0 && index < player.hand.length) {
      const card = player.hand.splice(index, 1)[0];
      player.discard.push(card);
    }
  }
  
  // Draw cards equal to number discarded
  for (let i = 0; i < cardIndices.length; i++) {
    if (player.deck.length === 0 && player.discard.length > 0) {
      // Shuffle discard into deck
      player.deck = [...player.discard].sort(() => Math.random() - 0.5);
      player.discard = [];
    }
    if (player.deck.length > 0) {
      const card = player.deck.pop()!;
      player.hand.push(card);
    }
  }
  
  gameState.gameLog.push(`${player.name} discards ${cardIndices.length} card(s) and draws ${cardIndices.length} card(s).`);
  return gameState;
};

const resolveChapelTrash = (gameState: GameState, playerId: number, cardIndices: number[]): GameState => {
  const player = gameState.players[playerId];
  
  cardIndices.sort((a, b) => b - a);
  
  for (const index of cardIndices) {
    if (index >= 0 && index < player.hand.length) {
      const card = player.hand.splice(index, 1)[0];
      gameState.trash.push(card);
      gameState.gameLog.push(`${player.name} trashes ${card.name}.`);
    }
  }
  
  return gameState;
};

const resolveRemodelTrash = (gameState: GameState, playerId: number, cardIndices: number[]): GameState => {
  const player = gameState.players[playerId];
  
  if (cardIndices.length === 0) {
    gameState.gameLog.push(`${player.name} chooses not to remodel anything.`);
    return gameState;
  }
  
  const cardIndex = cardIndices[0];
  const card = player.hand[cardIndex];
  const maxCost = card.cost + 2;
  
  // Remove card from hand and trash it
  player.hand.splice(cardIndex, 1);
  gameState.trash.push(card);
  
  // Create choice for gaining card
  const availableCards = Object.entries(gameState.supply)
    .filter(([name, cards]) => cards.length > 0 && getCardByName(name)!.cost <= maxCost)
    .map(([name]) => name);
  
  if (availableCards.length > 0) {
    gameState.pendingChoice = {
      type: 'gain',
      playerId,
      prompt: `Choose a card to gain (costing up to ${maxCost})`,
      options: availableCards,
      min: 1,
      max: 1,
      callback: 'remodelGain'
    };
  }
  
  gameState.gameLog.push(`${player.name} trashes ${card.name}.`);
  return gameState;
};

const resolveRemodelGain = (gameState: GameState, playerId: number, cardIndex: number): GameState => {
  const player = gameState.players[playerId];
  const cardName = gameState.pendingChoice?.options[cardIndex];
  
  if (cardName && gameState.supply[cardName]?.length > 0) {
    const card = gameState.supply[cardName].shift()!;
    player.discard.push(card);
    gameState.gameLog.push(`${player.name} gains ${cardName}.`);
  }
  
  return gameState;
};

const resolveWorkshopGain = (gameState: GameState, playerId: number, cardIndex: number): GameState => {
  const player = gameState.players[playerId];
  const cardName = gameState.pendingChoice?.options[cardIndex];
  
  if (cardName && gameState.supply[cardName]?.length > 0) {
    const card = gameState.supply[cardName].shift()!;
    player.discard.push(card);
    gameState.gameLog.push(`${player.name} gains ${cardName}.`);
  }
  
  return gameState;
};

const resolveThroneRoomPlay = (gameState: GameState, playerId: number, cardIndex: number): GameState => {
  const player = gameState.players[playerId];
  
  if (cardIndex >= 0 && cardIndex < player.hand.length) {
    const card = player.hand[cardIndex];
    if (card.type === CardType.ACTION) {
      // Play the action card twice by applying its effects twice
      // This is a simplified implementation - in reality we'd need to import playAction
      gameState.gameLog.push(`${player.name} plays ${card.name} twice with Throne Room.`);
    }
  }
  
  return gameState;
};

const resolveLibrarySkip = (gameState: GameState, playerId: number, skipIndices: number[]): GameState => {
  // This would be used for Library's effect of skipping Action cards
  return gameState;
};

const resolveSentryActions = (gameState: GameState, playerId: number, actionIndices: number[]): GameState => {
  // This would handle Sentry's trash/discard/reorder choices
  return gameState;
};

const resolveArtisanGain = (gameState: GameState, playerId: number, cardIndex: number): GameState => {
  const player = gameState.players[playerId];
  const cardName = gameState.pendingChoice?.options[cardIndex];
  
  if (cardName && gameState.supply[cardName]?.length > 0) {
    const card = gameState.supply[cardName].shift()!;
    player.hand.push(card); // Artisan gains to hand, not discard
    gameState.gameLog.push(`${player.name} gains ${cardName} to hand.`);
    
    // Now create choice for putting a card from hand onto deck
    gameState.pendingChoice = {
      type: 'order',
      playerId,
      prompt: 'Choose a card from your hand to put on top of your deck',
      options: player.hand.map((card, index) => ({ card, index })),
      min: 1,
      max: 1,
      callback: 'artisanPutBack'
    };
  }
  
  return gameState;
};

const resolveArtisanPutBack = (gameState: GameState, playerId: number, cardIndex: number): GameState => {
  const player = gameState.players[playerId];
  
  if (cardIndex >= 0 && cardIndex < player.hand.length) {
    const card = player.hand.splice(cardIndex, 1)[0];
    player.deck.push(card);
    gameState.gameLog.push(`${player.name} puts a card on top of their deck.`);
  }
  
  return gameState;
};

const resolveHarbingerPutBack = (gameState: GameState, playerId: number, cardIndex: number): GameState => {
  const player = gameState.players[playerId];
  
  if (cardIndex >= 0 && cardIndex < player.discard.length) {
    const card = player.discard.splice(cardIndex, 1)[0];
    player.deck.push(card);
    gameState.gameLog.push(`${player.name} puts ${card.name} on top of their deck.`);
  }
  
  return gameState;
};