import React, { useState } from 'react'
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
  IonModal,
} from '@ionic/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const AddFood: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [fetchedItems, setFetchedItems] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Fetch Foods or Recipes using Query Parameters
  const fetchItems = async () => {
    if (!inputValue.trim()) {
      setErrorMessage('Please enter a valid input.')
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/foods/search?query=${encodeURIComponent(
          inputValue
        )}`,
        {
          method: 'GET',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch items.')
      }

      const data = await response.json()
      const foods = data.foods_search?.results?.food || []
      if (foods.length === 0) {
        setErrorMessage('No items found for your query.')
      } else {
        // Map the API data into a simpler format
        const formattedItems = foods.map((food: any) => ({
          id: food.food_id,
          name: food.food_name,
          calories:
            food.servings?.serving[0]?.calories || 'Unknown', // Default if calories are missing
          servingDescription:
            food.servings?.serving[0]?.serving_description || 'Unknown', // Serving description
        }))
        setFetchedItems(formattedItems)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      setErrorMessage('Error fetching items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Toggle Selected Items
  const toggleSelection = (item: any) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id)
    if (isSelected) {
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.id !== item.id)
      )
    } else {
      setSelectedItems((prev) => [...prev, item])
    }
  }

  // Add Selected Items to Daily Calories
  const addItemsToDailyCalories = async () => {
    if (selectedItems.length === 0) {
      setErrorMessage('No items selected.')
      return
    }

    try {
      const payload = selectedItems.map((item) => ({
        consumed_cal: parseInt(item.calories, 10), 
      }))

      const response = await fetch(
        'http://127.0.0.1:8000/api/save-daily-macros',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save items.')
      }

      const data = await response.json()
      console.log('Successfully added items:', data)
      setSelectedItems([])
      setShowModal(false)
    } catch (error) {
      console.error('Error adding items:', error)
      setErrorMessage('Error saving items. Please try again.')
    }
  }

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
                {/* Food/Recipe Input Slide */}
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

                {/* Barcode Entry Slide */}
                <SwiperSlide>
                  <IonButton expand="block" color="primary">
                    Scan Barcode (Coming Soon)
                  </IonButton>
                </SwiperSlide>
              </Swiper>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Error Message */}
        {errorMessage && (
          <IonText color="danger">
            <p>{errorMessage}</p>
          </IonText>
        )}

        {/* Items Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select Items</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
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

            <IonButton
              expand="block"
              color="success"
              onClick={addItemsToDailyCalories}
              disabled={selectedItems.length === 0}
            >
              Add Selected to Daily Calories
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default AddFood
