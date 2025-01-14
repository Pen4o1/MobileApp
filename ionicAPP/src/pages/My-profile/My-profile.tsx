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

import EditProfileModal from '../../components/EditProfileWindow';  // Import the modal component
import '../../components/styles/profile-style.css';

const MyProfile: React.FC = () => {
  const [themeToggle, setThemeToggle] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

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
          first_name: result.first_name,  // Use 'first_name' instead of 'name'
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

  // Handle save changes from modal
  const handleSaveChanges = (updatedData: { first_name: string; last_name: string; email: string }) => {
    setUserData({
      ...userData,  // Spread existing user data to retain the avatar
      ...updatedData, // Apply the updated fields (first_name, last_name, email)
    });
    setIsModalOpen(false); // Close the modal after saving changes
  };

  return (
    <IonPage>
      <IonContent className="ion-padding profile-content">
        <div className="profile-box">
          <div className="profile-header">
            <IonAvatar className="profile-avatar">
              <img alt="User's avatar" src={userData.avatar} />
            </IonAvatar>
            <h2>{userData.first_name}</h2>  {/* Use 'first_name' */}
            <p>{userData.last_name}</p>
          </div>

          <div className="profile-buttons">
            <IonToggle checked={themeToggle} onIonChange={toggleChange}>
              Dark Mode
            </IonToggle>
            <IonButton expand="block" color="primary" className="profile-button" onClick={() => setIsModalOpen(true)}>
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

      {/* Pass necessary props to EditProfileModal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)} // Close the modal
        userData={userData} // Pass updated user data (with first_name)
        onSave={handleSaveChanges} // Pass save changes handler
      />
    </IonPage>
  );
};

export default MyProfile;
