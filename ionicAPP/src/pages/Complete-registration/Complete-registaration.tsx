import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
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
  IonSelect,
  IonSelectOption,
} from '@ionic/react'
import '../../components/styles/login-style.css'

const Profile: React.FC = () => {
  const [birthdate, setBirthdate] = useState('')
  const [height, setHeight] = useState('')
  const [kilos, setKilos] = useState('')
  const [secondName, setSecondName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [gender, setGender] = useState('')
  const [completedFields, setCompletedFields] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const history = useHistory()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'http://127.0.0.1:8000/api/profile/status',
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const data = await response.json()
        setBirthdate(data.profile_data.birthdate || '')
        setHeight(data.profile_data.height || '')
        setKilos(data.profile_data.kilos || '')
        setSecondName(data.profile_data.last_name || '')
        setFirstName(data.profile_data.first_name || '')
        setGender(data.profile_data.gender || '')
        setCompletedFields(data.completed_fields || [])
      } catch (error) {
        setErrorMessage('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleSave = async (): Promise<void> => {
    if (
      !isFieldFilled('first_name', firstName) ||
      !isFieldFilled('last_name', secondName) ||
      !isFieldFilled('birthdate', birthdate) ||
      !isFieldFilled('height', height) ||
      !isFieldFilled('kilos', kilos) ||
      !isFieldFilled('gender', gender)
    ) {
      setErrorMessage('Please fill in all the required fields.')
      return
    }

    try {
      setLoading(true)
      const payload = {
        birthdate,
        height,
        kilos,
        secondName,
        firstName,
        gender,
      }

      const response = await fetch('http://127.0.0.1:8000/api/update/profile', {
        method: 'POST',
        credentials: 'include',
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
      console.log('Profile updated:', data)
      if (data.redirect_url) {
        history.push(data.redirect_url)
      }
    } catch (error) {
      setErrorMessage('Failed to save profile data.')
    } finally {
      setLoading(false)
    }
  }

  const isFieldCompleted = (field: string) => completedFields.includes(field)

  const isFieldFilled = (field: string, value: string) => {
    return (typeof value === 'string' && value.trim() !== '') || value !== null
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
                        disabled={isFieldCompleted('first_name') || loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonInput
                        placeholder="Second Name"
                        type="text"
                        value={secondName}
                        onIonChange={(e) => setSecondName(e.detail.value!)}
                        disabled={isFieldCompleted('last_name') || loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Birthdate</IonLabel>
                      <IonInput
                        type="date"
                        value={birthdate}
                        onIonChange={(e) => setBirthdate(e.detail.value!)}
                        disabled={isFieldCompleted('birthdate') || loading}
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
                        disabled={isFieldCompleted('height') || loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonInput
                        placeholder="Weight (kg)"
                        type="number"
                        value={kilos}
                        onIonChange={(e) => setKilos(e.detail.value!)}
                        disabled={isFieldCompleted('kilos') || loading}
                      />
                    </IonItem>
                    <IonItem>
                      <IonSelect
                        value={gender}
                        placeholder="Select Gender"
                        onIonChange={(e) => setGender(e.detail.value!)}
                        disabled={isFieldCompleted('gender') || loading}
                      >
                        <IonSelectOption value="male">Male</IonSelectOption>
                        <IonSelectOption value="female">Female</IonSelectOption>
                      </IonSelect>
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
