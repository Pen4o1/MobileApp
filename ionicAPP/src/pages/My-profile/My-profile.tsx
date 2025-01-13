import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonToggle,
} from '@ionic/react';
import type { ToggleCustomEvent } from '@ionic/react';
import { pencil, settings, logOut } from 'ionicons/icons';

import '../../components/styles/profile-style.css';

const MyProfile: React.FC = () => {
  const [themeToggle, setThemeToggle] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    last_name: '',
    email: '',
    avatar: '',
  });

  // Dark theme toggle logic
  const toggleChange = (event: ToggleCustomEvent) => {
    toggleDarkTheme(event.detail.checked);
  };

  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle('dark', shouldAdd);
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const initializeDarkTheme = (isDark: boolean) => {
      setThemeToggle(isDark);
      toggleDarkTheme(isDark);
    };

    initializeDarkTheme(prefersDark.matches);

    const setDarkThemeFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      initializeDarkTheme(mediaQuery.matches);
    };

    prefersDark.addEventListener('change', setDarkThemeFromMediaQuery);
    return () => {
      prefersDark.removeEventListener('change', setDarkThemeFromMediaQuery);
    };
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data.');
        }

        const result = await response.json();

        setUserData({
          name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          avatar: result.avatar || 'https://ionicframework.com/docs/img/demos/avatar.svg',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <IonPage>
      <IonContent className="ion-padding profile-content">
        <div className="profile-box">
          <div className="profile-header">
            <IonAvatar className="profile-avatar">
              <img alt="User's avatar" src={userData.avatar} />
            </IonAvatar>
            <h2>{userData.name || 'User Name'}</h2>
            <p>{userData.email || 'user@example.com'}</p>
          </div>

          <div className="profile-buttons">
            <IonToggle checked={themeToggle} onIonChange={toggleChange}>
              Dark Mode
            </IonToggle>
            <IonButton expand="block" color="primary" className="profile-button">
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
  );
};

export default MyProfile;
