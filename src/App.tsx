import React, { ReactElement, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonContent, setupConfig, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Provider } from 'react-redux';
import firebase from './config/firebaseConfig';
import 'firebase/auth';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Plugins } from '@capacitor/core';

import Home from './pages/Home';
import GameView from './pages/GameView';
import AddDeck from './pages/AddDeck'
import Login from './pages/Login';
import DeckStats from './pages/DeckStats';
import Onboarding from './pages/Onboarding';
import AdMobContainer from './components/common/AdMobContainer';
import InterAd from './components/common/InterAd';
import RightMenu from './components/RightMenu'
import LeftMenu from './components/LeftMenu';
import Username from './pages/Username';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Draft from './pages/Draft';
import DraftGameView from './pages/DraftGameView';

import store, { actions } from './store';
import { PrivateRoute, PublicRoute } from './utils/routing';
import './App.css'


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

  setupConfig({ swipeBackEnabled: false })

  if (isPlatform('mobile')){
    //lock app screen orientation
    ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT);
  }
 
  
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
      Plugins.SplashScreen.hide();
    })
  }, [])


  return (
    <Provider store={store}>
      <IonApp>
        <IonReactRouter>
          <IonContent id="main" forceOverscroll={false}>
          <AdMobContainer />
          <InterAd/>
            <LeftMenu />
            <RightMenu />
            <IonRouterOutlet draggable={false}>
              <PrivateRoute component={DraftGameView} path="/draftgame"/>
              <PrivateRoute component={Draft} path="/draft"/>
              <PrivateRoute component={GameView} path="/game" />
              <PrivateRoute component={Home} path="/home" />
              <PrivateRoute component={Username} path="/username"/>
              <PrivateRoute component={Onboarding} path="/onboarding"/>
              <PrivateRoute component={AddDeck} path="/add_deck" />
              <PrivateRoute component={DeckStats} path="/deck/:deckID" />
              <PublicRoute component={Login} path="/Login" />
              <PublicRoute component={Privacy} path="/privacy"/>
              <PublicRoute component={Terms} path="/terms"/>
              <Route exact path="/" render={() => <Redirect to="/home" />} />
            </IonRouterOutlet>
          </IonContent>
        </IonReactRouter>
       </IonApp>
    </Provider>
  );
};

export default App;