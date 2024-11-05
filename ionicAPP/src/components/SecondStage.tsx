import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonText, IonGrid, IonRow, IonCol } from '@ionic/react';

interface SecondStageProps {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const SecondStage: React.FC<SecondStageProps> = ({ first_name, last_name, email, password }) => {
  const [birthdate, setBirthdate] = useState('');
  const [kilos, setKilos] = useState('');
  const [height, setHeight] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleCompleteRegistration = async () => {
    const data = { first_name, last_name, email, password, birthdate, kilos, height };
    console.log(kilos)
    console.log(data)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept':'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || 'Registration failed');
        return;
      }
      setMessage(result.message || 'Registration complete');
    } catch (error) {
      setMessage("Error connecting to the server.");
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
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonItem>
                  <IonInput
                    type="date"
                    value={birthdate}
                    onIonChange={e => setBirthdate(e.detail.value!)}
                    placeholder="Birthdate"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="number"
                    value={kilos}
                    onIonChange={e => setKilos(e.detail.value!)}
                    placeholder="Weight (kg)"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="number"
                    value={height}
                    onIonChange={e => setHeight(e.detail.value!)}
                    placeholder="Height (cm)"
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
