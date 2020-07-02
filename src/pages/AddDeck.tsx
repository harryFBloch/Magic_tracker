import React, { ReactElement, useState } from 'react';
import { IonPage, IonItem, IonInput, IonContent, IonTextarea, IonButton } from '@ionic/react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatchType, actions, RootState } from '../store';
import { Deck } from '../store/decks/types';
import Toolbar from '../components/common/Toolbar';
import { deckTemplate } from '../store/decks/types';
import classes from './AddDeck.module.css';


interface ReduxStateProps {
  decks: Deck[]
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  decks: state.decks.decks
});
// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  addNewDeck: (deck: Deck) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
 addNewDeck: actions.decks.addDeck
}, dispatch);


type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>


export const AddDeck = ({ addNewDeck, decks }: Props): ReactElement => {

  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckNotes, setDeckNotes] = useState("");

  const handleChange = (setAttribute: (newValue: string) => void, value: string) => {
    setAttribute(value)
    console.log(decks)
  }

  const handleAddNewDeck = (): void => {
    const newDeck: Deck = {name: deckName, 
      description: deckDesc, notes: deckNotes, wins: 0, losses: 0, id: decks.length, gameHistory: []};
    addNewDeck(newDeck)
    setDeckName('');
    setDeckDesc('');
    setDeckNotes('');
  }

  return (
    <IonPage>
      <Toolbar back={true} blank={decks.length === 0 ? true : false}/>
      <IonContent color="secondary">
        <div className={classes.title}>Add A New Deck</div>
        <IonItem color="secondary" lines="none" className={classes.inputContainer}>
          <IonInput placeholder="Deck Name" color="primary" value={deckName} onIonChange={(event) => {
            handleChange(setDeckName, String(event.detail.value))
          }}/>
        </IonItem>
        <IonItem color="secondary" lines="none" className={classes.inputContainer}>
          <IonInput placeholder="Description" color="primary" value={deckDesc} onIonChange={(event) => {
            handleChange(setDeckDesc, String(event.detail.value))
          }}/>
        </IonItem>
        <IonItem color="secondary" lines="none" className={classes.inputContainer}>
          <IonTextarea placeholder="Notes" color="primary" cols={4}  value={deckNotes} onIonChange={(event) => {
            handleChange(setDeckNotes, String(event.detail.value))
          }}/>
        </IonItem>
        <div className={classes.buttonContainer}>
          <IonButton className={classes.button} onClick={handleAddNewDeck} routerLink="/home">
            Save Deck
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDeck)