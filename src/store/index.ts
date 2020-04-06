import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as authActions from './auth/actions';
import { AuthAction } from './auth/types';

export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
  auth: authActions
};

export * from './types';
export * from './auth/types';

export type RootAction = AuthAction; 
export type RootState = StateType<typeof rootReducer>;