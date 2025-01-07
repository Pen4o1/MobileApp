import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonAlert,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';

interface MealPlanItem {
  recipe_name: string;
  recipe_description: string;
  recipe_nutrition: {
    calories: string;
  };
}

const MealPlanPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen); 
  const [mealPlan, setMealPlan] = useState<MealPlanItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMealPlan = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get/meal/plan', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to fetch meal plan');
      }

      const data = await response.json();
      setMealPlan(data.meal_plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    await fetchMealPlan();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onClose(); // Notify parent about modal close
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meal Plan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={openModal}>View My Meal Plan</IonButton>

        <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>My Meal Plan</IonTitle>
              <IonButton slot="end" onClick={closeModal}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {loading ? (
              <IonLoading isOpen={loading} message="Loading meal plan..." />
            ) : error ? (
              <IonAlert
                isOpen={!!error}
                message={error}
                onDidDismiss={() => setError(null)}
              />
            ) : mealPlan && mealPlan.length > 0 ? (
              <IonList>
                {mealPlan.map((meal, index) => (
                  <IonItem key={index}>
                    <IonLabel>
                      <h3>{meal.recipe_name}</h3>
                      <p>{meal.recipe_description}</p>
                      <p><strong>Calories:</strong> {meal.recipe_nutrition.calories} kcal</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            ) : (
              <p>No meal plan available.</p>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MealPlanPopup;
