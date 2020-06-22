import { ActionType } from "../actionTypes";
import { gameTemplate, gameHistoryTemplate } from "./types";
import { RootAction } from "..";

const initialState = {
  currentGame: gameTemplate,
  gameHistory: gameHistoryTemplate,
  gameOverAlert: false
}

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

    case (ActionType.SET_GAME_HISTORY):
      return {...state, gameHistory: action.gameHistory}

    case (ActionType.GET_OPPONET_DECK_SUCCESS):
      return {...state, currentGame: {...state.currentGame, opponentDeck: action.deck, opponentUID: action.opponentUID,
        opponentUsername: action.opponentUsername}}

    case (ActionType.START_GAME):
      return {...state, 
        currentGame: {...state.currentGame, gameStarted: true, deckID: action.deckID, justPlay: action.justPlay, myScore: 20, opponentScore: 20}}

    case (ActionType.GAME_OVER):
      return {...state, currentGame: {...state.currentGame, gameStarted: false, win: action.win}}

    case (ActionType.END_GAME_RESET):
      return {...state, currentGame: gameTemplate} 
    
    case (ActionType.GAME_OVER_ALERT):
      return {...state, gameOverAlert: !state.gameOverAlert}
      
    case (ActionType.GAME_REMATCH):
      console.log('rematching')
      return {...state, 
        currentGame: {...state.currentGame, myScore: gameTemplate.myScore, opponentScore: gameTemplate.opponentScore, gameStarted: true}}

    case (ActionType.SET_SCORE):
      if (action.opponent) {
        return {...state, currentGame: {...state.currentGame, 
          opponentScore: action.newScore
        }}
      } else {
        return {...state, currentGame: {...state.currentGame, 
          myScore: action.newScore
        }}
      }
    default:
      return state;
  }
}