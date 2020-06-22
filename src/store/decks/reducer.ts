import { ActionType } from "../actionTypes";
import { deckTemplate, decksTemplate } from "./types";
import { RootAction } from "..";

const initialState = {
  decks: decksTemplate,
  selectedDeck: deckTemplate
}

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

  
    case (ActionType.ADD_DECK):
      return {...state, decks: [...state.decks, action.deck]}

    case (ActionType.GET_DECKS):
      return {decks: action.decks, selectedDeck: action.decks[0]}

    case (ActionType.SELECT_DECK):
      return {...state, selectedDeck: action.deck}

    default:
      return state;
  }
}