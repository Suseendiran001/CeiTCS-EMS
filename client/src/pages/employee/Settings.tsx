import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  Lock, 
  LogOut,
  Bell, 
  Monitor, 
  Moon,
  Sun,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

const EmployeeSettings = () => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    leaveUpdates: true,
    documentsStatus: true,
    announcements: true
  });
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation don't match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Mock API call in development
      // In production this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleNotificationToggle = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    
    toast({
      title: "Settings Saved",
      description: "Your notification settings have been updated.",
    });
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    // In a real app, you would apply the theme to the document
    // and store user preference in localStorage
    
    toast({
      title: "Theme Changed",
      description: `Theme set to ${newTheme}.`,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('ceitcs-token');
    localStorage.removeItem('ceitcs-user');
    navigate('/login');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Password Settings */}
        <Card className="md:col-span-7">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-5 w-5 text-orange-600" />
              Password Settings
            </CardTitle>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="pt-4 pb-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    className="mt-1.5"
                  />
                </div>
              
                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    className="mt-1.5"
                  />
                </div>
              
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Password
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Notification Settings */}
        <Card className="md:col-span-5">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Alerts</p>
                  <p className="text-xs text-gray-500">Receive email notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.emailAlerts}
                  onCheckedChange={() => handleNotificationToggle('emailAlerts')}
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Leave Updates</p>
                  <p className="text-xs text-gray-500">Notifications about leave approvals</p>
                </div>
                <Switch
                  checked={notificationSettings.leaveUpdates}
                  onCheckedChange={() => handleNotificationToggle('leaveUpdates')}
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Document Status</p>
                  <p className="text-xs text-gray-500">Updates on document verifications</p>
                </div>
                <Switch
                  checked={notificationSettings.documentsStatus}
                  onCheckedChange={() => handleNotificationToggle('documentsStatus')}
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Announcements</p>
                  <p className="text-xs text-gray-500">Company-wide announcements</p>
                </div>
                <Switch
                  checked={notificationSettings.announcements}
                  onCheckedChange={() => handleNotificationToggle('announcements')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings & Logout */}
        <Card className="md:col-span-12">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor className="h-5 w-5 text-orange-600" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Theme Preference</p>
                <p className="text-xs text-gray-500">Choose how CeiTCS looks for you</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  className="flex items-center gap-1.5 h-9 px-3"
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun className="h-4 w-4" />
                  <span className="text-xs">Light</span>
                </Button>
                
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  className="flex items-center gap-1.5 h-9 px-3"
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon className="h-4 w-4" />
                  <span className="text-xs">Dark</span>
                </Button>
                
                <Button 
                  variant={theme === 'system' ? 'default' : 'outline'} 
                  className="flex items-center gap-1.5 h-9 px-3"
                  onClick={() => handleThemeChange('system')}
                >
                  <Monitor className="h-4 w-4" />
                  <span className="text-xs">System</span>
                </Button>
              </div>
              <div className="flex-shrink-0">
                <Button variant="destructive" onClick={handleLogout} className="h-9">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeSettings;