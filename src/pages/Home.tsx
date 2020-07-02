import React, { ReactElement } from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import { IonPage, IonButton } from '@ionic/react';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../config/firebaseConfig';
import { RootState, Deck, ThunkDispatchType, actions } from '../store';
import Toolbar from '../components/common/Toolbar';
import './Home.css';

interface ReduxStateProps {
  userLoading: boolean,
  selectedDeck: Deck,
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  userLoading: state.auth.isLoading,
  selectedDeck: state.decks.selectedDeck
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  getDeckFromFirebase: (userID: string, deckID: string) => Promise<void>;
  startGame: (justPlay?: boolean) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
 getDeckFromFirebase: actions.games.getDeckFromFirebase,
 startGame: actions.games.startGame,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

const Home = ({ selectedDeck, getDeckFromFirebase, history, startGame}: Props): ReactElement => {

  const scannerOptions: BarcodeScannerOptions = {
    showTorchButton: true,
    showFlipCameraButton: true
  }

  const openScanner = async () => {
    BarcodeScanner.scan(scannerOptions)
    .then((data): void => {
      console.log(`Barcode data: ${data.text}`);
      let params = data.text.split(' ');
      console.log(params, "params");
      if (params[1]) {
        getDeckFromFirebase(params[0], params[1])
        .then(() => {
        startGame();
        history.push('/game')
      })
      }
    })
    .catch((error) => {
      console.log(error)
    })
  };

  const handleLogout = () => {
    firebase.auth().signOut()
  }

  const renderLogoutButton = () => {
    return (
      <IonButton onClick={handleLogout}>Logout</IonButton>
    )
  }
  
  return (
    <IonPage>
      <Toolbar rightButtons={renderLogoutButton()}/>
      <div className="game-container button-page-container">
        <div className="button-container">
          <p className="home-text">Selected Deck: {selectedDeck.name}</p>
          <IonButton className="start-game-button" color="secondary" onClick={openScanner}>
            Scan Deck
          </IonButton>
          <IonButton className="start-game-button" color="secondary" routerLink="/game" onClick={() => startGame(true)}>
            Just Play
          </IonButton>
        </div>
      </div>      
    </IonPage>
  );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
