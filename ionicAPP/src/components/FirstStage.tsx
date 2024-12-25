import React, { useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonText,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading, // Import IonLoading
} from '@ionic/react'
import { eye, eyeOff, arrowForwardCircle } from 'ionicons/icons'

interface FirstStageProps {
  handleSubmit: () => void
  formData: {
    first_name: string
    last_name: string
    email: string
    password: string
    confirm_password: string
  }
  updateFormData: (field: string, value: string) => void
}

const FirstStage: React.FC<FirstStageProps> = ({
  handleSubmit,
  formData,
  updateFormData,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // State for loading indicator

  const isFormValid = () => {
    return (
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirm_password &&
      formData.password === formData.confirm_password
    )
  }

  const handleNextClick = () => {
    if (!isFormValid()) {
      setMessage('Please fill out all fields correctly.')
      return
    }
    setMessage(null)
    setLoading(true) // Start loading
    handleSubmit()
  }

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
                    onIonChange={(e) =>
                      updateFormData('first_name', e.detail.value!)
                    }
                    placeholder="First name"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="text"
                    value={formData.last_name}
                    onIonChange={(e) =>
                      updateFormData('last_name', e.detail.value!)
                    }
                    placeholder="Last name"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonChange={(e) =>
                      updateFormData('email', e.detail.value!)
                    }
                    placeholder="Enter email"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onIonChange={(e) =>
                      updateFormData('password', e.detail.value!)
                    }
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
                    onIonChange={(e) =>
                      updateFormData('confirm_password', e.detail.value!)
                    }
                    placeholder="Confirm password"
                    required
                  >
                    <IonIcon
                      slot="end"
                      icon={showConfirmPassword ? eye : eyeOff}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </IonInput>
                </IonItem>

                <IonButton
                  expand="block"
                  onClick={handleNextClick}
                  disabled={!isFormValid() || loading}
                >
                  <IonIcon icon={arrowForwardCircle} slot="start" />
                  {loading ? 'Loading...' : 'Next'}
                </IonButton>

                <IonButton
                  href="http://127.0.0.1:8000/api/auth/google"
                  expand="block"
                  color="medium"
                  className="social-button"
                  disabled={loading}
                >
                  Continue with Google
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

        <IonLoading
          isOpen={loading}
          message="Please wait..."
          onDidDismiss={() => setLoading(false)}
        />
      </IonContent>
    </IonPage>
  )
}

export default FirstStage
