import React, { ReactElement, useState, useEffect } from 'react';
import { IonPage, IonText, IonButton, IonBackButton, IonLabel, IonAlert } from '@ionic/react';
import { Auth, RootState, ThunkDispatchType, DraftSettings, DraftGame, actions } from '../store';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classes from './DraftGameView.module.css';
import Loading from '../components/common/Loading';


interface ReduxStateProps {
  auth: Auth;
  draftSettings: DraftSettings;
  currentGame: DraftGame;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  auth: state.auth,
  draftSettings: state.draft.settings,
  currentGame: state.draft.currentGame
});
// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  updateScore: (minus: boolean) => Promise<void>;
  draftGameOver: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  updateScore: actions.draft.updateScore,
  draftGameOver: actions.draft.draftGameOver,
}, dispatch);


type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

export const DraftGameView = ({auth, draftSettings, currentGame, updateScore, draftGameOver}: Props): ReactElement => {

  const [gameOverAlert, setGameOverAlert] = useState(false);
  
  
  const renderDraftStats = (): ReactElement => {
    return (
      <div className={classes.outerStatContainer}>
        <div className={classes.statsContainer}>
          <div className={classes.statRow}>
            <IonText>Round: {draftSettings.round}</IonText>
            <IonText>Game: {currentGame.gameNumber}</IonText>
            <IonText>{currentGame.wins} - {currentGame.opponentWins}</IonText>
          </div>
          <div className={classes.statRow}>
            <IonText>Opponent: {currentGame.opponentUsername}</IonText>
            <IonText>Oppent Life: {currentGame.opponentLife}</IonText>
          </div>
        </div>
      </div>
    )
  }

  if (currentGame.life <= 0 && !gameOverAlert) {
    setGameOverAlert(true);
  }

  const renderGameView = (): ReactElement => {
    return (
      <IonPage className={classes.pageContainer}>
        <> 
          {renderDraftStats()}
          <div className={classes.outerContainer}>
            <div>
              <div className={classes.centerHorizontally}>
                <IonText color="secondary" className={classes.label}>
                  {auth.username}
                </IonText>
              </div>
              
              <div className={classes.scoreCircle}>{currentGame.life}</div>

              <div className={classes.scoreButtonContainer}>
                <IonButton color="secondary" className={classes.scoreButton} onClick={() => updateScore(true)}>
                  -
                </IonButton>
                <IonButton color="secondary" className={classes.scoreButton} onClick={() => updateScore(false)}>
                  +
                </IonButton>
              </div>
            </div>
          </div>
          <IonAlert
            isOpen={gameOverAlert}
            onDidDismiss={() => setGameOverAlert(false)}
            cssClass='my-custom-class'
            header={'Alert Game Over'}
            message="Sorry you lost the game"
            buttons={[{
              text: 'Whoops I made a mistake +1 life',
              handler: blah => {
                updateScore(false);
              }
            },
            {
              text: 'Next Game',
              handler: blah => {
                draftGameOver()
              }
            }
          ]}
          />
        
        </>
      </IonPage>
    )
  }

  const renderWaitingOrMatch = (): ReactElement => {
    if (currentGame.matchOver) {
      return (
        <>
          <IonText color="secondary">Waiting for next Round</IonText>
          <Loading />
        </>
      )
    } else {
      return renderGameView()
    }
  }

    return (
      <IonPage className={classes.pageContainer}>
        {currentGame.gameID === '' && <Loading/>}
        {currentGame.gameID !== '' && renderWaitingOrMatch()}
      </IonPage>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftGameView)