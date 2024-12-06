import React, { createContext, useState } from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs } from '@ionic/react';
import { home, add, person } from 'ionicons/icons';  // Icons for the buttons
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home-page/Home-page';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/Forgotten-password/Forgot-password';
import MyProfile from './pages/My-profile/My-profile';
import AddFood from './pages/Add-food/Add-food';
import { GoogleOAuthProvider } from '@react-oauth/google';  
import './components/styles/app-style.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

export const UserContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
} | null>(null);

setupIonicReact();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <GoogleOAuthProvider clientId="742935799054-antfglui429eb8aj3ui01pogffeo8iae.apps.googleusercontent.com">
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/add-food">
                <AddFood />
              </Route>
              <Route exact path="/my-profile">
                <MyProfile />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/forgot-password">
                <ForgotPassword />
              </Route>
            </IonRouterOutlet>

            {isLoggedIn && (
                <IonTabBar slot="bottom">
                  <IonTabButton tab="home" href="/home">
                    <IonIcon icon={home} />
                    <IonLabel>Home</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="add-food" href="/add-food">
                    <IonIcon icon={add} />
                    <IonLabel>Add Food</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="my-profile" href="/my-profile">
                    <IonIcon icon={person} />
                    <IonLabel>Profile</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              )}
          </IonTabs>
        </IonReactRouter>
      </IonApp>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
};


export default App;
