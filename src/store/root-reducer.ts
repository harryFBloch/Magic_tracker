import { combineReducers } from 'redux';
import auth from './auth/reducer';
import decks from './decks/reducer';
import games from './games/reducer';

const rootReducer = combineReducers({
  auth,
  decks,
  games,
});

export default rootReducer;