import React, { ReactElement } from 'react';
import { IonToolbar, IonHeader, IonTitle, IonButtons, IonIcon, IonMenuButton } from '@ionic/react';

export const Toolbar = (): ReactElement => {
  
  return (
    <IonHeader>
      <IonToolbar>
      <IonButtons slot="start">
        <IonMenuButton autoHide={false} menu="left">
          <IonIcon slot="icon-only" name="menu" />
        </IonMenuButton>
      </IonButtons>
        <IonTitle>Lets Eat</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Toolbar;