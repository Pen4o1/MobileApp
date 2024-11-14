import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon,IonInput, IonButton, IonItem, IonText, IonGrid, IonRow, IonCol } from '@ionic/react';
import { arrowBackCircle } from 'ionicons/icons';
import './styles/register-style.css';  

interface SecondStageProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthdate: string;
    kilos: string;
    height: string;
  };
  updateFormData: (field: string, value: string) => void;
  handleBack: () => void;
}

const SecondStage: React.FC<SecondStageProps> = ({ formData, updateFormData, handleBack }) => {
  const [message, setMessage] = useState<string | null>(null);

  const handleCompleteRegistration = async () => {
    const parsedHeight = parseFloat(formData.height);
    const parsedKilos = parseFloat(formData.kilos);
    const data = { ...formData, kilos: parsedKilos, height: parsedHeight };
    console.log(data);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || 'Registration failed');
        return;
      }
      setMessage(result.message || 'Registration complete');
    } catch (error) {
      setMessage('Error connecting to the server.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Complete Registration</IonTitle>        
        </IonToolbar>
      </IonHeader>
      <IonContent className="register-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="1" className="ion-align-self-center">
              <IonButton onClick={handleBack} fill="clear">
                <IonIcon icon={arrowBackCircle} slot="icon-only" /> 
              </IonButton>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonItem>
                  <IonInput
                    type="date"
                    value={formData.birthdate}
                    onIonChange={(e) => updateFormData('birthdate', e.detail.value!)}
                    placeholder="Birthdate"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="number"
                    value={formData.height}
                    onIonChange={(e) => updateFormData('height', e.detail.value!)}
                    placeholder="Height (cm)"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="number"
                    value={formData.kilos}
                    onIonChange={(e) => updateFormData('kilos', e.detail.value!)}
                    placeholder="Weight (kg)"
                    required
                  />
                </IonItem>
                <IonButton expand="block" onClick={handleCompleteRegistration}>
                  Complete Registration
                </IonButton>
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

export default SecondStage;
