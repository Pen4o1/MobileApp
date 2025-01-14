import React, { useEffect, useState } from 'react';
import {
  IonPage, 
  IonContent, 
  IonInput, 
  IonButton, 
  IonItem,
  IonText,
  IonLabel, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonLoading, 
  IonSelectOption, 
  IonSelect, 
  IonIcon
} from '@ionic/react';
import { close } from 'ionicons/icons';

interface EditProfileWindowProps {
  isOpen: boolean;
  onDismiss: () => void;
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  };
  onSave: (updatedData: {
    first_name: string;
    last_name: string;
    email: string;
    birthdate: string;
    height: string;
    kilos: string;
    gender: string;
  }) => void;
}

const EditProfileWindow: React.FC<EditProfileWindowProps> = ({ isOpen, onDismiss, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [kilos, setKilos] = useState('');
  const [gender, setGender] = useState('');
  const [completedFields, setCompletedFields] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/profile/status', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setFirstName(data.profile_data.first_name || '');
      setSecondName(data.profile_data.last_name || '');
      setEmail(data.profile_data.email || '');
      setBirthdate(data.profile_data.birthdate || '');
      setHeight(data.profile_data.height || '');
      setKilos(data.profile_data.kilos || '');
      setGender(data.profile_data.gender || '');
      setCompletedFields(data.completed_fields || []);
    } catch (error) {
      setErrorMessage('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const isFieldCompleted = (field: string) => completedFields.includes(field);

  const isFieldFilled = (value: string) => value.trim() !== '';

  const handleSave = async () => {
    if (
      !isFieldFilled(firstName) ||
      !isFieldFilled(secondName) ||
      !isFieldFilled(birthdate) ||
      !isFieldFilled(height) ||
      !isFieldFilled(kilos) ||
      !isFieldFilled(gender)
    ) {
      setErrorMessage('Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    const updatedData = {
      first_name: firstName,
      last_name: secondName,
      email,
      birthdate,
      height,
      kilos,
      gender,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/update/profile', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile data');
      }

      const data = await response.json();
      setErrorMessage(null);
      onSave(updatedData);
      onDismiss();
    } catch (error) {
      setErrorMessage('Failed to save profile data.');
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <IonPage>
      <IonContent className="login-content" style={{ position: 'relative' }}> 
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonButton
                fill="clear"
                onClick={onDismiss}
                size="small"
                color="medium"
                style={{
                  top: '10px', 
                  right: '10px', 
                  zIndex: 10,
                }}
              >
                <IonIcon icon={close} />
              </IonButton>

              <IonItem>
                <IonInput
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onIonChange={(e) => setFirstName(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  placeholder="Second Name"
                  type="text"
                  value={secondName}
                  onIonChange={(e) => setSecondName(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  placeholder="Email"
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  type="date"
                  value={birthdate}
                  onIonChange={(e) => setBirthdate(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  placeholder="Height (cm)"
                  type="number"
                  value={height}
                  onIonChange={(e) => setHeight(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  placeholder="Weight (kg)"
                  type="number"
                  value={kilos}
                  onIonChange={(e) => setKilos(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonSelect
                  value={gender}
                  placeholder="Select Gender"
                  onIonChange={(e) => setGender(e.detail.value!)}
                >
                  <IonSelectOption value="male">Male</IonSelectOption>
                  <IonSelectOption value="female">Female</IonSelectOption>
                </IonSelect>
              </IonItem>

              {errorMessage && (
                <IonText color="danger" className="error-message">
                  {errorMessage}
                </IonText>
              )}

              <IonButton expand="block" className="login-button" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              
              <IonLoading isOpen={loading} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  ) : null;
};

export default EditProfileWindow;
