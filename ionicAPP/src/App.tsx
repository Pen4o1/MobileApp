import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonContent} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home-page/Home-page';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/Forgotten-password/Forgot-password';
import MyProfile from './pages/My-profile/My-profile';
import SecondStageRegister  from './pages/Second-stage-register/Second-stage-register';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter> 
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} /> 
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/my-profile" component={MyProfile} />
        <Route exact path="/register2" component={SecondStageRegister} />
      </IonReactRouter>
  </IonApp>
);

export default App;