import { combineReducers } from 'redux';
import auth from './auth/reducer';
import decks from './decks/reducer';
import games from './games/reducer';
import flags from './flags/reducer';

const rootReducer = combineReducers({
  auth,
  decks,
  games,
  flags
});

export default rootReducer;