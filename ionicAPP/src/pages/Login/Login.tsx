import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonText, IonGrid, IonRow, IonCol } from '@ionic/react';
import '../../components/styles/login-style.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="login-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonItem>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    placeholder="Enter your email"
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    placeholder="Enter your password"
                    required
                  />
                </IonItem>

                <IonText color="medium" className="forgot-password-link">
                  <a href="/forgot-password">Forgot Password?</a>
                </IonText>

                <IonButton expand="block" className="login-button">
                  Login
                </IonButton>

                <IonButton expand="block" fill="outline" className="register-button">
                  <a href="/register">Create New Account</a>
                </IonButton>

                <div className="social-login-buttons">
                  <IonButton expand="block" color="primary" className="social-button">
                    Continue with Facebook
                  </IonButton>
                  <IonButton expand="block" color="medium" className="social-button">
                    Continue with Google
                  </IonButton>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;