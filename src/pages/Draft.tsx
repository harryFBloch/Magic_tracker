import React, { ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { IonPage, IonButton, IonContent, IonList, IonItem, IonLabel, IonToast } from '@ionic/react';
import { RootState, ThunkDispatchType, Auth, actions, Draft, DraftMember } from '../store';
import { bindActionCreators } from 'redux';
import classes from './Draft.module.css';
import QR from '../components/QRCode';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner';
import RenderSVG from '../components/common/RenderSVG';
import { ICONS } from '../icons';
import Toolbar from '../components/common/Toolbar';
import { RouteChildrenProps } from 'react-router-dom';


interface ReduxStateProps {
  auth: Auth;
  draft: Draft;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  auth: state.auth,
  draft: state.draft,
});
// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  startDraftSetup: () => Promise<void>;
  addUserToDraft: (uid: string, usrname: string) => Promise<void>;
  removeMember: (uid: string) => void;
  startDraft: (gamesPerRound: number, rounds: number) => Promise<void>;
  cancelDraft: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  startDraftSetup: actions.draft.startDraftSetup,
  addUserToDraft: actions.draft.addUserToDraft,
  removeMember: actions.draft.removeDraftMember,
  startDraft: actions.draft.startDraft,
  cancelDraft: actions.draft.cancelDraft,
}, dispatch);


type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & RouteChildrenProps


export const DraftContainer = ({
   auth, startDraftSetup, addUserToDraft, draft, removeMember, startDraft, history, cancelDraft 
  }: Props): ReactElement => {

  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState('');
  const [gamesPerRound, setGamesPerRound] = useState(3);
  const [rounds, setRounds] = useState(3);
  const [setup, setSetup] = useState(false);

  const scannerOptions: BarcodeScannerOptions = {
    showTorchButton: true,
    showFlipCameraButton: true
  }

  const updateGamesPerRound = (up: boolean) => {
    if(gamesPerRound === 1 && !up) {
      setError('Cannont play less than 1 game per round')
    } else {
      up ? setGamesPerRound(gamesPerRound + 1) : setGamesPerRound(gamesPerRound - 1)
    }
  }

  const updateRounds = (up: boolean) => {
    if(rounds === 1 && !up) {
      setError('Cannont play less than 1 round')
    } else {
      up ? setRounds(rounds + 1) : setRounds(rounds - 1)
    }
  }

  const openScanner = async () => {
    BarcodeScanner.scan(scannerOptions)
    .then((data): void => {
      console.log(`Barcode data: ${data.text}`);
      //check if uid is valid if it is add user to draft
      const memberData = data.text.split('MTGTRACKERDRAFT');
      if (memberData.length === 2) {
        addUserToDraft(memberData[0], memberData[1])
      } else {
        setError('Invalid QR Code')
      }
    })
    .catch((error) => {
      console.log(error)
    })
  };

  const handleStartDraftSetup = (): void => {
    setSetup(true);
    startDraftSetup();
  }

  const handleStartDraft = (): void => {
    startDraft(gamesPerRound, rounds)
    .then(() => history.push('/draftgame'))
  }

  const renderStartDraft = (): ReactElement => {
    return (
      <div className={classes.buttonContainer}>
          {!showQR && 
          <div className={classes.innerContainer}>
            <IonButton className={classes.fullWidth} color="secondary" onClick={handleStartDraftSetup}>
              Start Draft
            </IonButton>
            <IonButton className={classes.fullWidth} color="secondary" onClick={() => setShowQR(true)}>
              Join Draft
            </IonButton>
          </div>}

          {showQR && 
          <QR textToEncode={`${auth.uid}MTGTRACKERDRAFT${auth.username}`} handleAlertClose={() => setShowQR(false)}/>}
      </div> 
    )
  }

  const renderDraftingSetup = (): ReactElement => {
    return (
      <>
      <div className={classes.buttonContainer}>
        <div className={classes.innerContainer}>
        
        <>
          <IonContent color="primary" className={classes.memberListContainer}>
              {Object.keys(draft.draftMembers).map((memberKey) => 
              <div className={classes.memberContainer} key={memberKey}>
                <IonLabel color="secondary" className={classes.memberLabel}>
                  {draft.draftMembers[memberKey].username}
                </IonLabel>
                {auth.uid !== memberKey &&
                  <IonButton onClick={() => removeMember(memberKey)}>
                    <RenderSVG icon={ICONS.TRASH} height="25px"/>
                  </IonButton>}
              </div>)}
          </IonContent>

          <div className={classes.settingContainer}>
            <IonLabel color="secondary" className={classes.settingLabel}>Games per round:</IonLabel>
            <div className={classes.centerVertical}>
              <IonButton size="small" color="secondary" onClick={() => updateGamesPerRound(false)}>
                -
              </IonButton>
                <IonLabel color="secondary" className={classes.settingLabel}>{gamesPerRound}</IonLabel>
              <IonButton size="small" color="secondary" onClick={() => updateGamesPerRound(true)}>
                +
              </IonButton>
            </div>
          </div>

          <div className={classes.settingContainer}>
            <IonLabel color="secondary" className={classes.settingLabel}>Rounds:</IonLabel>

            <div className={classes.centerVertical}>
              <IonButton size="small" color="secondary" onClick={() => updateRounds(false)}>
                -
              </IonButton>
                <IonLabel color="secondary" className={classes.settingLabel}>{rounds}</IonLabel>
              <IonButton size="small" color="secondary" onClick={() => updateRounds(true)}>
                +
              </IonButton>
            </div>
          </div>

          <IonButton onClick={openScanner} color="secondary" className={classes.fullWidth}>
            Add Draft Member
          </IonButton>
          <div>
            <IonButton onClick={handleStartDraft} color="secondary" className={classes.fullWidth}>
              Start Draft
            </IonButton>
          </div>
        </>
        </div>
      </div>
      </>
    )
  }

  return  (
    <IonPage>
        <>
          <Toolbar blank rightButtons={
            <IonButton routerLink="/home" onClick={cancelDraft}>
              Cancel
            </IonButton>
          }/>
          <div className={classes.pageContainer}>
            {!setup ? renderStartDraft() : renderDraftingSetup()}
            <IonToast
            isOpen={error !== ''}
            onDidDismiss={() => setError('')}
            message={error}
            duration={200}
            color="danger"
            position="middle"
          />
          </div>
        </>
    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftContainer)