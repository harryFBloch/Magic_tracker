import { ActionType } from '../actionTypes';
import { Deck, deckTemplate } from '../decks/types';

export interface Game {
  win: boolean;
  myScore: number;
  opponentScore: number;
  opponentUsername: string;
  opponentDeck: Deck;
  opponentUID: string;
  date: number;
  deckID: number;
  gameStarted: boolean;
  justPlay: boolean;
};

//TODO:: FIX THIS WITH TEMPLATES FILE FOR ALL TEMPLATES
export const gameTemplate: Game = {
    win: true,
    myScore: 20,
    opponentScore: 20,
    opponentUsername: "Player2",
    opponentDeck: deckTemplate,
    opponentUID: "",
    date: 0,
    deckID: 0,
    gameStarted: false,
    justPlay: false
};

export const gameHistoryTemplate: Game[] = [];

export type GameAction = 
  { type: ActionType.GET_DECK_FROM_FIREBASE, userID: string, deckID: number } | 
  { type: ActionType.GET_OPPONET_DECK_SUCCESS, deck: Deck, opponentUID: string , opponentUsername: string} |
  { type: ActionType.START_GAME, deckID: number , justPlay: boolean, startingLife: number} |
  { type: ActionType.GAME_OVER, win: boolean } | 
  { type: ActionType.SET_SCORE, opponent: boolean, newScore: number} | 
  { type: ActionType.SET_GAME_HISTORY, gameHistory: Game[]} | 
  { type: ActionType.END_GAME_RESET } | 
  { type: ActionType.GAME_REMATCH } |
  { type: ActionType.GAME_OVER_ALERT }

