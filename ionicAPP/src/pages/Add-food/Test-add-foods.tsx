import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from '@ionic/react'
import '../../components/styles/login-style.css'

const TestCal: React.FC = () => {
  const [consumed_cal, setConsumed_cal] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const history = useHistory()

  const handleSave = async (): Promise<void> => {
    try {
      const payload = {
        consumed_cal,
      }

      const response = await fetch(
        'http://127.0.0.1:8000/api/save-daily-macros',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save profile data')
      }

      const data = await response.json()
      setErrorMessage(null)
      console.log('Profile updated:', data)
      if (data.redirect_url) {
        history.push(data.redirect_url)
      }
    } catch (error) {
      setErrorMessage('Failed to save profile data.')
    }
  }

  return (
    <IonPage>
      <IonContent className="login-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonAccordionGroup>
                <IonAccordion value="additional">
                  <IonItem slot="header">
                    <IonLabel>Additional Information</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonItem>
                      <IonInput
                        placeholder="Weight (kg)"
                        type="number"
                        value={consumed_cal}
                        onIonChange={(e) => setConsumed_cal(e.detail.value!)}
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
              >
                Save
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default TestCal
