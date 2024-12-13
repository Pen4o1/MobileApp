import React, { useContext, useEffect, useState } from 'react'
import {
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonPage,
  IonInput,
  IonLoading,
  IonButton,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from '@ionic/react'
import '../../components/styles/login-style.css'
import { UserContext } from '../../App'
import { useHistory } from 'react-router-dom'

const Profile: React.FC = () => {
  const [birthdate, setBirthdate] = useState('')
  const [height, setHeight] = useState('')
  const [kilos, setKilos] = useState('')
  const [secondName, setSecondName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://127.0.0.1:8000/api/profile/status')
        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }
        const data = await response.json()

        setBirthdate(data.birthdate || '')
        setHeight(data.height || '')
        setKilos(data.kilos || '')
        setSecondName(data.secondName || '')
        setFirstName(data.firstName || '')
      } catch (error) {
        setErrorMessage('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleSave = async (): Promise<void> => {
    try {
      setLoading(true)
      const payload = { birthdate, height, kilos, secondName, firstName }

      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile data')
      }

      const data = await response.json()
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage('Failed to save profile data.')
    } finally {
      setLoading(false)
    }
  }

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
                        placeholder="First Name"
                        type="text"
                        value={firstName}
                        onIonChange={(e) => setFirstName(e.detail.value!)}
                        disabled={loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonInput
                        placeholder="Second Name"
                        type="text"
                        value={secondName}
                        onIonChange={(e) => setSecondName(e.detail.value!)}
                        disabled={loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Birthdate</IonLabel>
                      <IonInput
                        type="date"
                        value={birthdate}
                        onIonChange={(e) => setBirthdate(e.detail.value!)}
                        disabled={loading}
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
                        placeholder="Height (cm)"
                        type="number"
                        value={height}
                        onIonChange={(e) => setHeight(e.detail.value!)}
                        disabled={loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonInput
                        placeholder="Weight (kg)"
                        type="number"
                        value={kilos}
                        onIonChange={(e) => setKilos(e.detail.value!)}
                        disabled={loading}
                      />
                    </IonItem>
                  </div>
                </IonAccordion>
              </IonAccordionGroup>

              {errorMessage && (
                <IonText color="danger" className="error-message">
                  {errorMessage}
                </IonText>
              )}

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
  )
}

export default Profile
