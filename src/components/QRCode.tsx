import React, { ReactElement } from 'react';
import classes from './QRCode.module.css';
import { IonButton } from '@ionic/react';
import QRCode from 'qrcode.react';

interface Props {
  textToEncode: string;
  handleAlertClose: () => void;
}

export const QR = ({ textToEncode, handleAlertClose}: Props): ReactElement => {

  return (
    <div className={classes.alertContainer}>
      <div className={classes.qrContainer}>
        <QRCode className={classes.qr} value={textToEncode} />
        <div>
          <IonButton onClick={handleAlertClose} className={classes.closeButton}>Close</IonButton>
        </div>
      </div>
    </div>
  )
}

export default QR