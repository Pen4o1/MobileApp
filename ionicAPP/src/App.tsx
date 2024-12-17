import React, { createContext, useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonTabBar,
  IonTabButton,
  IonButton,
  IonIcon,
  IonLabel,
  IonTabs,
} from '@ionic/react'
import { home, add, person } from 'ionicons/icons'
import { IonReactRouter } from '@ionic/react-router'
import Home from './pages/Home-page/Home-page'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/Forgotten-password/Forgot-password'
import MyProfile from './pages/My-profile/My-profile'
import AddFood from './pages/Add-food/Add-food'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './components/styles/app-style.css'
import NutritionInfo from './components/nutritionScreen'
import CompleteRegistration from './pages/Complete-registration/Complete-registaration'

import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
import '@ionic/react/css/palettes/dark.system.css'
import './theme/variables.css'

export const UserContext = createContext<{
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  isCompleated: boolean
  setIsCompleated: (value: boolean) => void
} | null>(null)

setupIonicReact()

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCompleated, setIsCompleated] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/validate-token',
          {
            method: 'POST',
            credentials: 'include',
          }
        )
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(data.valid)
          console.log(data.user)
          setIsCompleated(data.compleated)
        } else {
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('Authentication check failed', error)
        setIsLoggedIn(false)
      }
    }

    validateToken()
  }, [])

  return (
    <GoogleOAuthProvider clientId="742935799054-antfglui429eb8aj3ui01pogffeo8iae.apps.googleusercontent.com">
      <UserContext.Provider
        value={{ isLoggedIn, setIsLoggedIn, isCompleated, setIsCompleated }}
      >
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/">
                  <Home />
                </Route>
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
                <Route exact path="/nutrition-info" component={NutritionInfo} />
                <Route exact path="/complete-registaration">
                  <CompleteRegistration />
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

              {isLoggedIn && !isCompleated && (
                <IonTabBar slot="top">
                  <IonTabButton
                    tab="Complete registration"
                    href="/complete-registaration"
                  >
                    <IonButton>Complete registration</IonButton>
                  </IonTabButton>
                </IonTabBar>
              )}
            </IonTabs>
          </IonReactRouter>
        </IonApp>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  )
}

export default App
