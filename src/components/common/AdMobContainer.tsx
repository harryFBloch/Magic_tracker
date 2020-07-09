import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { isPlatform } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { AdOptions, AdSize, AdPosition } from '@rdlabo/capacitor-admob';
import { AdMobBannerIOS, AdMobIntersitionalIOS } from '../../config/firebaseConfig';
import { RootState, ThunkDispatchType, actions } from '../../store';
import { bindActionCreators } from 'redux';

const { AdMob } = Plugins;

interface ReduxStateProps {
  uid: string;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  uid: state.auth.uid,
});

interface ReduxDispatchProps {
  closeInterAd: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  closeInterAd: actions.flags.closeInterAd
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const AdMobContainer = ({ uid}: Props): ReactElement => {

  AdMob.initialize();

  const addID = {
    ios: AdMobBannerIOS,
    iosInter: AdMobIntersitionalIOS, 
    android: '',
    andridInter: '',
  }

  const platformAdIdBanner = isPlatform('android') ? addID.android : addID.ios;

  const bannerOptions: AdOptions = {
    adId: platformAdIdBanner,
    adSize: AdSize.FLUID,
    position: AdPosition.BOTTOM_CENTER,
    margin: 0,
  }

  if (uid) {

    AdMob.showBanner(bannerOptions)

  } 

  return (<></>)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdMobContainer)