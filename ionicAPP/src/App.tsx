import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
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

setupIonicReact();

const App: React.FC = () => (
  <GoogleOAuthProvider clientId="742935799054-antfglui429eb8aj3ui01pogffeo8iae.apps.googleusercontent.com">
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/my-profile" component={MyProfile} />
          <Route exact path="/add-food" component={AddFood} />
        </IonRouterOutlet>

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
      </IonReactRouter>
    </IonApp>
  </GoogleOAuthProvider>
);


export default App;
