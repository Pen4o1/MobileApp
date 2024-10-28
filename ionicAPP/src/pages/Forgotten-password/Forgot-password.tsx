import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonText } from '@ionic/react';
import '../../components/styles/login-style.css'; 

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Forgot Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonText className='ion-padding login-item'>
        <h3>Where to send the reset password link</h3>
      </IonText>
      <IonContent className="ion-padding login-content">
            <IonItem className="input-box">
                <IonInput label="Enter your email" labelPlacement="floating" fill="outline" ></IonInput>
            </IonItem>
        </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;