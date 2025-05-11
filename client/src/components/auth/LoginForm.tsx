// LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock, User, UserCog, Users, ChevronLeft } from 'lucide-react';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectRole = (role: 'admin' | 'employee') => {
    setSelectedRole(role);
  };
  
  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setCredentials({ email: '', password: '' });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Simplified login logic with hardcoded credentials
      let loginSuccess = false;
      let userData = {};
      
      if (selectedRole === 'admin' && credentials.email === 'admin@gmail.com' && credentials.password === 'admin123') {
        loginSuccess = true;
        userData = {
          id: 'admin-123',
          name: 'Admin User',
          email: 'admin@gmail.com',
          role: 'admin'
        };
      } else if (selectedRole === 'employee' && credentials.email === 'emp@gmail.com' && credentials.password === 'emp123') {
        loginSuccess = true;
        userData = {
          id: 'emp-123',
          name: 'Employee User',
          email: 'emp@gmail.com',
          role: 'employee'
        };
      }
      
      if (loginSuccess) {
        // Store user details in localStorage (simulate token)
        localStorage.setItem('ceitcs-token', 'dummy-token-' + selectedRole);
        localStorage.setItem('ceitcs-user', JSON.stringify(userData));
        
        // Redirect based on role - admin route is /dashboard (not /admin/dashboard)
        navigate(selectedRole === 'admin' ? '/dashboard' : '/employee/dashboard');
        toast({
          title: "Login Successful",
          description: `Welcome, ${selectedRole === 'admin' ? 'Admin' : 'Employee'}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please use the provided test credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full border-white border-[10px] shadow-xl overflow-hidden bg-white rounded-xl">
      {!selectedRole ? (
        // Role Selection View
        <div className="p-10">
          <CardHeader className="space-y-2 p-0 mb-8">
            <CardTitle className="text-2xl font-bold text-center">Choose Your Role</CardTitle>
            <CardDescription className="text-center text-base">
              Select your role to continue to the login screen
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 grid md:grid-cols-2 gap-8">
            <div 
              className="flex flex-col items-center p-8 rounded-lg hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 h-64"
              onClick={() => handleSelectRole('admin')}
            >
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6">
                <UserCog size={40} />
              </div>
              <div className="text-center flex-grow flex flex-col justify-center">
                <h3 className="font-semibold text-xl mb-2">Admin</h3>
                <p className="text-gray-500 text-base text-center h-12">Manage employee records</p>
              </div>
            </div>
            
            <div 
              className="flex flex-col items-center p-8 rounded-lg hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 bg-gradient-to-r from-orange-50 to-red-50 h-64"
              onClick={() => handleSelectRole('employee')}
            >
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white mb-6">
                <Users size={40} />
              </div>
              <div className="text-center flex-grow flex flex-col justify-center">
                <h3 className="font-semibold text-xl mb-2">Employee</h3>
                <p className="text-gray-500 text-base text-center h-12">View your details</p>
              </div>
            </div>
          </CardContent>
        </div>
      ) : (
        // Login Form View
        <div className="flex flex-col md:flex-row relative">
          {/* Back button moved to top of the form */}
          <button 
            onClick={handleBackToRoleSelection}
            className="absolute top-4 left-4 z-10 p-2 rounded-full transition-colors bg-white bg-opacity-30 text-gray-700 hover:bg-opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* Welcome Panel */}
          <div className={`p-10 text-white flex flex-col justify-center items-center md:w-1/2 animate-fade-in ${
            selectedRole === 'admin' 
              ? 'bg-gradient-to-br from-blue-600 to-indigo-700' 
              : 'bg-gradient-to-br from-orange-500 to-red-600'
          }`}>
            <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6">
              {selectedRole === 'admin' ? <UserCog size={48} /> : <Users size={48} />}
            </div>
            <h2 className="text-2xl font-bold mb-3">{selectedRole === 'admin' ? 'Admin Login' : 'Employee Login'}</h2>
            <p className="text-white text-opacity-80 text-center text-lg max-w-sm">
              {selectedRole === 'admin' 
                ? 'Admin: admin@gmail.com / admin123' 
                : 'Employee: emp@gmail.com / emp123'}
            </p>
          </div>
          
          {/* Login Form */}
          <div className="p-10 md:w-1/2 animate-fade-in">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={selectedRole === 'admin' ? 'admin@gmail.com' : 'emp@gmail.com'}
                      className="pl-10 border-gray-300 focus:ring focus:ring-opacity-50 focus:border-transparent transition-all py-6 text-base"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-base">Password</Label>
                    <Button 
                      variant="link" 
                      className={`p-0 h-auto text-base ${
                        selectedRole === 'admin' ? 'text-blue-600' : 'text-orange-600'
                      }`}
                      onClick={() => navigate('/forgot-password')}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={selectedRole === 'admin' ? 'admin123' : 'emp123'}
                      className="pl-10 border-gray-300 focus:ring focus:ring-opacity-50 focus:border-transparent transition-all py-6 text-base"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className={`w-full transition-all transform hover:-translate-y-1 hover:shadow-lg py-6 text-base ${
                    selectedRole === 'admin' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700' 
                      : 'bg-gradient-to-r from-orange-500 to-red-600'
                  }`} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LoginForm;
