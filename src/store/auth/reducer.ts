import { ActionType } from "../actionTypes";
import { Auth } from "./types";
import { RootAction } from "..";

const initialState: Auth = {
  uid: "",
  isLoading: true,
};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

  
    case (ActionType.LOGIN_SUCCESSFUL):
      return {isLoading: false, uid: action.uid}

    case (ActionType.AUTO_LOGIN_FAILED):
      return {...state, isLoading: false, uid: ''}
    default:
      return state;
  }
}