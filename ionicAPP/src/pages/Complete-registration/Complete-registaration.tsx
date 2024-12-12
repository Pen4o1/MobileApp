import React, { useContext, useState } from 'react';
import {
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonPage,
  IonTitle,
  IonInput,
  IonLoading,
  IonButton,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from '@ionic/react';
import '../../components/styles/login-style.css';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';

const Profile: React.FC = () => {
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [kilos, setKilos] = useState('');
  const [secondName, setSecondName] = useState('');
  const [firstName, setFirstName] = useState('');   
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const incompleteFields = {
    birthdate: false,
    height: false,
    kilos: true,
    secondName: true,
    firstName: true,
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonAccordionGroup>
                <IonAccordion value="personal">
                  <IonItem slot="header">
                    <IonLabel>Personal Details</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                  <IonItem>
                      <IonInput
                        placeholder='First Name' 
                        type="text"
                        value={firstName}
                        onIonChange={(e) => setFirstName(e.detail.value!)}
                        disabled={!incompleteFields.firstName || loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonInput
                        placeholder='Second Name'
                        type="text"
                        value={secondName}
                        onIonChange={(e) => setSecondName(e.detail.value!)}
                        disabled={!incompleteFields.secondName || loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Birthdate</IonLabel>
                      <IonInput
                        type="date"
                        value={birthdate}
                        onIonChange={(e) => setBirthdate(e.detail.value!)}
                        disabled={incompleteFields.birthdate || loading}
                      />
                    </IonItem>
                  </div>
                </IonAccordion>

                <IonAccordion value="additional">
                  <IonItem slot="header">
                    <IonLabel>Additional Information</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonItem>
                      <IonInput
                      placeholder='Height (cm)'
                        type="number"
                        value={height}
                        onIonChange={(e) => setHeight(e.detail.value!)}
                        disabled={incompleteFields.height || loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonInput
                      placeholder='Weight (kg)'
                        type="number"
                        value={kilos}
                        onIonChange={(e) => setKilos(e.detail.value!)}
                        disabled={!incompleteFields.kilos || loading}
                      />
                    </IonItem>
                  </div>
                </IonAccordion>
              </IonAccordionGroup>

              {/* Error Message */}
              {errorMessage && (
                <IonText color="danger" className="error-message">
                  {errorMessage}
                </IonText>
              )}

              {/* Submit Button */}
              <IonButton
                expand="block"
                className="login-button"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonLoading isOpen={loading} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
