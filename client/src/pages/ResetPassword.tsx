import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Key, Check, ArrowLeft } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
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

    // Simulate API call with timeout instead of actually connecting to backend
    setTimeout(() => {
      setIsComplete(true);
      toast({
        title: "Demo Mode",
        description: "This is a demo version. Password reset functionality is disabled. Please use admin@gmail.com/admin123 or emp@gmail.com/emp123 to login.",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLogin = () => {
    toast({
      title: "Test Credentials Reminder",
      description: "Admin: admin@gmail.com / admin123\nEmployee: emp@gmail.com / emp123",
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-sidebar-gradient">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="text-center mb-8 font-nunito">
          <h1 className="text-4xl font-bold text-white">
            CeiTCS Employee Management System
          </h1>
          <p className="text-white text-opacity-80 mt-2">
            Password Reset
          </p>
        </div>
        <Card className="w-full max-w-md mx-auto shadow-lg border-0">
          <CardHeader className="space-y-1 bg-muted/50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              {isComplete 
                ? "Your password has been successfully reset"
                : "Create a new secure password for your account"}
            </CardDescription>
            {!isComplete && (
              <CardDescription className="text-center text-orange-500 mt-2">
                <strong>Demo Info:</strong> Use admin@gmail.com/admin123 or emp@gmail.com/emp123
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            {isComplete ? (
              <div className="space-y-6 text-center py-4">
                <div className="bg-green-50 rounded-full p-3 w-20 h-20 mx-auto flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Password Reset Complete</h3>
                  <p className="text-muted-foreground">
                    Your password has been successfully changed
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    You can now log in with your new password
                  </p>
                  <p className="text-sm font-medium text-orange-600 mt-4">
                    Since this is a demo, please use:<br />
                    Admin: admin@gmail.com / admin123<br />
                    Employee: emp@gmail.com / emp123
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <label htmlFor="new-password" className="text-sm font-medium block">
                    New Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      className="pl-10 h-11"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="confirm-password" className="text-sm font-medium block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10 h-11"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4 bg-muted/20">
            <Button 
              variant="ghost" 
              onClick={handleBackToLogin}
              className="flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;