import React from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-sidebar-gradient">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="text-center mb-8 font-nunito">
          <h1 className="text-4xl font-bold text-white">
            CeiTCS Employee Management System
          </h1>
          <p className="text-white text-opacity-80 mt-2">
            Password Recovery
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;