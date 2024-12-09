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
  const [foodSentence, setFoodSentence] = useState(''); // For nutrition data
  const [recipeName, setRecipeName] = useState(''); // For recipe name
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [recipeData, setRecipeData] = useState<any>(null);
  const [errorMessageNutrition, setErrorMessageNutrition] = useState<string | null>(null);
  const [errorMessageRecipe, setErrorMessageRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Separate states for modals
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Fetch nutrition data
  const handleTextInput = async () => {
    if (!foodSentence.trim()) {
      setErrorMessageNutrition('Please enter a valid food description.');
      return;
    }

    setLoading(true);
    setErrorMessageNutrition(null);

    try {
      const apiKeyNinja = import.meta.env.VITE_CALORIE_NINJA_API_KEY;
      if (!apiKeyNinja) {
        throw new Error('API Key is missing. Please configure it in the environment file.');
      }
      console.log(`Fetching nutrition data for: ${foodSentence}`);

      const response = await fetch(
        'https://api.calorieninjas.com/v1/nutrition?query=' + encodeURIComponent(foodSentence),
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
      setShowNutritionModal(true);
      setShowRecipeModal(false);
    } catch (error) {
      setErrorMessageNutrition('Error fetching nutrition information. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipe data
  const handleRecepies = async () => {
    if (!recipeName.trim()) {
      setErrorMessageRecipe('Please enter a valid recipe name.');
      return;
    }
  
    setLoading(true);
    setErrorMessageRecipe(null);
  
    try {
      const apiKeyNinja = import.meta.env.VITE_CALORIE_NINJA_API_KEY;
      if (!apiKeyNinja) {
        throw new Error('API Key is missing. Please configure it in the environment file.');
      }
      console.log(`Fetching recipe data for: ${recipeName}`);
  
      const response = await fetch(
        'https://api.calorieninjas.com/v1/recipe?query=' + encodeURIComponent(recipeName),
        {
          method: 'GET',
          headers: {
            'X-Api-Key': apiKeyNinja,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch recipe data.');
      }
  
      const data = await response.json();
      console.log('Recipe data:', data); // Check the response structure
  
      if (data.items && data.items.length > 0) {
        setRecipeData(data.items); // Update recipe data state
        setShowRecipeModal(true);  // Show recipe modal
        setShowNutritionModal(false); // Hide nutrition modal
      } else {
        setErrorMessageRecipe('No recipe data found for your query.');
      }
  
    } catch (error) {
      setErrorMessageRecipe('Error fetching recipe information. Please try again.');
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
                  {errorMessageNutrition && (
                    <IonText color="danger">
                      <p>{errorMessageNutrition}</p>
                    </IonText>
                  )}
                </SwiperSlide>

                <SwiperSlide>
                  <IonButton expand="block" color="primary">
                    Upload Image of the food label
                  </IonButton>
                </SwiperSlide>

                {/* Recipe Slide */}
                <SwiperSlide>
                  <IonItem>
                    <IonInput
                      placeholder="Enter recipe name"
                      value={recipeName}
                      onIonChange={(e) => setRecipeName(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton expand="block" color="primary" onClick={handleRecepies} disabled={loading}>
                    {loading ? 'Fetching Recipes...' : 'Get Recipe Info'}
                  </IonButton>
                  {errorMessageRecipe && (
                    <IonText color="danger">
                      <p>{errorMessageRecipe}</p>
                    </IonText>
                  )}
                </SwiperSlide>
              </Swiper>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Nutrition Information Modal */}
        <IonModal isOpen={showNutritionModal} onDidDismiss={() => setShowNutritionModal(false)}>
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
                    <IonButton expand="block" color="primary" onClick={() => setShowNutritionModal(false)}>
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

        {/* Recipe Information Modal */}
        <IonModal isOpen={showRecipeModal} onDidDismiss={() => setShowRecipeModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Recipe Information</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {recipeData && recipeData.length > 0 ? (
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    {recipeData.map((item: any, index: number) => (
                      <IonItem key={index}>
                        <IonLabel>
                          <h3>{item.title}</h3>
                          <p>{item.instructions}</p>
                        </IonLabel>
                      </IonItem>
                    ))}
                    <IonButton expand="block" color="primary" onClick={() => setShowRecipeModal(false)}>
                      Close
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            ) : (
              <IonText color="danger">
                <p>No recipe data available. Please try again.</p>
              </IonText>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AddFood;
