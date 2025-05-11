import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  // Check if user is already logged in
  const user = localStorage.getItem('ceitcs-user');
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-sidebar-gradient">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="text-center mb-8 font-nunito">
          <h1 className="text-4xl font-bold text-white">
            CeiTCS Employee Management System
          </h1>
          <p className="text-white text-opacity-80 mt-2">
            Login to access your Dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
