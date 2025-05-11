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
  ShieldCheck,
  Users,
  Settings as SettingsIcon,
  Mail,
  FileText
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    emailAlerts: true,
    employeeUpdates: true,
    documentsStatus: true,
    announcements: true
  });
  
  const [employeeSettings, setEmployeeSettings] = useState({
    newEmployeeAlert: true,
    documentVerificationAlert: true,
    leaveRequestsAlert: true
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
  
  const handleGeneralSettingToggle = (key: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated.",
    });
  };
  
  const handleEmployeeSettingToggle = (key: string) => {
    setEmployeeSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    
    toast({
      title: "Settings Saved",
      description: "Your employee settings have been updated.",
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
    <div className="max-w-6xl mx-auto space-y-6">      
      <Tabs defaultValue="account">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                Administrator Account Settings
              </CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
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
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Notification Settings */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-5 w-5 text-indigo-600" />
                  General Notifications
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
                      checked={generalSettings.emailAlerts}
                      onCheckedChange={() => handleGeneralSettingToggle('emailAlerts')}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Employee Updates</p>
                      <p className="text-xs text-gray-500">Get notified about employee profile changes</p>
                    </div>
                    <Switch
                      checked={generalSettings.employeeUpdates}
                      onCheckedChange={() => handleGeneralSettingToggle('employeeUpdates')}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Document Status</p>
                      <p className="text-xs text-gray-500">Updates on document verifications</p>
                    </div>
                    <Switch
                      checked={generalSettings.documentsStatus}
                      onCheckedChange={() => handleGeneralSettingToggle('documentsStatus')}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Announcements</p>
                      <p className="text-xs text-gray-500">Company-wide announcements</p>
                    </div>
                    <Switch
                      checked={generalSettings.announcements}
                      onCheckedChange={() => handleGeneralSettingToggle('announcements')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Employee-related Notification Settings */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Employee Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">New Employee Alerts</p>
                      <p className="text-xs text-gray-500">Get notified when new employees are added</p>
                    </div>
                    <Switch
                      checked={employeeSettings.newEmployeeAlert}
                      onCheckedChange={() => handleEmployeeSettingToggle('newEmployeeAlert')}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Document Verification</p>
                      <p className="text-xs text-gray-500">Get alerted when documents need verification</p>
                    </div>
                    <Switch
                      checked={employeeSettings.documentVerificationAlert}
                      onCheckedChange={() => handleEmployeeSettingToggle('documentVerificationAlert')}
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Leave Requests</p>
                      <p className="text-xs text-gray-500">Get notified about leave requests</p>
                    </div>
                    <Switch
                      checked={employeeSettings.leaveRequestsAlert}
                      onCheckedChange={() => handleEmployeeSettingToggle('leaveRequestsAlert')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <Monitor className="h-5 w-5 text-indigo-600" />
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
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="h-5 w-5 text-indigo-600" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium">Email Settings</h3>
                  </div>
                  <p className="text-xs text-gray-500 flex-grow">Configure system email servers and templates</p>
                  <Button variant="ghost" size="sm" className="mt-4 w-full justify-start">
                    Configure
                  </Button>
                </div>
                
                <div className="flex flex-col bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium">User Management</h3>
                  </div>
                  <p className="text-xs text-gray-500 flex-grow">Manage administrator accounts and permissions</p>
                  <Button variant="ghost" size="sm" className="mt-4 w-full justify-start">
                    Manage Users
                  </Button>
                </div>
                
                <div className="flex flex-col bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-medium">Data Management</h3>
                  </div>
                  <p className="text-xs text-gray-500 flex-grow">Database backup and restoration options</p>
                  <Button variant="ghost" size="sm" className="mt-4 w-full justify-start">
                    Manage Data
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button variant="destructive" onClick={handleLogout} className="h-9">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
