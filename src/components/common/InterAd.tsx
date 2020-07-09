import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { isPlatform } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { AdOptions } from '@rdlabo/capacitor-admob';
import {  AdMobIntersitionalIOS } from '../../config/firebaseConfig';
import { RootState, ThunkDispatchType, actions } from '../../store';
import { bindActionCreators } from 'redux';

const { AdMob } = Plugins;

interface ReduxStateProps {
  uid: string;
  showInterAd: boolean;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  uid: state.auth.uid,
  showInterAd: state.flags.showInterAd,
});

interface ReduxDispatchProps {
  closeInterAd: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  closeInterAd: actions.flags.closeInterAd
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const AdMobContainer = ({ uid, closeInterAd, showInterAd}: Props): ReactElement => {

  

  const addID = {
    ios: AdMobIntersitionalIOS, 
    android: '',
  }

  const platformID = isPlatform('android') ? addID.android : addID.ios;

  const options: AdOptions = {
    adId: platformID,
  }

  useEffect(() => {
    AdMob.initialize();
    AdMob.prepareInterstitial(options)
  }, [options, closeInterAd])

  

  if (showInterAd) {
    AdMob.showInterstitial(options)
    setTimeout(() => {
      closeInterAd()
    }, 6000)
  } 

  return (<></>)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdMobContainer)