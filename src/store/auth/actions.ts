import { ThunkResult, ThunkDispatchType } from '../types';
import { ActionType } from '../actionTypes';
import firebase from '../../config/firebaseConfig';
import store from '..'

// const firebaseApp = firebase.initializeApp(firebaseConfig)

export const login = (email: string, password: string): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType ): Promise<void> => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
  .then((data) => {
    if (data.user) {
      dispatch({type: ActionType.LOGIN_SUCCESSFUL, uid: data.user.uid})
    }
  })
  .catch((error): void => console.log("Error", error))
};

export const autoLoginSuccess = (uid: string): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  dispatch({type: ActionType.LOGIN_SUCCESSFUL, uid: uid});
}

export const autoLoginFailed = (): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType): Promise<void> => {
  dispatch({type: ActionType.AUTO_LOGIN_FAILED});
}