import { ActionType } from '../actionTypes';

export interface Flags {
  showInterAd: boolean
}

export type FlagsAction = 
  { type: ActionType.SHOW_INTER_AD} | 
  { type: ActionType.CLOSE_INTER_AD }
  