import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonText } from '@ionic/react';
import '../../components/login-style.css'; 

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

      <IonContent className="ion-padding login-content">
        <IonItem>
          <IonInput 
            type="email" 
            value={email} 
            onIonChange={e => setEmail(e.detail.value!)} 
            placeholder="Enter your email" 
            required 
          />
        </IonItem>

        <IonItem>
          <IonInput 
            type="password" 
            value={password} 
            onIonChange={e => setPassword(e.detail.value!)} 
            placeholder="Enter your password" 
            required 
          />
        </IonItem>

        <IonText color="medium" className="forgot-password-link">
          <a href="/forgot-password">Forgot Password?</a>
        </IonText>

        <IonButton expand="block" className="login-button" onClick={() => console.log("Login Attempt")}>
          Login
        </IonButton>

        <div className="or-separator">
          <span>OR</span>
        </div>

        <IonButton expand="block" fill="outline" className="register-button">
        <a href="/Register">Create New Account</a>
        </IonButton>

        <div className="social-login-buttons">
          <IonButton expand="block" color="primary" className="social-button">
            Continue with Facebook
          </IonButton>
          <IonButton expand="block" color="medium" className="social-button">
            Continue with Google
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;