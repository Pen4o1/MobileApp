import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonInput,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonLabel,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../components/styles/add-food-style.css';

const AddFood: React.FC = () => {
  const [foodSentence, setFoodSentence] = useState('');
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);  // To control modal visibility

  const handleTextInput = async () => {
    if (!foodSentence.trim()) {
      setErrorMessage('Please enter a valid food description.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const apiKeyNinja = import.meta.env.VITE_CALORIE_NINJA_API_KEY;
      if (!apiKeyNinja) {
        throw new Error('API Key is missing. Please configure it in the environment file.');
      }

      const response = await fetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(foodSentence)}`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': apiKeyNinja,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nutrition data.');
      }

      const data = await response.json();
      setNutritionData(data.items);
      setShowModal(true); 
    } catch (error) {
      setErrorMessage('Error fetching nutrition information. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
              <Swiper spaceBetween={50} slidesPerView={1} loop={true} pagination={{ clickable: true }}>
                <SwiperSlide>
                  <IonButton expand="block" color="primary">
                    Scan Barcode
                  </IonButton>
                </SwiperSlide>

                <SwiperSlide>
                  <IonItem>
                    <IonInput
                      placeholder="Enter what you ate"
                      value={foodSentence}
                      onIonChange={(e) => setFoodSentence(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton expand="block" color="primary" onClick={handleTextInput} disabled={loading}>
                    {loading ? 'Fetching...' : 'Get Nutrition'}
                  </IonButton>
                  {errorMessage && (
                    <IonText color="danger">
                      <p>{errorMessage}</p>
                    </IonText>
                  )}
                </SwiperSlide>

                <SwiperSlide>
                  <IonButton expand="block" color="primary">
                    Upload Image of the food label
                  </IonButton>
                </SwiperSlide>

                <SwiperSlide>
                  <IonItem>
                    <IonInput placeholder="Enter recipe name" />
                  </IonItem>
                  <IonButton expand="block" color="primary">
                    Get Recipe Info
                  </IonButton>
                </SwiperSlide>
              </Swiper>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nutrition Information</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {nutritionData && nutritionData.length > 0 ? (
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    {nutritionData.map((item: any, index: number) => (
                      <IonItem key={index}>
                        <IonLabel>
                          <h2>{item.name}</h2>
                          <p><strong>Calories:</strong> {item.calories} kcal</p>
                          <p><strong>Protein:</strong> {item.protein_g}g</p>
                          <p><strong>Fat:</strong> {item.fat_total_g}g</p>
                          <p><strong>Carbohydrates:</strong> {item.carbohydrates_total_g}g</p>
                        </IonLabel>
                      </IonItem>
                    ))}
                    <IonButton expand="block" color="primary" onClick={() => setShowModal(false)}>
                      Close
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            ) : (
              <IonText color="danger">
                <p>No nutrition data available. Please try again.</p>
              </IonText>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AddFood;
