    import React, { useState } from 'react';
    import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonText, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
    import { eye, eyeOff } from 'ionicons/icons';
    import '../components/styles/register-style.css';

    interface FirstStageProps {
        handleSubmit: (data: { first_name: string; last_name: string; email: string; password: string }) => void;
      }

    const FirstStage: React.FC<FirstStageProps> = ({handleSubmit}) => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                        value={first_name}
                        onIonChange={e => setFirstName(e.detail.value!)}
                        placeholder="First name"
                        required
                    />
                    </IonItem>

                    <IonItem>
                    <IonInput
                        type="text"
                        value={last_name}
                        onIonChange={e => setLastName(e.detail.value!)}
                        placeholder="Last name"
                        required
                    />
                    </IonItem>

                    <IonItem>
                    <IonInput
                        type="email"
                        value={email}
                        onIonChange={e => setEmail(e.detail.value!)}
                        placeholder="Enter email"
                        required
                    />
                    </IonItem>

                    <IonItem>
                    <IonInput
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onIonChange={e => setPassword(e.detail.value!)}
                        placeholder="Enter password"
                        required
                    >
                        <IonIcon
                        slot="end"
                        icon={showPassword ? eye : eyeOff}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-hidden="true"
                        />
                    </IonInput>
                    </IonItem>

                    <IonItem>
                    <IonInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirm_password}
                        onIonChange={e => setConfirmPassword(e.detail.value!)}
                        placeholder="Confirm password"
                        required
                    >
                        <IonIcon
                        slot="end"
                        icon={showConfirmPassword ? eye : eyeOff}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-hidden="true"
                        />
                    </IonInput>
                    </IonItem>

                    <IonButton expand="block" className="signup-button" onClick={() => handleSubmit({first_name, last_name, email, password})}>
                    Sign Up
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
        </IonContent>
        </IonPage>
    );
    };

    export default FirstStage;
