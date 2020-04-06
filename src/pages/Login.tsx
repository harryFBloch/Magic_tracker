import React, { ReactElement, useState } from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import {
  IonInput,
  IonLabel,
  IonItem,
  IonPage,
  IonButton,
} from '@ionic/react';
import classes from './Login.module.css'
import { ThunkDispatchType, actions } from '../store';
import { bindActionCreators } from 'redux';

interface ReduxDispatchProps {
  login: (email: string, password: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  login: actions.auth.login
}, dispatch);

export const Login = ({history, login}: RouteComponentProps & ReduxDispatchProps): ReactElement => {

  const [loginMode, setLoginMode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')


  const handleSignUp = (): void => {
    if (password === password2) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((): void => {
        history.push('/home');
      })
    } else {
      console.log('passwords do not match')
    }
  }

  const handleLogin = (): void => {
    login(email, password)
    .then((): void => {
      history.push('/home');
    })
  }

  const renderLogin = (): ReactElement => {
    return (
      <>
        <div className={classes.centerContainer}>
        <IonLabel>
          Login or&nbsp;
          <span className={classes.linkStyle} onClick={(): void => setLoginMode(false)}>Sign up!</span>
        </IonLabel>
        </div>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput value={email} onIonChange={(event): void => setEmail(String(event.detail.value))}/>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput value={password} onIonChange={(event): void => setPassword(String(event.detail.value))} 
            type="password"/>
        </IonItem>
        <div className={`${classes.centerContainer} ${classes.topPadding}`}>
          <div>
            <IonButton onClick={handleLogin}>Log In</IonButton>
          </div>
        </div>
      </>
    )
  }

  const renderSignUp = (): ReactElement => (
    <>
      <div className={classes.centerContainer}>
      <IonLabel>
        Sign Up
      </IonLabel>
      </div>
      <IonItem>
        <IonLabel position="floating">Email</IonLabel>
        <IonInput value={email} onIonChange={(event): void => setEmail(String(event.detail.value))}/>
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Password</IonLabel>
        <IonInput value={password} onIonChange={(event): void => setPassword(String(event.detail.value))} 
          type="password"/>
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Re Enter Password</IonLabel>
        <IonInput value={password2} onIonChange={(event): void => setPassword2(String(event.detail.value))}
          type="password"/>
      </IonItem>
      <div className={`${classes.centerContainer} ${classes.topPadding}`}>
        <div>
          <IonButton onClick={handleSignUp}>Sign Up</IonButton>
        </div>
      </div>
    </>
  )

  return (
    <IonPage className={classes.pageContainer}>
      <div className={classes.formContainer}>
      {loginMode ? renderLogin() : renderSignUp()}
      </div>
    </IonPage>
  )
}

export default withRouter(connect(null, mapDispatchToProps)(Login))