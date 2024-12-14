import React from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonIcon,
} from '@ionic/react'
import { pencil, settings, logOut } from 'ionicons/icons'
import '../../components/styles/profile-style.css'

const MyProfile: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding profile-content">
        <div className="profile-box">
          <div className="profile-header">
            <IonAvatar className="profile-avatar">
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <h2>John Doe</h2>
            <p>johndoe@example.com</p>
            <p></p>
          </div>

          <div className="profile-buttons">
            <IonButton
              expand="block"
              color="primary"
              className="profile-button"
            >
              <IonIcon icon={pencil} slot="start" />
              Edit Profile
            </IonButton>
            <IonButton expand="block" color="medium" className="profile-button">
              <IonIcon icon={settings} slot="start" />
              Settings
            </IonButton>
            <IonButton expand="block" color="danger" className="profile-button">
              <IonIcon icon={logOut} slot="start" />
              Logout
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default MyProfile
