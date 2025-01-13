import React, { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
} from '@ionic/react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { useHistory } from 'react-router-dom'
import '../../components/styles/home.css'
import MacrosChart from '../../components/MacrosChart'
import ProgressChart from '../../components/progress-chart'

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const history = useHistory()

  const validateToken = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/validate/token', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setIsAuthenticated(true)
        } else {
          history.push('/login')
        }
      } else {
        history.push('/login')
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      history.push('/login')
    }
  }

  useEffect(() => {
    validateToken()
  }, [history])

  if (!isAuthenticated) {
    return null
  }

  return (
    <IonPage>
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
            <ProgressChart />
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  )
}

export default Home
