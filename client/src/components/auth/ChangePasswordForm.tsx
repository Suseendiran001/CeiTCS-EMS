import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ChangePasswordFormProps {
  isFirstLogin?: boolean;
  email: string;
  onPasswordChanged?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ 
  isFirstLogin = false, 
  email,
  onPasswordChanged
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      toast({
        title: "This is a demo version",
        description: "Password change functionality is disabled in this demo. Please use the provided test credentials: admin@gmail.com/admin123 or emp@gmail.com/emp123",
      });

      if (onPasswordChanged) {
        onPasswordChanged();
      }
      
      // After simulated password change
      if (isFirstLogin) {
        navigate('/employee/dashboard');
      } else {
        navigate('/login');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full border-white border-[10px] shadow-lg overflow-hidden bg-white rounded-xl">
      <div className="flex flex-col md:flex-row relative">
        {/* Back button */}
        {!isFirstLogin && (
          <button 
            onClick={() => navigate('/login')}
            className="absolute top-4 left-4 z-10 p-2 rounded-full transition-colors bg-white bg-opacity-30 text-gray-700 hover:bg-opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        {/* Welcome Panel */}
        <div className="py-6 px-8 text-white flex flex-col justify-center items-center md:w-1/2 animate-fade-in bg-gradient-to-br from-orange-500 to-red-600">
          <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-3">
            <Key size={30} />
          </div>
          <h2 className="text-xl font-bold mb-1">
            {isFirstLogin ? "Set Your Password" : "Change Your Password"}
          </h2>
          <p className="text-white text-opacity-80 text-center text-sm max-w-xs">
            {isFirstLogin 
              ? "Please set a new password for your account" 
              : "Update your account password for security"}
          </p>
          <p className="text-white text-opacity-80 text-center text-sm max-w-xs mt-4">
            <strong>Demo Info:</strong><br />
            Admin: admin@gmail.com / admin123<br />
            Employee: emp@gmail.com / emp123
          </p>
        </div>
        
        {/* Password Form */}
        <div className="py-6 px-7 md:w-1/2 animate-fade-in">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold">
              {isFirstLogin ? "Create New Password" : "Change Password"}
            </CardTitle>
            <CardDescription className="text-sm">
              {isFirstLogin 
                ? "Set a strong password for your account" 
                : "Update your account with a new password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current-password" className="text-sm">
                  {isFirstLogin ? "Temporary Password" : "Current Password"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="current-password"
                    type="password"
                    placeholder={isFirstLogin ? "Enter temporary password" : "Enter current password"}
                    className="pl-10 border-gray-300 focus:ring focus:ring-opacity-50 focus:border-transparent transition-all py-4 text-sm h-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="new-password" className="text-sm">New Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10 border-gray-300 focus:ring focus:ring-opacity-50 focus:border-transparent transition-all py-4 text-sm h-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="confirm-password" className="text-sm">Confirm New Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10 border-gray-300 focus:ring focus:ring-opacity-50 focus:border-transparent transition-all py-4 text-sm h-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full transition-all transform hover:-translate-y-1 hover:shadow-md py-4 text-sm bg-gradient-to-r from-orange-500 to-red-600 h-10 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : (
                  isFirstLogin ? "Set Password" : "Change Password"
                )}
              </Button>
            </form>
          </CardContent>
          
          {!isFirstLogin && (
            <CardFooter className="flex justify-center p-0 pt-3">
              <Button 
                variant="link" 
                onClick={() => navigate('/forgot-password')}
                className="flex items-center gap-1 text-xs text-orange-600 p-0 h-auto"
              >
                Forgot your password?
              </Button>
            </CardFooter>
          )}
          
          {isFirstLogin && (
            <CardFooter className="flex justify-center p-0 pt-3">
              <p className="text-xs text-center text-gray-500">
                This is a demo. Use admin@gmail.com/admin123 or emp@gmail.com/emp123
              </p>
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChangePasswordForm;