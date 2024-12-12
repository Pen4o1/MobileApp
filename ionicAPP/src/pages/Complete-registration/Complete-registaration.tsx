import React, { useContext, useState } from 'react';
import { IonContent, IonSelectOption, IonPage, IonTitle, IonSelect, IonInput, IonLoading, IonButton, IonItem, IonText, IonGrid, IonRow, IonCol, IonList } from '@ionic/react';
import '../../components/styles/login-style.css';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [kilos, setKilos] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);  
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext must be used within a UserContext.Provider");
  }

  
  const handleCompleteProfile = async (): Promise<void> => {
    setLoading(true);
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
                <IonList>
                    <IonSelect aria-label="Favorite Fruit">
                            <IonSelectOption>
                                <IonItem>
                                    <IonInput
                                        type="date"
                                        value={birthdate}
                                        onIonChange={(e) => setBirthdate(e.detail.value!)}
                                        placeholder="Birthdate"
                                        required
                                        disabled={loading}
                                    />
                                </IonItem>
                            <IonItem>
                                <IonInput
                                    type="number"
                                    value={height}
                                    onIonChange={(e) => setHeight(e.detail.value!)}
                                    placeholder="Height (cm)"
                                    required
                                    disabled={loading}
                                />
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    type="number"
                                    value={kilos}
                                    onIonChange={(e) => setKilos(e.detail.value!)}
                                    placeholder="Weight (kg)"
                                    required
                                    disabled={loading}
                                />
                            </IonItem>
                            </IonSelectOption>
                    </IonSelect>
                </IonList>

                {errorMessage && (
                  <IonText color="danger" className="error-message">
                    {errorMessage}
                  </IonText>
                )}

                <IonButton expand="block" className="login-button" onClick={handleCompleteProfile} disabled={loading}>
                  {loading ? 'Subbmiting ...' : 'Submit'}
                </IonButton>
                <IonLoading isOpen={loading}/>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
