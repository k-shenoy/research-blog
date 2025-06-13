'use client';

import { useState, useCallback } from 'react';
import { GameState, GamePhase, Card, CardType, PlayerChoice } from './types';
import { createInitialGameState, cleanupPhase, playTreasure, buyCard, calculateVictoryPoints } from './gameLogic';
import { playAction } from './cardEffects';
import { resolveChoice } from './choiceSystem';

export default function DominionGame() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]);

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const otherPlayer = gameState.players[(gameState.currentPlayer + 1) % 2];

  const handlePlayAction = useCallback((cardIndex: number) => {
    if (gameState.phase === GamePhase.ACTION) {
      setGameState(prevState => playAction(prevState, cardIndex));
      setSelectedCard(null);
    }
  }, [gameState.phase]);

  const handlePlayTreasure = useCallback((cardIndex: number) => {
    if (gameState.phase === GamePhase.BUY) {
      setGameState(prevState => playTreasure(prevState, cardIndex));
      setSelectedCard(null);
    }
  }, [gameState.phase]);

  const handleBuyCard = useCallback((cardName: string) => {
    if (gameState.phase === GamePhase.BUY) {
      setGameState(prevState => buyCard(prevState, cardName));
    }
  }, [gameState.phase]);

  const handleNextPhase = useCallback(() => {
    if (gameState.phase === GamePhase.ACTION) {
      setGameState(prevState => ({ ...prevState, phase: GamePhase.BUY }));
    } else if (gameState.phase === GamePhase.BUY) {
      setGameState(prevState => cleanupPhase(prevState));
    }
    setSelectedCard(null);
  }, [gameState.phase]);

  const handleChoice = useCallback((choiceIndex: number) => {
    if (!gameState.pendingChoice) return;
    
    const choice = gameState.pendingChoice;
    const newSelectedChoices = [...selectedChoices];
    
    if (newSelectedChoices.includes(choiceIndex)) {
      // Remove if already selected
      const index = newSelectedChoices.indexOf(choiceIndex);
      newSelectedChoices.splice(index, 1);
    } else {
      // Add if not selected and under max
      if (newSelectedChoices.length < (choice.max || 1)) {
        newSelectedChoices.push(choiceIndex);
      }
    }
    
    setSelectedChoices(newSelectedChoices);
  }, [gameState.pendingChoice, selectedChoices]);

  const handleConfirmChoice = useCallback(() => {
    if (!gameState.pendingChoice) return;
    
    const choice = gameState.pendingChoice;
    if (selectedChoices.length >= (choice.min || 0) && selectedChoices.length <= (choice.max || 1)) {
      setGameState(prevState => resolveChoice(prevState, selectedChoices));
      setSelectedChoices([]);
    }
  }, [gameState.pendingChoice, selectedChoices]);

  const handleSkipChoice = useCallback(() => {
    if (!gameState.pendingChoice) return;
    
    const choice = gameState.pendingChoice;
    if ((choice.min || 0) === 0) {
      setGameState(prevState => resolveChoice(prevState, []));
      setSelectedChoices([]);
    }
  }, [gameState.pendingChoice]);

  const getCardTypeColor = (card: Card): string => {
    switch (card.type) {
      case CardType.TREASURE: return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case CardType.VICTORY: return 'bg-green-100 border-green-300 text-green-800';
      case CardType.ACTION: return 'bg-blue-100 border-blue-300 text-blue-800';
      case CardType.CURSE: return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const CardComponent = ({ card, index, onClick, isSelected = false, showCount = false, count = 0 }: {
    card: Card;
    index?: number;
    onClick?: () => void;
    isSelected?: boolean;
    showCount?: boolean;
    count?: number;
  }) => (
    <div
      className={`
        relative border-2 rounded-lg p-2 cursor-pointer transition-all duration-200 text-xs group
        ${getCardTypeColor(card)}
        ${isSelected ? 'ring-2 ring-blue-500 transform scale-105' : ''}
        ${onClick ? 'hover:shadow-md hover:transform hover:scale-105' : ''}
        ${showCount && count === 0 ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={onClick && count !== 0 ? onClick : undefined}
    >
      <div className="font-bold text-center mb-1">{card.name}</div>
      <div className="text-center text-xs">
        Cost: {card.cost}
      </div>
      {showCount && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {count}
        </div>
      )}
      
      {/* Tooltip for card effect */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 max-w-xs whitespace-normal pointer-events-none">
        <div className="font-bold mb-1">{card.name}</div>
        <div>{card.effect}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  if (gameState.gameEnded) {
    const player1VP = calculateVictoryPoints(gameState.players[0]);
    const player2VP = calculateVictoryPoints(gameState.players[1]);
    
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <div className="text-lg mb-4">
          <div>Player 1: {player1VP} Victory Points</div>
          <div>Player 2: {player2VP} Victory Points</div>
        </div>
        <div className="text-xl font-bold mb-4">
          {gameState.winner !== undefined 
            ? `Player ${gameState.winner + 1} Wins!` 
            : "It's a Tie!"}
        </div>
        <button
          onClick={() => setGameState(createInitialGameState())}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Game
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Current Player Info */}
      <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{currentPlayer.name}'s Turn</h2>
          <div className="text-sm">
            Phase: <span className="font-bold">{gameState.phase.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <span>Actions: <strong>{currentPlayer.actions}</strong></span>
          <span>Buys: <strong>{currentPlayer.buys}</strong></span>
          <span>Coins: <strong>{currentPlayer.coins}</strong></span>
        </div>
      </div>

      {/* Supply */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Supply</h3>
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          {gameState.phase === GamePhase.BUY && (
            <p>Click cards to buy them (you have {currentPlayer.coins} coin{currentPlayer.coins !== 1 ? 's' : ''} and {currentPlayer.buys} buy{currentPlayer.buys !== 1 ? 's' : ''} remaining)</p>
          )}
          {gameState.phase === GamePhase.ACTION && (
            <p>Play Action cards from your hand first, then advance to Buy phase</p>
          )}
          <p className="text-xs mt-1">Hover over cards to see their effects</p>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {Object.entries(gameState.supply).map(([cardName, cards]) => {
            const card = cards[0] || { name: cardName, cost: 0, effect: '', type: CardType.TREASURE };
            const canAfford = gameState.phase === GamePhase.BUY && currentPlayer.coins >= card.cost && currentPlayer.buys > 0 && cards.length > 0;
            
            return (
              <div key={cardName} className="relative">
                <CardComponent
                  card={card}
                  onClick={() => handleBuyCard(cardName)}
                  showCount={true}
                  count={cards.length}
                />
                {canAfford && (
                  <div className="absolute -top-1 -left-1 bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center animate-pulse">
                    $
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Player's Hand */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">{currentPlayer.name}'s Hand</h3>
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          {gameState.phase === GamePhase.ACTION && (
            <p>Click Action cards to play them (you have {currentPlayer.actions} action{currentPlayer.actions !== 1 ? 's' : ''} remaining)</p>
          )}
          {gameState.phase === GamePhase.BUY && (
            <p>Click Treasure cards to play them for coins, then buy cards from the supply</p>
          )}
        </div>
        <div className="grid grid-cols-8 gap-2">
          {currentPlayer.hand.map((card, index) => {
            const isPlayable = (gameState.phase === GamePhase.ACTION && card.type === CardType.ACTION && currentPlayer.actions > 0) ||
                              (gameState.phase === GamePhase.BUY && card.type === CardType.TREASURE);
            
            return (
              <div 
                key={index} 
                className="relative cursor-pointer"
                onClick={() => {
                  if (gameState.phase === GamePhase.ACTION && card.type === CardType.ACTION && currentPlayer.actions > 0) {
                    handlePlayAction(index);
                  } else if (gameState.phase === GamePhase.BUY && card.type === CardType.TREASURE) {
                    handlePlayTreasure(index);
                  } else {
                    setSelectedCard(selectedCard === index ? null : index);
                  }
                }}
              >
                <CardComponent
                  card={card}
                  index={index}
                  isSelected={selectedCard === index}
                />
                {isPlayable && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center animate-pulse pointer-events-none">
                    !
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Play Area */}
      {currentPlayer.playArea.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">In Play</h3>
          <div className="grid grid-cols-8 gap-2">
            {currentPlayer.playArea.map((card, index) => (
              <CardComponent key={index} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleNextPhase}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={!!gameState.pendingChoice}
        >
          {gameState.phase === GamePhase.ACTION ? 'Go to Buy Phase' : 'End Turn'}
        </button>
      </div>

      {/* Player Choice Modal */}
      {gameState.pendingChoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {gameState.players[gameState.pendingChoice.playerId].name}: {gameState.pendingChoice.prompt}
            </h3>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {gameState.pendingChoice.options.map((option, index) => {
                const isSelected = selectedChoices.includes(index);
                const card = typeof option === 'string' ? { name: option, cost: 0, effect: '', type: CardType.TREASURE } : option.card;
                
                return (
                  <div
                    key={index}
                    className={`
                      border-2 rounded-lg p-2 cursor-pointer transition-all duration-200 text-xs
                      ${getCardTypeColor(card)}
                      ${isSelected ? 'ring-2 ring-blue-500 transform scale-105' : ''}
                      hover:shadow-md hover:transform hover:scale-105
                    `}
                    onClick={() => handleChoice(index)}
                  >
                    <div className="font-bold text-center mb-1">{card.name}</div>
                    {gameState.pendingChoice?.type === 'gain' && (
                      <div className="text-center text-xs">Cost: {card.cost}</div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-2 justify-end">
              {(gameState.pendingChoice.min || 0) === 0 && (
                <button
                  onClick={handleSkipChoice}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleConfirmChoice}
                disabled={selectedChoices.length < (gameState.pendingChoice.min || 0) || selectedChoices.length > (gameState.pendingChoice.max || 1)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
              >
                Confirm ({selectedChoices.length}/{gameState.pendingChoice.min || 0}-{gameState.pendingChoice.max || 1})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Player Info */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-lg font-bold mb-2">{otherPlayer.name}</h3>
        <div className="text-sm">
          <span>Hand: {otherPlayer.hand.length} cards</span>
          <span className="ml-4">Deck: {otherPlayer.deck.length} cards</span>
          <span className="ml-4">Discard: {otherPlayer.discard.length} cards</span>
        </div>
      </div>

      {/* Game Log */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Game Log</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-32 overflow-y-auto">
          {gameState.gameLog.slice(-10).map((entry, index) => (
            <div key={index} className="text-sm mb-1">{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}