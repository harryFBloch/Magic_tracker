import React, { ReactElement, useState } from 'react';
import { ThunkDispatchType, actions } from '../store';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  IonInput,
  IonLabel,
  IonItem,
  IonPage,
  IonButton,
} from '@ionic/react';
import classes from './Login.module.css';
import { RouteComponentProps } from 'react-router-dom';


interface ReduxDispatchProps {
  registerUsername: (username: string) => Promise<void>
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  registerUsername: actions.auth.registerUsername
}, dispatch);

type Props = ReduxDispatchProps & RouteComponentProps

export const Username = ({ registerUsername, history }: Props): ReactElement => {

  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmitUsername = (): void => {
    registerUsername(username)
    .then(() => {
      history.push('/onboarding')
    })
    .catch((error) => {
      console.log('handlesubmit username', error);
      setErrorMessage('That username already exists!');
    })
  }

  return (
    <IonPage className={classes.pageContainer}>
      <div className={`${classes.formContainer} ${classes.verticalCenter}`}>
          <IonItem>
            <IonLabel position="floating">Enter A Username</IonLabel>
            <IonInput value={username} onIonChange={(event) => setUsername(String(event.detail.value))} autoCapitalize="words"/>
          </IonItem>
        <div className={`${classes.centerContainer} ${classes.topPadding}`}>
          <div>
            <IonButton onClick={handleSubmitUsername}>Submit</IonButton>
          </div>
          </div>
          <h5 className={classes.errorNote}> {errorMessage}</h5>
      </div>
    </IonPage>
  )
}

export default connect(null, mapDispatchToProps)(Username)