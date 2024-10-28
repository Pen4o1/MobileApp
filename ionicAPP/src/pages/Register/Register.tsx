import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonText, IonIcon } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons'; 
import '../../components/styles/register-style.css';

const RegisterForm: React.FC = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const handleRegister = async () => {
    const registrationData = { first_name, last_name, email, password, password_confirmation: confirm_password };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(registrationData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Registration failed');
        return;
      }

      const result = await response.json(); 
      setMessage(result.message || 'Registration successful');
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent id="container" className="ion-padding">
        <IonItem>
          <IonInput
            type="text"
            value={first_name}
            onIonChange={e => setFirstName(e.detail.value!)}
            placeholder="First name"
            required
          />
        </IonItem>

        <IonItem>
          <IonInput
            type="text"
            value={last_name}
            onIonChange={e => setLastName(e.detail.value!)}
            placeholder="Last name"
            required
          />
        </IonItem> 

        <IonItem>
          <IonInput
            type="email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            placeholder="Enter email"
            required
          />
        </IonItem>

        <IonItem>
          <IonInput
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            placeholder="Enter password"
            required
          >
            <IonIcon 
              slot="end" 
              icon={showPassword ? eye : eyeOff} 
              onClick={() => setShowPassword(!showPassword)}
              aria-hidden="true"
            />
          </IonInput>
        </IonItem>

        <IonItem>
          <IonInput
            type={showConfirmPassword ? 'text' : 'password'} 
            value={confirm_password}
            onIonChange={e => setConfirmPassword(e.detail.value!)}
            placeholder="Confirm password"
            required
          >
            <IonIcon 
              slot="end" 
              icon={showConfirmPassword ? eye : eyeOff} 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-hidden="true"
            />
          </IonInput>
        </IonItem>

        <IonButton expand="block" className="signup-button" onClick={handleRegister}>
          Sign Up
        </IonButton>

        {message && (
          <IonText color="medium" className="error-message">
            <div>{message}</div>
          </IonText>
        )}

        <div className="social-login-buttons">
          <IonButton expand="block" color="primary" className="social-button">
            Continue with Facebook
          </IonButton>
          <IonButton expand="block" color="medium" className="social-button">
            Continue with Google
          </IonButton>
        </div>

        <IonText color="medium" className="have-account-link">
          <a href="#">Already have an account? Login</a>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default RegisterForm;
