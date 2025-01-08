import React, { createContext, useState, useEffect } from 'react'
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
  IonToggle,
} from '@ionic/react'
import type { ToggleCustomEvent } from '@ionic/react';
import { pencil, settings, logOut } from 'ionicons/icons'

import '../../components/styles/profile-style.css'
import '../../theme/variables.css'

const MyProfile: React.FC = () => {
  const [themeToggle, setThemeToggle] = useState(false);
  
    // to listen for the toggle
    const toggleChange = (event: ToggleCustomEvent) => {
      toggleDarkTheme(event.detail.checked);
    };
  
    // to add or remove the dark class
    const toggleDarkTheme = (shouldAdd: boolean) => {
      document.body.classList.toggle('dark', shouldAdd);
    };
  
    // to check or uncheck the toggle and update the theme based on isDark
    const initializeDarkTheme = (isDark: boolean) => {
      setThemeToggle(isDark);
      toggleDarkTheme(isDark);
    };
  
    useEffect(() => {
  
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
      // Initialize the dark theme based on the initial
      // value of the prefers-color-scheme media query
      initializeDarkTheme(prefersDark.matches);
  
      const setDarkThemeFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
        initializeDarkTheme(mediaQuery.matches);
      };
  
      // Listen for changes to the prefers-color-scheme media query
      prefersDark.addEventListener('change', setDarkThemeFromMediaQuery);

      return () => {
        prefersDark.removeEventListener('change', setDarkThemeFromMediaQuery);
      };
    }, []);
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
            <IonToggle checked={themeToggle} onIonChange={toggleChange} justify="space-between"> Dark Mode </IonToggle>
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
