import React, { ReactElement } from 'react';
import { IonPage, IonSlides, IonSlide, IonButton, IonContent } from '@ionic/react';
import classses from './Onboarding.module.css';
import Slide1 from './onboarding/slide1.png';
import Slide2 from './onboarding/slide2.png';
import Slide3 from './onboarding/slide3.png';


export const Onboarding = (): ReactElement => {

  return (
    <IonPage>
      <IonContent>
      <IonSlides pager>
        <IonSlide className={classses.slide}>
          <img className={classses.screenshot} alt="slide1" src={Slide1}/>
        </IonSlide>
        <IonSlide className={classses.slide}>
          <img className={classses.screenshot} alt="slide1" src={Slide2}/>
        </IonSlide>
        <IonSlide className={classses.slide}>
          <img className={classses.screenshot} alt="slide1" src={Slide3}/>
          <IonButton size="large" className={classses.button} routerLink="/add_deck">Add First Deck</IonButton>
        </IonSlide>
      </IonSlides>
      </IonContent>
    </IonPage>
  )
}

export default Onboarding;