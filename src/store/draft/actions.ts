import firebase from '../../config/firebaseConfig';
import 'firebase/database';
import { ActionType } from "../actionTypes"
import { ThunkResult, ThunkDispatchType } from "../types"
import { RootState } from '..';
import { DraftTemplate, DraftRounds, DraftMember, DraftGameTemplate, DraftGame, TestDraftMemberData, DraftMatch, Match, DraftGameRounds } from './types';


const watchDraft = (getState: () => RootState, dispatch: ThunkDispatchType, ownerID: string): void => {
  const updateGames = (data: firebase.database.DataSnapshot): void => {
      if (data.val()) {
        const currentGame = {...data.val()[getState().draft.settings.round]}
        console.log('current game', currentGame, data.val())
        dispatch({ type: ActionType.UPDATE_DRAFT_GAMES, games: data.val(), currentGame: currentGame}) 
      }
  }
  //TODO: switch comments before realse
  firebase.database().ref(`/drafts/${ownerID}/draftGames/${1}`).on('value', updateGames);
  // firebase.database().ref(`/drafts/${ownerID}/draftGames${getState().auth.uid}/`).on('value', updateGames);
}

export const watchSettiings = (getState: () => RootState, dispatch: ThunkDispatchType, ownerID: string): void => { 
  const updateDraftSettings = (data: firebase.database.DataSnapshot) => {
    if (data.val()){
      const game = {...getState().draft.currentGame}
      debugger
      if (game.matchNumber !== data.val().round) {
        game.matchRound = data.val().round
        dispatch({type: ActionType.UPDATE_CURRENT_GAME, game: game})
      }
      dispatch({type: ActionType.UPDATE_DRAFT_SETTINGS, settings: data.val()})
    }
  }
  firebase.database().ref(`/drafts/${ownerID}/settings`).on('value', updateDraftSettings);
}


export const watchforDraft = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {

  const draftIDChanged = (data: firebase.database.DataSnapshot): void => {
    if(data.val()) {
      watchSettiings(getState, dispatch, data.val());
      watchDraft(getState, dispatch, data.val());
      dispatch({type: ActionType.UPDATE_DRAFT_OWNER, ownerID: data.val()});
    }
  }
  firebase.database().ref(`users/${getState().auth.uid}/draftID`).on('value', draftIDChanged)
}

export const startDraftSetup = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  const uid = getState().auth.uid;
  let draft = DraftTemplate;
  draft.draftMembers = {[`${uid}`]: { username: getState().auth.username}};
  draft.drafting = true;
  return firebase.database().ref(`/drafts/${uid}`).set(draft)
  .then((data) => {
    dispatch({type: ActionType.START_DRAFT, draft});
  })
}

export const joinDraft = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  watchDraft(getState, dispatch, getState().draft.draftOwner);
}

export const removeDraftMember = (uid: string): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  firebase.database().ref(`drafts/${getState().auth.uid}/draftMembers/${uid}`).remove()
}

//set property user.draftID to draft owner ID so we can locate the draft
export const addUserToDraft = (uid: string, username: string): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  const draftMember = { username: username}
  firebase.database().ref(`drafts/${getState().auth.uid}/draftMembers/${uid}`).set(draftMember)
  .then((data) => {
    console.log('new draft member added')
  })
  .catch((error) => console.log(error))
}

const buildDraftMatches = ( rounds: number, draftMembers: DraftMember): DraftRounds => {
  console.log('building rounds');
  let roundCounter = 1;
  

  const draftRounds: DraftRounds = {}
  while (roundCounter <= rounds) {
    let memberIDs = Object.keys(draftMembers)
    let memberIDsCopy = [...memberIDs];
    //shuffle arrays
    memberIDs.sort(() => 0.5 - Math.random());
    memberIDsCopy.sort(() => 0.5 - Math.random());

    const matches: DraftMatch = {};

    let i = 0;
    while (memberIDs.length) {
      const random = Math.floor(Math.random() * memberIDsCopy.length);

      const player1 = memberIDs.pop()
      let player2 = memberIDsCopy[0] == player1 ? memberIDsCopy.pop() : memberIDs.shift();;

      if (player1 && player2) {
        if (player2 !== player1) {
          const match: Match = {player1: player1, player2: player2, 
            player1Username: draftMembers[player1].username, player2Username: draftMembers[player2].username}
          matches[i] = match;
        }
      } else {
        console.log('error no players')
      }
      i = i + 1;
    }
    draftRounds[roundCounter] = matches;
    roundCounter = roundCounter + 1;
  }

  return draftRounds
}

