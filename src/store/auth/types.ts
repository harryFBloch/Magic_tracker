import { ActionType } from '../actionTypes';

export interface Auth {
  uid: string;
  isLoading: boolean;
}

export type AuthAction = 
  { type: ActionType.USER_LOADING } | 
  { type: ActionType.AUTHENTICATION_ERROR } | 
  { type: ActionType.LOGIN_FAILED } | 
  { type: ActionType.LOGOUT_SUCCESSFUL } |
  { type: ActionType.USER_LOADED; uid: string;} |
  { type: ActionType.LOGIN_SUCCESSFUL; uid: string; } |
  { type: ActionType.AUTO_LOGIN_FAILED} |
  { type: ActionType.AUTO_LOGIN}