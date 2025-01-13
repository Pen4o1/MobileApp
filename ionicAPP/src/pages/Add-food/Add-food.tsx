import React, { useState, useEffect } from 'react';
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
  IonLabel,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonModal,
} from '@ionic/react';
import { useHistory } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../components/styles/add-food-style.css';

const AddFood: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [fetchedItems, setFetchedItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
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
  const fetchItems = async () => {
    if (!inputValue.trim()) {
      setErrorMessage('Please enter a valid input.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/foods/search?query=${encodeURIComponent(
          inputValue
        )}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch items.');
      }

      const data = await response.json();
      const foods = data.foods_search?.results?.food || [];
      if (foods.length === 0) {
        setErrorMessage('No items found for your query.');
      } else {
        // Map the fetched data
        const formattedItems = foods.map((food: any) => ({
          id: food.food_id,
          name: food.food_name,
          calories: parseInt(food.servings?.serving[0]?.calories, 10) || 0,
          carbohydrate: parseFloat(food.servings?.serving[0]?.carbohydrate) || 0,
          protein: parseFloat(food.servings?.serving[0]?.protein) || 0,
          fat: parseFloat(food.servings?.serving[0]?.fat) || 0,
          servingDescription:
            food.servings?.serving[0]?.serving_description || 'Unknown',
          servingMultiplier: 1, // Default serving size multiplier
        }));
        setFetchedItems(formattedItems);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setErrorMessage('Error fetching items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleServingChange = (itemId: string, multiplier: number) => {
    setFetchedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, servingMultiplier: multiplier } : item
      )
    );
  };

  const toggleSelection = (item: any) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id);
    if (isSelected) {
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const addItemsToDailyCalories = async () => {
    if (selectedItems.length === 0) {
      setErrorMessage('No items selected.');
      return;
    }

    try {
      const payload = selectedItems.map((item) => ({
        carbohydrate: item.carbohydrate * item.servingMultiplier,
        protein: item.protein * item.servingMultiplier,
        fat: item.fat * item.servingMultiplier,
        consumed_cal: item.calories * item.servingMultiplier,
      }));

      const response = await fetch(
        'http://127.0.0.1:8000/api/save/daily/macros',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save items.');
      }

      const data = await response.json();
      console.log('Successfully added items:', data);
      setSelectedItems([]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding items:', error);
      setErrorMessage('Error saving items. Please try again.');
    }
  };

  return (
    <IonPage>
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
                  <IonItem>
                    <IonInput
                      placeholder="Enter a food or recipe"
                      value={inputValue}
                      onIonChange={(e) => setInputValue(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton
                    expand="block"
                    color="primary"
                    onClick={fetchItems}
                    disabled={loading}
                  >
                    {loading ? 'Fetching...' : 'Find Items'}
                  </IonButton>
                </SwiperSlide>

                <SwiperSlide>
                  <IonButton expand="block" color="primary">
                    Scan Barcode (Coming Soon)
                  </IonButton>
                </SwiperSlide>
              </Swiper>
            </IonCol>
          </IonRow>
        </IonGrid>

        {errorMessage && (
          <IonText color="danger">
            <p>{errorMessage}</p>
          </IonText>
        )}

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select Items</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="item-select">
              {fetchedItems.length > 0 ? (
                <IonGrid>
                  {fetchedItems.map((item, index) => (
                    <IonRow key={index}>
                      <IonCol>
                        <IonItem>
                          <IonLabel>
                            <h2>{item.name}</h2>
                            <p>
                              <strong>Calories:</strong> {item.calories}
                            </p>
                            <p>
                              <strong>Serving:</strong> {item.servingDescription}
                            </p>
                          </IonLabel>
                          <IonSelect
                            placeholder="Servings"
                            onIonChange={(e) =>
                              handleServingChange(item.id, e.detail.value)
                            }
                          >
                            <IonSelectOption value={0.25}>1/4</IonSelectOption>
                            <IonSelectOption value={0.5}>1/2</IonSelectOption>
                            <IonSelectOption value={1}>1</IonSelectOption>
                            <IonSelectOption value={2}>2</IonSelectOption>
                            <IonSelectOption value={3}>3</IonSelectOption>
                          </IonSelect>
                          <IonCheckbox
                            slot="start"
                            checked={selectedItems.some(
                              (selected) => selected.id === item.id
                            )}
                            onIonChange={() => toggleSelection(item)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  ))}
                </IonGrid>
              ) : (
                <IonText color="danger">
                  <p>No items found. Please try another input.</p>
                </IonText>
              )}
            </div>

            <IonButton
              expand="block"
              color="success"
              onClick={addItemsToDailyCalories}
              disabled={selectedItems.length === 0}
              className="fixed-button"
            >
              Add Selected to Daily Calories
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AddFood;
