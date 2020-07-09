import { ActionType } from "../actionTypes";
import { Flags } from "./types";
import { RootAction } from "..";

const initialState: Flags = {
  showInterAd: false
};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {
  
    case (ActionType.SHOW_INTER_AD):
      return {showInterAd: true};

    case (ActionType.CLOSE_INTER_AD):
      return {showInterAd: false}
    default:
      return state;
  }
}