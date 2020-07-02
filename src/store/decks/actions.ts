import { ThunkResult, ThunkDispatchType } from '../types';
import { ActionType } from '../actionTypes';
import firebase from '../../config/firebaseConfig';
import 'firebase/database';
import { RootState } from '..';
import { Deck } from './types';



export const addDeck = (deck: Deck): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  return firebase.database().ref(`/users/${getState().auth.uid}/decks/${deck.id}`).set(deck)
  .then((data): void => {
    dispatch({type: ActionType.ADD_DECK, deck: deck});
    Promise.resolve();
  })
  .catch((error): void => console.log(error));
}

export const getDecks = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  return firebase.database().ref(`/users/${getState().auth.uid}/decks`).once('value')
  .then((data) => {
    const jsongData = data.toJSON()
    if (jsongData) {
      const decks = Object.values(jsongData)
      dispatch({type: ActionType.GET_DECKS, decks: decks})
    } else {
      return Promise.reject('no decks')
    }
    Promise.resolve()
  })
  .catch((error)=> Promise.reject(error));
}

export const selectDeck = (deck: Deck): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  console.log('selecting')
  dispatch({type: ActionType.SELECT_DECK, deck: deck});
}

export const updateDeckNote = (deckID: number, note: string): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  return firebase.database().ref(`/users/${getState().auth.uid}/decks/${deckID}/notes`).set(note)
  .catch((error)=> Promise.reject(error));
}

