import React from 'react';
import { IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <div>
      <h1>Home Page</h1>
      <IonButton onClick={() => history.push('/login')}>Go to Login</IonButton>
    </div>
  );
};

export default Home;
