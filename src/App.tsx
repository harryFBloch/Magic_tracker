import React, { ReactElement, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonContent, setupConfig, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Provider } from 'react-redux';
import firebase, { AdMobBannerIOS } from './config/firebaseConfig';
import 'firebase/auth';

import { Plugins } from '@capacitor/core';
import { AdOptions, AdSize, AdPosition } from '@rdlabo/capacitor-admob';

import Home from './pages/Home';
import GameView from './pages/GameView';
import AddDeck from './pages/AddDeck'
import Login from './pages/Login';
import DeckStats from './pages/DeckStats';

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
import LeftMenu from './components/LeftMenu';
import Username from './pages/Username';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const { AdMob } = Plugins;

interface ComponentProps {
  children: Array<ReactElement>;
}

const App = (): ReactElement => {

  setupConfig({ swipeBackEnabled: false })

  AdMob.initialize();

  const addID = {
    ios: AdMobBannerIOS,
    android: ''
  }

  const platformAdId = isPlatform('android') ? addID.android : addID.ios;

  const options: AdOptions = {
    adId: platformAdId,
    adSize: AdSize.BANNER,
    position: AdPosition.BOTTOM_CENTER,
    margin: 0
  }

  AdMob.showBanner(options)

  AdMob.addListener('onAdLoaded', (info: boolean) => {
    console.log('banner ad loaded')
  })

  AdMob.addListener('onAdSize' , (info: boolean) => {
    console.log(info, 'here')
  })
  
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
      Plugins.SplashScreen.hide()
      console.log("\n\n\n\n\n\nIM HERE yes")
    })
  }, [])


  return (
    <Provider store={store}>
      <IonApp>
        <IonReactRouter>
          <IonContent id="main" forceOverscroll={false}>
            <LeftMenu />
            <IonRouterOutlet draggable={false}>
              <PrivateRoute component={GameView} path="/game" />
              <PrivateRoute component={Home} path="/home" />
              <PrivateRoute component={Username} path="/username"/>
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