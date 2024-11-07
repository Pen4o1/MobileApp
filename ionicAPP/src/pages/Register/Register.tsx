import React, { useState } from 'react';
import FirstStage from '../../components/FirstStage';
import SecondStage from '../../components/SecondStage';

const RegisterForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleFirstStageSubmit = (data: { first_name: string; last_name: string; email: string; password: string; confirm_password: string }) => {
    setFormData(data);
    setIsSubmitted(true);
  };

  return (
    !isSubmitted ? 
      <FirstStage handleSubmit={handleFirstStageSubmit} /> : 
      <SecondStage {...formData} />
  );
};

export default RegisterForm;
