import React, { ReactElement } from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuToggle, IonButton, IonText, IonItem } from '@ionic/react';
import { RootState, ThunkDispatchType, actions, Auth } from '../store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classes from './RightMenu.module.css';

interface ReduxStateProps {
  auth: Auth
  gameStarted: boolean,
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  auth: state.auth,
  gameStarted: state.games.currentGame.gameStarted,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  logout: () => Promise<void>
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
 logout: actions.auth.logout
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> 

export const RightMenu = ({gameStarted, logout, auth}: Props): ReactElement => {

  return (
    <IonMenu side="end" menuId="right" contentId='main' color="secondary" disabled={gameStarted}>
    <IonHeader>
      <IonToolbar color="secondary" className={classes.toolbar}>
    <IonTitle color="primary">{auth.username}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="secondary">
      <IonItem color="secondary" lines="none" className={classes.menuItem}>
        <IonText className={classes.fullWidth}>Record: 1 - 3</IonText>
      </IonItem>
      <IonMenuToggle menu="right">
        {/* <IonButton className={classes.menuButton} routerLink="/draft">
          Draft Mode
        </IonButton> */}
      </IonMenuToggle>
      <IonMenuToggle menu="right">
        {/* <IonButton className={classes.menuButton} onClick={logout}>
          Submit Feedback
        </IonButton> */}
      </IonMenuToggle>
      <IonMenuToggle menu="right">
        <IonButton className={classes.menuButton} onClick={logout}>
          Logout
        </IonButton>
      </IonMenuToggle>
    </IonContent>
  </IonMenu>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(RightMenu)