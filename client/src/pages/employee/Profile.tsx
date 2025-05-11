import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Building, 
  Calendar,
  Clock,
  FileText,
  Upload,
  Loader2,
  PencilLine,
  UserCircle,
  Home,
  CreditCard,
  Send,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { getEmployeeProfile } from '@/services/employeeService';

const DisplayField = ({ label, value, placeholder = 'Not provided' }) => {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-gray-500">{label}</Label>
      <p className="font-medium text-gray-900">
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
      </p>
    </div>
  );
};

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<any>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState<boolean>(false);
  const [requestDetails, setRequestDetails] = useState({
    field: '',
    currentValue: '',
    newValue: '',
    reason: ''
  });
  
  useEffect(() => {
    async function fetchProfileData() {
      setLoading(true);
      try {
        const data = await getEmployeeProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfileData();
  }, []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "The profile photo must be less than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPEG, PNG, etc.).",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingPhoto(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({
          ...profile,
          profilePhotoUrl: reader.result as string
        });
        
        toast({
          title: "Profile Photo Updated",
          description: "Your request to update profile photo has been sent to admin for approval.",
        });
        
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload your profile photo. Please try again.",
        variant: "destructive"
      });
      setUploadingPhoto(false);
    }
  };
  
  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openUpdateRequestDialog = (fieldName: string, currentValue: string) => {
    setRequestDetails({
      field: fieldName,
      currentValue: currentValue || '',
      newValue: '',
      reason: ''
    });
    setIsRequestDialogOpen(true);
  };

  const handleSubmitUpdateRequest = async () => {
    // Validate request
    if (!requestDetails.newValue.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the new value you're requesting.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send to the backend
    try {
      toast({
        title: "Request Submitted",
        description: `Your request to update ${requestDetails.field} has been sent to HR for approval.`,
      });
      setIsRequestDialogOpen(false);
    } catch (error) {
      console.error('Error submitting update request:', error);
      toast({
        title: "Request Failed",
        description: "Failed to submit your update request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-500">Profile not found.</p>
        <Button 
          onClick={() => navigate('/employee/dashboard')}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1></h1>
        <Button onClick={() => navigate('/employee/profile/request')}>
          <Send className="h-4 w-4 mr-2" />
          Request Profile Update
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-4">
          <Card className="h-auto max-h-[420px] sticky top-4">
            <CardContent className="p-6 flex flex-col">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative mb-3">
                  <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                    {profile.profilePhotoUrl ? (
                      <AvatarImage src={profile.profilePhotoUrl} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-orange-100 text-orange-800 text-2xl">
                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {/* Photo upload dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 shadow-md"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Request Photo Change</span>
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Request Profile Photo Change</DialogTitle>
                        <DialogDescription>
                          Upload a new profile photo. Your request will be sent to HR for approval.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid w-full items-center gap-4 py-4">
                        <Input
                          id="picture"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                        />
                        <p className="text-xs text-gray-500">
                          Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => document.querySelector("[data-state=open] button[aria-label=Close]")?.dispatchEvent(new MouseEvent('click'))}
                        >
                          Cancel
                        </Button>
                        <Button 
                          disabled={uploadingPhoto}
                          onClick={() => document.querySelector("[data-state=open] button[aria-label=Close]")?.dispatchEvent(new MouseEvent('click'))}
                        >
                          {uploadingPhoto && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          {uploadingPhoto ? 'Submitting...' : 'Submit Request'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 gap-4 w-full text-sm overflow-y-auto pb-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate text-left" title={profile.email}>{profile.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-left">{profile.phone || 'No phone number'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-left">Joined: {formatDate(profile.dateOfJoin)}</span>
                </div>
              </div>
              
              <div className="w-full mt-auto pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/employee/settings')}
                >
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Tabs */}
        <Card className="lg:col-span-8">
          <CardContent className="p-0">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="address">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Address</span>
                </TabsTrigger>
                <TabsTrigger value="employment">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Employment</span>
                </TabsTrigger>
                <TabsTrigger value="bank">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Bank</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Personal Details */}
              <TabsContent value="personal" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-medium bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Personal Information</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DisplayField 
                    label="First Name" 
                    value={profile.firstName} 
                  />
                  
                  <DisplayField 
                    label="Last Name" 
                    value={profile.lastName} 
                  />
                
                  <DisplayField 
                    label="Date of Birth" 
                    value={formatDate(profile.dateOfBirth)} 
                  />
                  
                  <DisplayField 
                    label="Gender" 
                    value={profile.gender} 
                  />
                  
                  <DisplayField 
                    label="Marital Status" 
                    value={profile.maritalStatus} 
                  />
                  
                  <DisplayField 
                    label="Nationality" 
                    value={profile.nationality} 
                  />

                  <DisplayField 
                    label="Phone Number" 
                    value={profile.phone} 
                  />
                  
                  <DisplayField 
                    label="Personal Email" 
                    value={profile.personalEmail} 
                  />
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between gap-2 mb-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                          <Phone className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-medium bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Emergency Contact</h3>
                      </div>
                    </div>
                  </div>
                  
                  <DisplayField 
                    label="Emergency Contact Name" 
                    value={profile.emergencyContact?.name} 
                  />
                  
                  <DisplayField 
                    label="Relationship" 
                    value={profile.emergencyContact?.relationship} 
                  />
                  
                  <DisplayField 
                    label="Emergency Phone Number" 
                    value={profile.emergencyContact?.phoneNumber} 
                  />
                  
                  <div className="md:col-span-2">
                    <DisplayField 
                      label="Emergency Contact Address" 
                      value={profile.emergencyContact?.address} 
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-blue-800">
                          To update personal information, please submit a profile update request.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Address Tab */}
              <TabsContent value="address" className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                        <Home className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-medium bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Current Address</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <DisplayField 
                        label="Street Address" 
                        value={profile.currentAddress?.street} 
                      />
                    </div>
                    
                    <DisplayField 
                      label="City" 
                      value={profile.currentAddress?.city} 
                    />
                    
                    <DisplayField 
                      label="State/Province" 
                      value={profile.currentAddress?.state} 
                    />
                    
                    <DisplayField 
                      label="Postal/Zip Code" 
                      value={profile.currentAddress?.zipCode} 
                    />
                    
                    <DisplayField 
                      label="Country" 
                      value={profile.currentAddress?.country} 
                    />
                  </div>
                </div>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                
                {/* Permanent Address */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                        <Building className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-medium bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Permanent Address</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <DisplayField 
                        label="Street Address" 
                        value={profile.permanentAddress?.street} 
                      />
                    </div>
                    
                    <DisplayField 
                      label="City" 
                      value={profile.permanentAddress?.city} 
                    />
                    
                    <DisplayField 
                      label="State/Province" 
                      value={profile.permanentAddress?.state} 
                    />
                    
                    <DisplayField 
                      label="Postal/Zip Code" 
                      value={profile.permanentAddress?.zipCode} 
                    />
                    
                    <DisplayField 
                      label="Country" 
                      value={profile.permanentAddress?.country} 
                    />
                  </div>

                  <div className="mt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-blue-800">
                          To update address information, please submit a profile update request.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Employment Details */}
              <TabsContent value="employment" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-medium bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Employment Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Employee ID</Label>
                    <p className="font-medium text-gray-900">{profile.employeeId || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Employee Type</Label>
                    <p className="font-medium text-gray-900">{profile.employeeType || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Department</Label>
                    <p className="font-medium text-gray-900">{profile.department || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Position</Label>
                    <p className="font-medium text-gray-900">{profile.position || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Date of Joining</Label>
                    <p className="font-medium text-gray-900">{formatDate(profile.dateOfJoin) || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Status</Label>
                    <p className="font-medium text-gray-900">{profile.status || 'Active'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Work Email</Label>
                    <p className="font-medium text-gray-900">{profile.email || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Reporting Manager</Label>
                    <p className="font-medium text-gray-900">{profile.reportingManager || 'Not assigned'}</p>
                  </div>
                  
                  {profile.previousEmployment && (
                    <>
                      <div className="md:col-span-2 mt-6 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full">
                            <Clock className="h-5 w-5 text-gray-600" />
                          </div>
                          <h3 className="text-xl font-medium bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">Previous Employment</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Company Name</Label>
                        <p className="font-medium text-gray-900">{profile.previousEmployment.companyName || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Position Held</Label>
                        <p className="font-medium text-gray-900">{profile.previousEmployment.positionHeld || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Employment Period</Label>
                        <p className="font-medium text-gray-900">
                          {formatDate(profile.previousEmployment.employmentStartDate)} - {formatDate(profile.previousEmployment.employmentEndDate) || 'Present'}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-500">Reason for Leaving</Label>
                        <p className="font-medium text-gray-900">{profile.previousEmployment.reasonForLeaving || 'Not provided'}</p>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 mt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-blue-800">
                          To update employment information, please contact the HR department.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Bank Details */}
              <TabsContent value="bank" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-medium bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Bank Account Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Account Holder Name</Label>
                    <p className="font-medium text-gray-900">
                      {profile.bankDetails?.accountHolderName || profile.bankDetails?.accountName || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Bank Name</Label>
                    <p className="font-medium text-gray-900">
                      {profile.bankDetails?.bankName || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Account Number</Label>
                    <p className="font-medium text-gray-900">
                      {profile.bankDetails?.accountNumber || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">Branch Name</Label>
                    <p className="font-medium text-gray-900">
                      {profile.bankDetails?.branchName || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-500">IFSC Code</Label>
                    <p className="font-medium text-gray-900">
                      {profile.bankDetails?.ifscCode || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                      <p className="text-sm text-amber-800">
                        To update your bank information, please submit a request to the Finance or HR department.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Request Update Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Profile Update</DialogTitle>
            <DialogDescription>
              Submit a request to update your profile information. Your request will be reviewed by HR.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="field" className="text-right">
                Field
              </Label>
              <Input
                id="field"
                value={requestDetails.field}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-value" className="text-right">
                Current Value
              </Label>
              <Input
                id="current-value"
                value={requestDetails.currentValue}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-value" className="text-right">
                New Value
              </Label>
              <Input
                id="new-value"
                value={requestDetails.newValue}
                className="col-span-3"
                onChange={(e) => setRequestDetails({...requestDetails, newValue: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="reason"
                value={requestDetails.reason}
                className="col-span-3"
                onChange={(e) => setRequestDetails({...requestDetails, reason: e.target.value})}
                placeholder="Please provide a reason for this change"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitUpdateRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeProfile;