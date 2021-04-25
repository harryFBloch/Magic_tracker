import { ThunkResult, ThunkDispatchType } from '../types';
import { ActionType } from '../actionTypes';
import firebase from '../../config/firebaseConfig';
import 'firebase/database';
import { RootState } from '..';

export const getDeckFromFirebase = (userID: string, deckID: string): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  let opponentUsername = ''

   firebase.database().ref(`/users/${userID}/username`).once('value')
  .then((data): void => {
    opponentUsername = data.val();
    console.log(opponentUsername, 'username')
    firebase.database().ref(`/users/${userID}/decks/${deckID}`).once('value')
    .then((data): void => {
      const deck = data.val();
      dispatch({type: ActionType.GET_OPPONET_DECK_SUCCESS, deck: deck, opponentUID: userID, opponentUsername: opponentUsername});
      Promise.resolve();
    })
    .catch((error): void => console.log(error));
  })
}

export const startGame = (startingLife: number, justPlay = false): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  dispatch({type: ActionType.START_GAME, deckID: getState().decks.selectedDeck.id, justPlay: justPlay, startingLife: startingLife});
}

const sendGameDataToFirebase = (getState: () => RootState, win: boolean): Promise<void> => {
  const currentGame = getState().games.currentGame
  const auth = getState().auth;
  const decks = getState().decks;
  const gameDate = new Date().getTime();

  const gameToSave = {
    win: win,
    opponentUsername: currentGame.opponentUsername,
    myScore: currentGame.myScore,
    opponentScore: currentGame.opponentScore,
    opponentDeck: currentGame.opponentDeck.name,
    deckID: currentGame.deckID,
    date: gameDate,
  }
  const opponentGameToSave = {
    win: !win,
    opponentUsername: auth.username,
    myScore: currentGame.opponentScore,
    opponentScore: currentGame.myScore,
    opponentDeck: decks.selectedDeck.name,
    deckID: currentGame.opponentDeck.id,
    date: gameDate,
  }
  firebase.database().ref(`/users/${currentGame.opponentUID}/games/`).push(JSON.stringify(opponentGameToSave));
  return firebase.database().ref(`/users/${auth.uid}/games/`).push(JSON.stringify(gameToSave))
  .then((data): Promise<void> => {
    return Promise.resolve()
  })
  .catch((error): Promise<void> => Promise.reject(error));
}

export const gameOverReset = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  dispatch({type: ActionType.END_GAME_RESET});
}

export const gameOver = (win: boolean): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  const currentGame = getState().games.currentGame;
  if (!currentGame.justPlay){
    sendGameDataToFirebase(getState, win)
    .then(() => dispatch({type: ActionType.GAME_OVER, win: win}))
    .catch((error) => console.log(error));
  } else {
    dispatch({type: ActionType.GAME_OVER, win: win});
  }
}

export const rematch = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  dispatch({type: ActionType.GAME_REMATCH });
}

export const setScore = (opponent: boolean, newScore: number): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  dispatch({type: ActionType.SET_SCORE, opponent: opponent, newScore: newScore});
}

export const getGames = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  firebase.database().ref(`/users/${getState().auth.uid}/games`).on('value', (data) => {
    const gameData = data.toJSON()
    if (gameData) {
      const games = Object.values(gameData).map((game: string) => JSON.parse(game))
      console.log(games)
      dispatch({type: ActionType.SET_GAME_HISTORY, gameHistory: games})
    }
  })
}

export const gameOverAlertToggle = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  dispatch({type: ActionType.GAME_OVER_ALERT});
}