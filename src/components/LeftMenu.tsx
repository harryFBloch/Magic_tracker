import React, { ReactElement, useEffect, useState } from 'react';
import { IonMenu, IonToolbar, IonHeader, IonTitle, IonContent, IonButton, IonText, IonMenuToggle, IonAlert } from '@ionic/react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RootState, Deck, ThunkDispatchType, actions } from '../store';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import QRIcon from './common/QRIcon'
import QR from './QRCode';
import classes from './LeftMenu.module.css';
import { joinDraft } from '../store/draft/actions';

interface ReduxStateProps {
  decks: Deck[],
  userLoading: boolean,
  selectedDeck: Deck,
  uid: string,
  gameStarted: boolean,
  draftOwner: string,
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  decks: state.decks.decks,
  selectedDeck: state.decks.selectedDeck,
  userLoading: state.auth.isLoading,
  uid: state.auth.uid,
  gameStarted: state.games.currentGame.gameStarted,
  draftOwner: state.draft.draftOwner
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  getDecks: () => Promise<void>;
  selectDeck: (deck: Deck) => Promise<void>;
  getUsername: () => Promise<object>;
  getGames: () => Promise<void>;
  joinDraft: () => Promise<void>;
  watchForDraft: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
 getDecks: actions.decks.getDecks,
 selectDeck: actions.decks.selectDeck,
 getUsername: actions.auth.getUsername,
 getGames: actions.games.getGames,
 joinDraft: actions.draft.joinDraft,
 watchForDraft: actions.draft.watchforDraft,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

export const LeftMenu = ({ 
  decks, getDecks, userLoading, selectedDeck, selectDeck, uid, getUsername, history, 
  gameStarted, getGames, draftOwner, watchForDraft
}: Props): ReactElement => {

  const [alertOpen, setAlertOpen] = useState(false);
  const [textToEncode, setTextToEncode] = useState("");
  const [draftAlert, setDraftAlert] = useState(false);

  useEffect((): void => {
    if (!userLoading && uid !== '') {
      getDecks()
      watchForDraft();
      getGames();
      getUsername()
      .catch((error) => {
          history.push('/username')
      })
    }
  }, [getDecks, getGames, userLoading, uid, getUsername, history, watchForDraft])

  useEffect((): void => {
    if (textToEncode) {
      setAlertOpen(true);
    } else {
      setAlertOpen(false);
    }
  }, [textToEncode])

  useEffect((): void => {
     //user joined draft send them to draftgame page and listen for changes on the draft
    console.log('conditional draft', draftOwner !== '', history.location.pathname !== '/draftgame', draftOwner)
    if ( draftOwner !== '' && history.location.pathname !== '/draftgame' && draftOwner) {
      console.log(draftOwner, 'joining draft')
      joinDraft();
      setDraftAlert(true);
    }
  }, [draftOwner])


 

  const handleQRClick = (textToEncode: string): void => {
    setTextToEncode(textToEncode);
  }

  const handleCloseAlert = (): void => {
    setTextToEncode("")
  }

  const handleSelectDeck = (deck: Deck): void => {
    selectDeck(deck);
  }

  const renderStatIcon = (isSelectedDeck: boolean): ReactElement => (
    <svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512' 
    className={`${classes.icons}`}>
      <title>ionicons-v5-q</title>
      <rect x='64' y='320' width='48' height='160' rx='8' ry='8' 
        className={`${classes.statRect} ${isSelectedDeck ? classes.selectedColor : ''}`}/>
      <rect x='288' y='224' width='48' height='256' rx='8' ry='8' 
        className={`${classes.statRect} ${isSelectedDeck ? classes.selectedColor : ''}`}/>
      <rect x='400' y='112' width='48' height='368' rx='8' ry='8' 
        className={`${classes.statRect} ${isSelectedDeck ? classes.selectedColor : ''}`}/>
      <rect x='176' y='32' width='48' height='448' rx='8' ry='8' 
        className={`${classes.statRect} ${isSelectedDeck ? classes.selectedColor : ''}`}/>
    </svg>
  )

  const renderDeck = (deck: Deck): ReactElement => {
    const isSelectedDeck = deck.id === selectedDeck.id;
    return (
      <div className={`${classes.itemContainer} ${isSelectedDeck ? classes.selectedColor : ''}`}
        onClick={() => handleSelectDeck(deck)} key={deck.id}>
        <IonText color={`${isSelectedDeck ? 'secondary' : 'primary'}`} slot="start">{deck.name}</IonText>
        <div>
          <IonMenuToggle menu="left">
            <IonButton fill='clear' className="ion-no-padding ion-no-margin" routerLink={`/deck/${deck.id}`}>
              {renderStatIcon(isSelectedDeck)}
            </IonButton>
          </IonMenuToggle>
            <IonButton fill='clear' className="ion-no-padding ion-no-margin" onClick={ () => handleQRClick(`${uid} ${deck.id}`)}>
              <QRIcon flippedColor={isSelectedDeck}/>
            </IonButton>
        </div>
      </div>
    )
  }

  return (
    <IonMenu side="start" menuId="left" contentId='main' color="secondary" disabled={gameStarted}>
      {alertOpen && <QR handleAlertClose={handleCloseAlert} textToEncode={textToEncode}/>}
      <IonHeader>
        <IonToolbar color="secondary" className={classes.toolbar}>
          <IonTitle color="primary">Your Decks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="secondary">
        <div className={classes.background}>
          {decks.map((deck): ReactElement => {
            return renderDeck(deck)
          })}
        </div>
        <IonMenuToggle menu="left">
          <IonButton className={classes.menuButton} routerLink='/add_deck'>
            Add New Deck
          </IonButton>
        </IonMenuToggle>
      </IonContent>
      <IonAlert
          isOpen={draftAlert}
          onDidDismiss={() => setDraftAlert(false)}
          cssClass='my-custom-class'
          header={'Alert Draft Found'}
          message="Would you like to rejoin the draft?"
          buttons={[{
            text: 'Join Draft',
            handler: blah => {
              history.push('/draftgame');
            }
          },
          {
            text: 'Leave Draft',
            handler: blah => {
              console.log('leave draft')
            }
          }
        ]}
        />
    </IonMenu>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftMenu))