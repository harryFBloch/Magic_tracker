import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as authActions from './auth/actions';
import { AuthAction } from './auth/types';
import * as deckActions from './decks/actions';
import { GameAction } from './games/types';
import * as gameActions from './games/actions';
import { DeckAction } from './decks/types';
import * as flagsActions from './flags/actions';
import { FlagsAction } from './flags/types';
import * as draftActions from './draft/actions';
import { DraftAction } from './draft/types';


export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
  auth: authActions,
  decks: deckActions,
  games: gameActions,
  flags: flagsActions,
  draft: draftActions
};

export * from './types';
export * from './auth/types';
export * from './decks/types';
export * from './games/types';
export * from './flags/types';
export * from './draft/types';

export type RootAction = AuthAction | DeckAction | GameAction | FlagsAction | DraftAction; 
export type RootState = StateType<typeof rootReducer>;