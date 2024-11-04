import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import RegisterForm from '../pages/Second-stage-register/Second-stage-register';
import UserDetailsForm from '../pages/Register/Register';

const RegisterFlow: React.FC = () => {
  const [isFirstStepComplete, setIsFirstStepComplete] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleFirstStepCompletion = (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    setUserData(data);
    setIsFirstStepComplete(true);
  };

  return (
    <IonPage>
      <IonContent>
        {!isFirstStepComplete ? (
          <RegisterForm onCompletion={handleFirstStepCompletion} />
        ) : (
          <UserDetailsForm userData={userData} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default RegisterFlow;
