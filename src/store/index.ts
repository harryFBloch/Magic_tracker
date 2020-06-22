import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as authActions from './auth/actions';
import { AuthAction } from './auth/types';
import * as deckActions from './decks/actions';
import { GameAction } from './games/types';
import * as gameActions from './games/actions';
import { DeckAction } from './decks/types';


export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
  auth: authActions,
  decks: deckActions,
  games: gameActions
};

export * from './types';
export * from './auth/types';
export * from './decks/types';
export * from './games/types';

export type RootAction = AuthAction | DeckAction | GameAction; 
export type RootState = StateType<typeof rootReducer>;