import { ThunkResult, ThunkDispatchType } from "../types";
import { ActionType } from "../actionTypes";


export const showInterAd = (): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType): Promise<void> => {
    dispatch({type: ActionType.SHOW_INTER_AD});
}

export const closeInterAd = (): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType): Promise<void> => {
    dispatch({type: ActionType.CLOSE_INTER_AD});
}