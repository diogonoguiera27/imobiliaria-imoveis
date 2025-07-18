import React from 'react';
import LoginLayout from '@/components/Login/LoginLayout';
import RegisterForm from '@/components/RegisterForm';

const RegisterPage: React.FC = () => (
  <LoginLayout>
    <RegisterForm />
  </LoginLayout>
);

export default RegisterPage;
