import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with a short delay
    setTimeout(() => {
      // For demo purposes, we'll accept any email
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleBackToLogin = () => {
    if (isSubmitted) {
      // Show a notification with the login credentials
      toast({
        title: "Test Credentials Reminder",
        description: "Admin: admin@gmail.com / admin123\nEmployee: emp@gmail.com / emp123",
      });
    }
    navigate('/login');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="space-y-1 bg-muted/50 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">Password Reset</CardTitle>
        <CardDescription className="text-center">
          {isSubmitted 
            ? "Check your email for reset instructions" 
            : "Enter your registered email address"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        {isSubmitted ? (
          <div className="space-y-6 text-center py-4">
            <div className="bg-green-50 rounded-full p-3 w-20 h-20 mx-auto flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Email Sent Successfully</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-semibold">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Please check your inbox and follow the instructions to reset your password.
                <br />If you don't see the email, check your spam folder.
                <br /><br />
                <b>For demo purposes, use these test credentials:</b>
                <br />Admin: admin@gmail.com / admin123
                <br />Employee: emp@gmail.com / emp123
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll send a password reset link to this email
              </p>
              <p className="text-xs text-orange-600 mt-2">
                <b>Demo info:</b> This is a demo version. Use admin@gmail.com/admin123 or emp@gmail.com/emp123 to login.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
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
  );
};

export { ForgotPasswordForm };
export default ForgotPasswordForm;