const buildDraftGames = (draftRounds: DraftRounds): DraftGameRounds => {
  const games: DraftGameRounds = {}
  Object.keys(draftRounds).forEach((round) => {
    const roundMatches = {...draftRounds[round]}
    Object.keys(roundMatches).map((matchID) => {
      const match = roundMatches[matchID]
      let game1 = {...DraftGameTemplate}
      let game2 = {...DraftGameTemplate}
      game1.opponentUID = match.player2
      game1.gameID = matchID
      game1.opponentUsername = match.player2Username
      game1.matchRound = Number(round)
      game2.opponentUID = match.player1
      game2.opponentUsername = match.player1Username
      game2.gameID = matchID
      game2.matchRound = Number(round)
      if(!games[match.player1]) {
        games[match.player1] = {}
      }
      if(!games[match.player2]) {
        games[match.player2] = {}
      }
      games[match.player1][round] = game1;
      games[match.player2][round] = game2;
    })
  })

  return games;
}

export const startDraft = (gamesPerRound: number, rounds: number): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  const settings = {
    gamesPerRound: gamesPerRound,
    rounds: rounds,
    round: 1,
  }
  dispatch({type: ActionType.UPDATE_DRAFT_SETTINGS, settings: settings})
  const uid = getState().auth.uid

  firebase.database().ref(`drafts/${getState().auth.uid}/settings`).update(settings)
  .then((data) => {
    console.log('draft settings updated')
  })
  .catch((error) => console.log(error))
  // const draftRounds = buildDraftGames( rounds, getState().draft.draftMembers)
  const matches = buildDraftMatches( 3, TestDraftMemberData);
  firebase.database().ref(`drafts/${getState().auth.uid}/draftRounds`).set(matches);
  const games = buildDraftGames(matches)
  firebase.database().ref(`drafts/${getState().auth.uid}/draftGames`).set(games)

  firebase.database().ref(`drafts/${getState().auth.uid}/draftOwner`).set(uid);
  Object.keys(getState().draft.draftMembers).map((memberID) => {
    firebase.database().ref(`users/${memberID}/draftID`).set(uid)
    .then((data) => {
      console.log('ownerID set')
    })
    .catch((error) => console.log(error))
  })
}


export const cancelDraft = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  console.log('canceliing draft')
  firebase.database().ref(`users/${getState().auth.uid}/draftID`).set('')
  .then(() => dispatch({ type:ActionType.CANCEL_DRAFT }))
}

export const draftGameOver = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  const auth = getState().auth
  let newGame = {...getState().draft.currentGame}
  newGame.winner = newGame.opponentUsername;
  newGame.opponentWins = newGame.opponentWins + 1;
  newGame.life = 20
  newGame.opponentLife = 20
  newGame.gameNumber = newGame.matchNumber + 1;

  firebase.database().
  ref(`/drafts/${getState().draft.draftOwner}/draftGames/${1}/${getState().draft.settings.round}/`).set(newGame);

  let newOpponentGame = {...getState().draft.currentGame}
  newOpponentGame.winner = newGame.opponentUsername;
  newOpponentGame.opponentWins = newGame.wins;
  newOpponentGame.life = 20
  newOpponentGame.opponentLife = 20
  newOpponentGame.gameNumber = newGame.matchNumber + 1;
  newOpponentGame.opponentUID = auth.uid;
  newGame.opponentUsername = auth.username
  newGame.wins = newGame.opponentWins

  firebase.database().
  ref(`/drafts/${getState().draft.draftOwner}/draftGames/${
  getState().draft.currentGame.opponentUID}/${getState().draft.settings.round}/`).set(newOpponentGame)
  .then(() => {
    //check if all games in round are finished
    firebase.database().
      ref(`/drafts/${getState().draft.draftOwner}/draftGames/`).once('value')
      .then((data) => {
        const draftGames = data.val() as DraftGameRounds
        let roundOver = true
        Object.keys(draftGames).map((uid) => {
          if(!draftGames[uid][getState().draft.settings.round].matchOver) {
            roundOver = false;
          }
        })
        if (roundOver) {
          firebase.database().ref(`/drafts/${getState().draft.draftOwner}/settings/round`).set(getState().draft.settings.round + 1)
        }
      })
  })
  
}

export const updateScore = (minusLife: boolean): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  const life = getState().draft.currentGame.life;
  const newLife = minusLife ? life - 1 : life + 1;
  dispatch({type: ActionType.DRAFT_LIFE_UPDATE, newLife: newLife})

  //TODO: REPLACE COMMENTS WHEN NOT TESTING
  // firebase.database().
  //   ref(`/drafts/${getState().draft.draftOwner}/draftGames/${
  //   getState().auth.uid}/${getState().draft.settings.round}/life`).set(newLife);
  firebase.database().
    ref(`/drafts/${getState().draft.draftOwner}/draftGames/${1}/${getState().draft.settings.round}/life`).set(newLife);
  firebase.database().
    ref(`/drafts/${getState().draft.draftOwner}/draftGames/${
    getState().draft.currentGame.opponentUID}/${getState().draft.settings.round}/opponentLife`).set(newLife);
}




