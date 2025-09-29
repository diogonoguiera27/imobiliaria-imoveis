import React from 'react';

import RegisterForm from '@/components/RegisterForm';
import LoginLayout from '@/components/LoginLayout';

const RegisterPage: React.FC = () => (
  <LoginLayout>
    <RegisterForm />
  </LoginLayout>
);

export default RegisterPage;
