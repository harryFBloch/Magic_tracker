import React, { ReactElement } from 'react';
import classes from './Privacy.module.css';
import { IonPage, IonContent } from '@ionic/react';
import Toolbar from '../components/common/Toolbar';

export const Terms = (): ReactElement => {
  return (
    <IonPage>
      <Toolbar back/>
      <IonContent>
      <h2>Harry Bloch Terms of Service</h2>
      <h3>1. Terms</h3>
      <p>By accessing our app, Magic Tracker, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing Magic Tracker. The materials contained in Magic Tracker are protected by applicable copyright and trademark law.</p>
      <h3>2. Use License</h3>
      <ol type="a">
        <li>Permission is granted to temporarily download one copy of Magic Tracker per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      <ol type="i">
       <li>modify or copy the materials;</li>
       <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
       <li>attempt to decompile or reverse engineer any software contained in Magic Tracker;</li>
       <li>remove any copyright or other proprietary notations from the materials; or</li>
       <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
    </ol>
      </li>
      <li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Harry Bloch at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</li>
    </ol>
    <h3>3. Disclaimer</h3>
    <ol type="a">
      <li>The materials within Magic Tracker are provided on an 'as is' basis. Harry Bloch makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</li>
      <li>Further, Harry Bloch does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to Magic Tracker.</li>
    </ol>
    <h3>4. Limitations</h3>
    <p>In no event shall Harry Bloch or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Magic Tracker, even if Harry Bloch or a Harry Bloch authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
    <h3>5. Accuracy of materials</h3>
    <p>The materials appearing in Magic Tracker could include technical, typographical, or photographic errors. Harry Bloch does not warrant that any of the materials on Magic Tracker are accurate, complete or current. Harry Bloch may make changes to the materials contained in Magic Tracker at any time without notice. However Harry Bloch does not make any commitment to update the materials.</p>
    <h3>6. Links</h3>
    <p>Harry Bloch has not reviewed all of the sites linked to its app and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Harry Bloch of the site. Use of any such linked website is at the user's own risk.</p>
    <h3>7. Modifications</h3>
    <p>Harry Bloch may revise these terms of service for its app at any time without notice. By using Magic Tracker you are agreeing to be bound by the then current version of these terms of service.</p>
    <h3>8. Governing Law</h3>
    <p>These terms and conditions are governed by and construed in accordance with the laws of NY and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
      </IonContent>
    
    </IonPage>
  )
}

export default Terms