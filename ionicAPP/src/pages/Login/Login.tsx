import React, { useContext, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLoading, IonButton, IonItem, IonText, IonGrid, IonRow, IonCol } from '@ionic/react';
import '../../components/styles/login-style.css';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);  
  const context = useContext(UserContext);
  const history = useHistory();

  if (!context) {
    throw new Error("UserContext must be used within a UserContext.Provider");
  }

  const { setIsLoggedIn } = context;
  const { setIsCompleated } = context;

  interface LoginResponse {
    token: string;
    redirect_url?: string;
  }
  
  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (response.ok) {
        const data: LoginResponse = await response.json();
        setIsLoggedIn(true);
        setIsCompleated(true);
        setErrorMessage(null);  
  
        Cookies.set('jwt_token', data.token, {
          expires: 1 / 24, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'lax',
        });
  
        if (data.redirect_url) {
          console.log('Login successful:', data);
          history.push(data.redirect_url);
        }
      } else if (response.status === 422) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid credentials.');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="form-box">
                <IonItem>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </IonItem>

                {errorMessage && (
                  <IonText color="danger" className="error-message">
                    {errorMessage}
                  </IonText>
                )}

                <IonButton expand="block" className="login-button" onClick={handleLogin} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </IonButton>

                <IonButton expand="block" fill="outline" className="register-button" disabled={loading}>
                  <a href="/register">Create New Account</a>
                </IonButton>

                <div className="social-login-buttons">
                  <IonButton expand="block" color="primary" className="social-button" disabled={loading}>
                    Continue with Facebook
                  </IonButton>
                  <IonButton href="{{ url('auth/google') }}" expand="block" color="medium" className="social-button" disabled={loading}>
                    Continue with Google
                  </IonButton>
                </div>
                <IonLoading isOpen={loading}/>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
