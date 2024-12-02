import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonText, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { eye, eyeOff, arrowForwardCircle } from 'ionicons/icons';

interface FirstStageProps {
  handleSubmit: () => void;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
  };
  updateFormData: (field: string, value: string) => void;
}

const FirstStage: React.FC<FirstStageProps> = ({ handleSubmit, formData, updateFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isFormValid = () => {
    return (
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirm_password &&
      formData.password === formData.confirm_password
    );
  };

  const handleNextClick = () => {
    if (!isFormValid()) {
      setMessage('Please fill out all fields correctly.');
      return;
    }
    setMessage(null);
    handleSubmit();
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      console.log(response);

      if (response?.credential) {
        const token = response.credential;

        // Call the backend with the token to get user information
        const userInfo = await fetchUserInfoFromBackend(token);

        if (userInfo) {
          // Populate form with user data returned from the backend
          updateFormData('first_name', userInfo.first_name);
          updateFormData('last_name', userInfo.last_name || '');  // Ensure last name is empty if not provided
          updateFormData('email', userInfo.email);

          // Optionally call handleSubmit if you want to submit immediately
          handleSubmit(); // Call handleSubmit after populating the form
        }
      } else {
        setMessage('Google login failed. No token received.');
      }
    } catch (error) {
      console.error('Error fetching user information: ', error);
      setMessage('Google login failed. Please try again.');
    }
  };

  const fetchUserInfoFromBackend = async (token: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/callback', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }), // Send the token to the backend
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user information from the backend');
      }

      const data = await response.json();
      return data; // Return the user data from the backend
    } catch (error) {
      throw new Error('Failed to fetch user data from the backend');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="register-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonItem>
                  <IonInput
                    type="text"
                    value={formData.first_name}
                    onIonChange={(e) => updateFormData('first_name', e.detail.value!)}
                    placeholder="First name"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="text"
                    value={formData.last_name}
                    onIonChange={(e) => updateFormData('last_name', e.detail.value!)}
                    placeholder="Last name"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonChange={(e) => updateFormData('email', e.detail.value!)}
                    placeholder="Enter email"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onIonChange={(e) => updateFormData('password', e.detail.value!)}
                    placeholder="Enter password"
                    required
                  >
                    <IonIcon
                      slot="end"
                      icon={showPassword ? eye : eyeOff}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onIonChange={(e) => updateFormData('confirm_password', e.detail.value!)}
                    placeholder="Confirm password"
                    required
                  >
                    <IonIcon
                      slot="end"
                      icon={showConfirmPassword ? eye : eyeOff}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </IonInput>
                </IonItem>

                <IonButton
                  expand="block"
                  onClick={handleNextClick}
                  disabled={!isFormValid()}
                >
                  <IonIcon icon={arrowForwardCircle} slot="start" />
                  Next
                </IonButton>

                <div className="social-button">
                  <a
                    href="http://127.0.0.1:8000/auth/google"
                    className="social-link inline-block px-3 py-2 rounded-lg shadow"
                    title="Login with Google"
                  >
                    <span style={{ fontSize: '16px', verticalAlign: 'middle' }}>
                      Login with Google
                    </span>
                  </a>
                </div>

                {message && (
                  <IonText color="medium" className="error-message">
                    <div>{message}</div>
                  </IonText>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FirstStage;
