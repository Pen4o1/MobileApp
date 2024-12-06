import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonText, IonGrid, IonRow, IonCol, IonInput, IonIcon } from '@ionic/react';
import { barcode, text, camera, restaurant } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../components/styles/add-food-style.css'

const AddFood: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Food</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <Swiper
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                pagination={{ clickable: true }}
              >
                <SwiperSlide>   
                  <IonButton expand="block" color="primary">Scan Barcode</IonButton>
                </SwiperSlide>

                <SwiperSlide>
                  <IonItem>
                    <IonInput placeholder="Enter what you ate" />
                  </IonItem>
                  <IonButton expand="block" color="primary">Get Nutrition</IonButton>
                </SwiperSlide>

                <SwiperSlide>
                  <IonButton expand="block" color="primary">Upload Image of the food label</IonButton>
                </SwiperSlide>

                <SwiperSlide>
                  <IonItem>
                    <IonInput placeholder="Enter recipe name" />
                  </IonItem>
                  <IonButton expand="block" color="primary">Get Recipe Info</IonButton>
                </SwiperSlide>
              </Swiper>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddFood;
