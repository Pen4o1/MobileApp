import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';



type NutritionItem = {
    name: string;
    calories: number;
    protein_total_g: number;
    fat_total_g: number;
    carbohydrates_total_g: number;
  };
  
  type LocationState = {
    nutritionData: NutritionItem[];
  };
  
  const NutritionInfo: React.FC = () => {
    const location = useLocation<LocationState>();
    const history = useHistory();
  
    const { nutritionData } = location.state || {};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nutrition Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {nutritionData && nutritionData.length > 0 ? (
          <>
            <IonList>
              {nutritionData.map((item: any, index: number) => (
                <IonItem key={index}>
                  <IonLabel>
                    <h2>{item.name}</h2>
                    <p>
                      <strong>Calories:</strong> {item.calories} kcal
                    </p>
                    <p>
                      <strong>Protein:</strong> {item.protein_total_g}g
                    </p>
                    <p>
                      <strong>Fat:</strong> {item.fat_total_g}g
                    </p>
                    <p>
                      <strong>Carbohydrates:</strong> {item.carbohydrates_total_g}g
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
            <IonButton expand="block" color="primary" onClick={() => alert('Data submitted!')}>
              Submit
            </IonButton>
          </>
        ) : (
          <IonText color="danger">
            <p>No nutrition data available. Please try again.</p>
          </IonText>
        )}
        <IonButton expand="block" fill="outline" onClick={() => history.goBack()}>
          Back
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NutritionInfo;
