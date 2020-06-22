import { ActionType } from '../actionTypes';
import { Game } from '../games/types';

export interface Deck {
  name: string;
  description: string;
  notes: string;
  wins: number;
  losses: number;
  gameHistory: Game[];
  id: number;
}

export const deckTemplate: Deck = {
  name: "",
  description: "",
  notes: "",
  wins: 0,
  losses: 0,
  gameHistory: [],
  id: 0
}

export const decksTemplate: Deck[] = []

export type DeckAction = 
  { type: ActionType.ADD_DECK; deck: Deck } | 
  { type: ActionType.GET_DECKS; decks: Deck[]} |
  { type: ActionType.SELECT_DECK, deck: Deck }