import React, { useState } from 'react';
import { IonContent, IonHeader, IonDatetime ,IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonText, IonGrid, IonRow, IonCol } from '@ionic/react';
import '../../components/styles/user-details-style.css';

const UserDetailsForm: React.FC = () => {
  const [birthdate, setBirthdate] = useState('');
  const [kilos, setKilos] = useState('');
  const [height, setHeight] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveDetails = async () => {
    const userDetailsData = { birthdate, kilos, height };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(userDetailsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to save details');
        return;
      }

      const result = await response.json();
      setMessage(result.message || 'Details saved successfully');
    } catch (error) {
      console.error("Error saving user details:", error);
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Enter Your Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="user-details-content">
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
                    placeholder="Kilos (Weight)"
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

                <IonButton expand="block" className="save-button" onClick={handleSaveDetails}>
                  Save Details
                </IonButton>

                {message && (
                  <IonText color="medium" className="status-message">
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

export default UserDetailsForm;
