export interface Card {
  name: string;
  cost: number;
  effect: string;
  type: CardType;
  victoryPoints?: number;
  coins?: number;
  actions?: number;
  buys?: number;
  cards?: number;
}

export enum CardType {
  TREASURE = 'treasure',
  VICTORY = 'victory',
  ACTION = 'action',
  CURSE = 'curse'
}

export enum GamePhase {
  ACTION = 'action',
  BUY = 'buy',
  CLEANUP = 'cleanup'
}

export interface Player {
  id: number;
  name: string;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  playArea: Card[];
  actions: number;
  buys: number;
  coins: number;
}

export interface PlayerChoice {
  type: 'discard' | 'trash' | 'gain' | 'order' | 'play_action' | 'yes_no';
  playerId: number;
  prompt: string;
  options: any[];
  min?: number;
  max?: number;
  callback?: string; // Function name to call with choices
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  phase: GamePhase;
  supply: { [cardName: string]: Card[] };
  trash: Card[];
  gameLog: string[];
  gameEnded: boolean;
  winner?: number;
  pendingChoice?: PlayerChoice;
}

export interface GameAction {
  type: string;
  payload?: any;
}