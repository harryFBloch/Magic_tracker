import { ActionType } from "../actionTypes";
import { Draft, DraftSettingsTemplate, DraftGameTemplate } from "./types";
import { RootAction } from "..";

const initialState: Draft = {
  drafting: false,
  draftMembers: {},
  draftOwner: '',
  settings: DraftSettingsTemplate,
  draftRounds: {},
  draftGames: {},
  currentGame: {...DraftGameTemplate}
};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

    case(ActionType.START_DRAFT):
      return {...action.draft}

    case(ActionType.UPDATE_DRAFT_ROUNDS):
      return {...state, draftRounds: {...action.draftRounds}};
    
    case(ActionType.UPDATE_DRAFT_OWNER):
    console.log('reduver', action)
      return {...state, draftOwner: action.ownerID}

    case(ActionType.UPDATE_DRAFT_GAMES):
      return {...state, draftGames: {...action.games}, currentGame: {...action.currentGame}}

    case(ActionType.CANCEL_DRAFT):
      return {...state, draftOwner: ''}

    case(ActionType.UPDATE_DRAFT_SETTINGS):
      return {...state, settings: action.settings}
    
    case(ActionType.DRAFT_LIFE_UPDATE):
      return { ...state, currentGame: {...state.currentGame, life: action.newLife}}
    
    case(ActionType.UPDATE_CURRENT_GAME):
      return { ...state, currentGame: action.game}
  
    default:
      return state;
  }
}