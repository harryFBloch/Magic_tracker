import React, { ReactElement, useState } from 'react';
import { IonPage, IonItem, IonInput, IonContent, IonTextarea, IonButton } from '@ionic/react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatchType, actions } from '../store';
import { Deck } from '../store/decks/types';
import Toolbar from '../components/common/Toolbar';
import { deckTemplate } from '../store/decks/types';
import classes from './AddDeck.module.css';


// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  addNewDeck: (deck: Deck) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
 addNewDeck: actions.decks.addDeck
}, dispatch);



type Props = ReturnType<typeof mapDispatchToProps>


export const AddDeck = ({ addNewDeck }: Props): ReactElement => {

  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckNotes, setDeckNotes] = useState("");

  const handleChange = (setAttribute: (newValue: string) => void, value: string) => {
    setAttribute(value)
  }

  const handleAddNewDeck = (): void => {
    const newDeck = deckTemplate;
    newDeck.name = deckName;
    newDeck.description = deckDesc;
    newDeck.notes = deckDesc;
    addNewDeck(newDeck)
  }

  return (
    <IonPage>
      <Toolbar back={true}/>
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

export default connect(null, mapDispatchToProps)(AddDeck)