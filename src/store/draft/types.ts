import { ActionType } from '../actionTypes';

export type DraftMember = {[key: string]: {username: string}}


export const TestDraftMemberData = {
  '1': {username: '1'},
  '2': {username: '2'},
  '3': {username: '3'},
  '4': {username: '4'},
  '5': {username: '5'},
  '6': {username: '6'},
  '7': {username: '7'},
  '8': {username: '8'},
}

export type DraftSettings = {
  gamesPerRound: number;
  rounds: number;
  round: number;
}

export const DraftSettingsTemplate = {
  gamesPerRound: 3,
  rounds: 3,
  round: 0,
}

export interface DraftGame {
  winner: string;
  wins: number;
  life: number;
  opponentLife: number;
  opponentUsername: string;
  opponentUID: string;
  gameNumber: number;
  opponentWins: number;
  matchNumber: number;
  matchOver: boolean;
  matchRound: number,
  gameID: string,
};

export const DraftGameTemplate: DraftGame = {
  wins: 0,
  winner: '',
  life: 20,
  opponentLife: 20,
  opponentUsername: '',
  gameNumber: 1,
  opponentUID: "",
  opponentWins: 0,
  matchNumber: 1,
  matchOver: false,
  matchRound: 0,
  gameID: '',
}

export type DraftGames = {[round: string]: DraftGame}

export type DraftGameRounds = {[uid: string]: DraftGames}

export type Match = {player1: string; player2: string, player1Username: string, player2Username: string}

export type DraftMatch = {[gameID: string]: Match}

export type DraftRounds = {[round: string]: DraftMatch}

export interface Draft {
  drafting: boolean;
  draftMembers: DraftMember;
  draftOwner: string;
  settings: DraftSettings;
  draftRounds: DraftRounds;
  draftGames: DraftGameRounds;
  currentGame: DraftGame;
}

export const DraftTemplate: Draft = {
  drafting: true,
  draftMembers: {},
  draftOwner: '',
  settings: DraftSettingsTemplate,
  draftRounds: {},
  draftGames: {},
  currentGame: {...DraftGameTemplate},
}


export type DraftAction = 
  { type: ActionType.START_DRAFT, draft: Draft } | 
  { type: ActionType.UPDATE_DRAFT_ROUNDS, draftRounds: DraftRounds} |
  { type: ActionType.UPDATE_DRAFT_OWNER, ownerID: string} |
  { type: ActionType.CANCEL_DRAFT} | 
  { type : ActionType.UPDATE_DRAFT_GAMES, games: DraftGameRounds, currentGame: DraftGame} |
  { type: ActionType.UPDATE_DRAFT_SETTINGS, settings: DraftSettings} |
  {type: ActionType.DRAFT_LIFE_UPDATE, newLife: number} |
  { type: ActionType.UPDATE_CURRENT_GAME, game: DraftGame}
