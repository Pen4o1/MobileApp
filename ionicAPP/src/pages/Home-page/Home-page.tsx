import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText } from '@ionic/react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../components/styles/home.css';
import MacrosChart from '../../components/macros-chart';
import ProgressChart from '../../components/progress-chart';

const Home: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const history = useHistory();

    // Function to validate the JWT token
    const validateToken = async (token: string) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                return true; // Token is valid
            } else {
                return false; // Token is invalid
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    };

    useEffect(() => {
        const token = Cookies.get('jwt_token'); // Retrieve the JWT token from the cookie

        if (token) {
            // Validate the token with the backend
            validateToken(token).then((isValid) => {
                if (isValid) {
                    setIsAuthenticated(true); // Allow access to the page
                } else {
                    Cookies.remove('jwt_token'); // Clear the invalid token
                    history.push('/login'); // Redirect to login
                }
            });
        } else {
            history.push('/login'); // Redirect to login if no token is present
        }
    }, [history]);

    if (!isAuthenticated) {
        return null; // Prevent rendering until authentication is confirmed
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonText color="primary">
                    <h1>Welcome back</h1>
                </IonText>

                <Swiper
                    className="my-swiper"
                    spaceBetween={50}
                    slidesPerView={1}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                >
                    <SwiperSlide>
                        <MacrosChart />
                    </SwiperSlide>

                    <SwiperSlide>
                        <ProgressChart value={30} />
                    </SwiperSlide>
                </Swiper>
            </IonContent>
        </IonPage>
    );
};

export default Home;
