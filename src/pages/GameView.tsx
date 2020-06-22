import React, { ReactElement, useState } from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import { IonPage, IonButton, IonAlert } from '@ionic/react';
import { connect } from 'react-redux';
import { RootState, Game, ThunkDispatchType, actions } from '../store';
import Toolbar from '../components/common/Toolbar';
import Player from '../components/Player';
import RenderSVG from '../components/common/RenderSVG';
import { ICONS } from '../icons';
import './Home.css';
import { bindActionCreators } from 'redux';

interface ReduxStateProps {
  currentGame: Game,
  username: string,
  gameOverAlert: boolean
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  currentGame: state.games.currentGame,
  username: state.auth.username,
  gameOverAlert: state.games.gameOverAlert,
});

interface ReduxDispatchProps {
  getDeckFromFirebase: (userID: string, deckID: string) => Promise<void>;
  endGame: (win: boolean) => Promise<void>;
  setScore: (opponent: boolean, newScore: number) => Promise<void>;
  gameOverReset: () => Promise<void>;
  gameRematch: () => Promise<void>;
  gameAlertToggle: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  getDeckFromFirebase: actions.games.getDeckFromFirebase,
  endGame: actions.games.gameOver,
  setScore: actions.games.setScore,
  gameOverReset: actions.games.gameOverReset,
  gameRematch: actions.games.rematch,
  gameAlertToggle: actions.games.gameOverAlertToggle
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

export const GameView = (
  { currentGame, username, endGame, setScore, history, gameOverReset, gameRematch, gameOverAlert, gameAlertToggle }: 
    Props): ReactElement => {

  const [gameSurrenderAlert, setGameSurrenderAlert] = useState(false);

  const handleEndGameSurrender = (): void => {
    setGameSurrenderAlert(true);
  }

  const handleSurrenderGameOver = (win: boolean): void => {
    history.push('/home');
    endGame(win);
  }

  const handleGameOver = (win: boolean): void => {
    gameAlertToggle();
    endGame(win);
  }

  const handleRematch = (): void => {
    gameRematch()
  }

  const handleCancelGame = (): void => {
    history.push('/home')
    gameOverReset()
  }

  const renderRightButton = (): ReactElement => {

    return (
      <IonButton onClick={handleEndGameSurrender}>
        <RenderSVG icon={ICONS.SKULL} className="skull-icon"/>
      </IonButton>
    )
  }

  const renderGameOverAlert = (): ReactElement => {
    return (
      <>
        <IonAlert
        isOpen={gameOverAlert}
        onDidDismiss={gameAlertToggle}
        header={'GameOver'}
        message={`${currentGame.win ? username : currentGame.opponentUsername} Wins!`}
        buttons={[{
          text: 'OK',
          cssClass: 'secondary',
          handler: (): void => {
            gameOverReset();
            history.push('/home')
          }
        }, {
          text: 'Rematch',
          cssClass: 'secondary',
          handler: handleRematch
        }]}
      />
        <IonAlert
        isOpen={gameSurrenderAlert}
        onDidDismiss={() => setGameSurrenderAlert(false)}
        header={'Surrender?'}
        message={`What player is surrendering?`}
        buttons={[{
          text: `${username}`,
          cssClass: 'secondary',
          handler: () => handleSurrenderGameOver(false)
        }, {
          text: `${oponentUsername}`,
          cssClass: 'secondary',
          handler: () => handleSurrenderGameOver(true)
        }, {
          text: `Cancel`,
          cssClass: 'secondary',
        }, {
          text: `No Winner`,
          cssClass: 'secondary',
          handler: handleCancelGame
        }]}
      />
    </>

    )
  }

  const oponentUsername = currentGame.opponentUsername !== '' ? currentGame.opponentUsername : "Player2";

  return (
    <IonPage>
      <Toolbar blank rightButtons={renderRightButton()}/>
        <div className="game-container">
          {/* opponent */}
          <Player playerName={oponentUsername} opponent score={currentGame.opponentScore} setScore={setScore}
            handleGameOver={handleGameOver} />
          <hr className="break"/>
          {/* user */}
          <Player playerName={username} score={currentGame.myScore} setScore={setScore} 
            handleGameOver={handleGameOver} />
        </div>
        {renderGameOverAlert()}
    </IonPage>
  );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameView));
