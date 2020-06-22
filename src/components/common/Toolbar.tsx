import React, { ReactElement } from 'react';
import { IonToolbar, IonHeader, IonButtons, IonMenuButton, IonButton} from '@ionic/react';
import classes from './Toolbar.module.css';
import { ICONS }from '../../icons';
import RenderSVG from './RenderSVG';

interface Props {
  back?: boolean;
  blank? : boolean;
  rightButtons?: ReactElement;
}

export const Toolbar = ( { back = false, blank = false, rightButtons }: Props): ReactElement => {

  return (
    <IonHeader>
      <IonToolbar color="secondary">
        {!blank && 
          <IonButtons slot="start">
            {back && 
              <IonButton routerLink="/home" className="ion-no-margin ion-no-padding">
                <RenderSVG icon={ICONS.BACK_ARROW} height={"32"}/>
              </IonButton>
            }
            {!back && 
              <IonMenuButton autoHide={false} menu="left" className={classes.menuButton}>
              <svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512' className={classes.iconColor}>
                <title>ionicons-v5-j</title><line x1='80' y1='160' x2='432' y2='160' style={{strokeLinecap: 'round', strokeMiterlimit: 10, strokeWidth: '32px'}}/>
                <line x1='80' y1='256' x2='432' y2='256' style={{strokeLinecap: 'round', strokeMiterlimit: 10, strokeWidth: '32px'}}/>
                <line x1='80' y1='352' x2='432' y2='352' style={{strokeLinecap: 'round', strokeMiterlimit: 10, strokeWidth: '32px'}}/>
              </svg>
              </IonMenuButton>
            }
          </IonButtons>
        }
        {rightButtons && 
          <IonButtons slot="end">
            {rightButtons}
          </IonButtons>
        }
      </IonToolbar>
    </IonHeader>
  );
};

export default Toolbar;