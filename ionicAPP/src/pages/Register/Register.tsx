import React, { useState } from 'react'
import FirstStage from '../../components/FirstStage'
import SecondStage from '../../components/SecondStage'

const RegisterForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    birthdate: '',
    kilos: '',
    height: '',
    gender: '',
  })

  const handleFirstStageSubmit = () => {
    setIsSubmitted(true)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }

  const handleBack = () => {
    setIsSubmitted(false)
  }

  return !isSubmitted ? (
    <FirstStage
      handleSubmit={handleFirstStageSubmit}
      formData={formData}
      updateFormData={updateFormData}
    />
  ) : (
    <SecondStage
      formData={formData}
      updateFormData={updateFormData}
      handleBack={handleBack}
    />
  )
}

export default RegisterForm
