import React, { ReactElement, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Provider } from 'react-redux';
import firebase from './config/firebaseConfig';
import 'firebase/auth';
import Home from './pages/Home';
import Login from './pages/Login';
import store, { actions } from './store';
import { PrivateRoute, PublicRoute } from './utils/routing';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

interface ComponentProps {
  children: Array<ReactElement>;
}

const App = (): ReactElement => {
  
  useEffect((): void => {
    //check auth status
    firebase.auth().onAuthStateChanged((user): void => {
      if (user) {
        actions.auth.autoLoginSuccess(user.uid)(store.dispatch, store.getState, null);
        if (window.location.pathname === '/login'){
          window.location.assign('/home')
        }
      } else {
        actions.auth.autoLoginFailed()(store.dispatch, store.getState, null);
      }
    })
  }, [])

  return (
    <Provider store={store}>
      <IonApp>
        <IonReactRouter>
          <IonContent id="content">
            <IonRouterOutlet>
              <PrivateRoute component={Home} path="/home" />
              <PublicRoute component={Login} path="/Login" />
              <Route exact path="/" render={() => <Redirect to="/home" />} />
            </IonRouterOutlet>
          </IonContent>
        </IonReactRouter>
      </IonApp>
  </Provider>
  );
};

export default App;