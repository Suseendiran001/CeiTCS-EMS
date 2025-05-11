// ProfileCompletion.tsx - Component that guides employees through completing their profile when they log in with a temporary password for the first time

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import DocumentUploader from "@/components/common/DocumentUploader";
import { updateEmployeeProfile, uploadDocument, uploadEmployeeDocument } from '@/services/employeeService';
import { 
  Check, Loader2, UserCircle, Phone, Mail, Home, 
  CreditCard, Upload, MapPin, Calendar, FileText, Plus, X, AlertCircle, Fingerprint, ChevronLeft, ChevronRight, InfoIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

// Define validation schema for personal information form
const personalInfoSchema = z.object({
  // Removed firstName and lastName as these are filled by admin
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  nationality: z.string().min(1, "Nationality is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  // Removed personalEmail as it is filled by admin
});

// Define validation schema for address information form
const addressSchema = z.object({
  currentAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  permanentAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  sameAsCurrentAddress: z.boolean().optional(),
});

// Define validation schema for emergency contact form
const emergencyContactSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
});

// Define validation schema for government ID form
const governmentIDSchema = z.object({
  aadharNumber: z.string().min(12, "Valid Aadhar number is required"),
  panNumber: z.string().min(10, "Valid PAN number is required"),
  passportNumber: z.string().optional(),
});

// Define validation schema for educational qualifications form
const educationalQualificationsSchema = z.object({
  undergraduate: z.object({
    degreeName: z.string().min(1, "Degree name is required"),
    university: z.string().min(1, "University/Institution name is required"),
    yearOfCompletion: z.string().min(1, "Year of completion is required"),
    percentageOrGrade: z.string().min(1, "Percentage/Grade is required"),
  }),
  postgraduate: z.object({
    degreeName: z.string().optional(),
    university: z.string().optional(),
    yearOfCompletion: z.string().optional(),
    percentageOrGrade: z.string().optional(),
  }).optional(),
  additionalCertifications: z.array(
    z.object({
      name: z.string().min(1, "Certificate name is required"),
      issuingAuthority: z.string().min(1, "Issuing authority is required"),
      year: z.string().min(1, "Year is required"),
      certificateType: z.string().min(1, "Certificate type is required"),
    })
  ).optional(),
});

// Define validation schema for bank details form
const bankDetailsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(8, "Valid account number is required"),
  ifscCode: z.string().min(11, "Valid IFSC code is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
});

// Main component
const ProfileCompletion = () => {
  const [step, setStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState<boolean>(false);
  const [certifications, setCertifications] = useState<{id: string, name: string, issuingAuthority: string, year: string, certificateType: string}[]>([
    { id: '1', name: '', issuingAuthority: '', year: '', certificateType: '' }
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add a certification
  const addCertification = () => {
    setCertifications(prev => [
      ...prev, 
      { 
        id: `cert-${Date.now()}`, 
        name: '', 
        issuingAuthority: '', 
        year: '', 
        certificateType: '' 
      }
    ]);
    toast({
      title: "Certificate Added",
      description: "A new certificate form has been added.",
    });
  };

  // Remove a certification
  const removeCertification = (id: string) => {
    if (certifications.length > 1) {
      setCertifications(prev => prev.filter(cert => cert.id !== id));
      toast({
        title: "Certificate Removed",
        description: "The certificate has been removed.",
      });
    }
  };

  // Update certification data
  const updateCertification = (id: string, field: string, value: string) => {
    setCertifications(prev => 
      prev.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  // Handle document upload
  const handleDocumentUpload = async (documentType: string, file: File, documentName: string) => {
    try {
      setIsSubmitting(true);
      // Upload document and add it to the employee's documents collection
      await uploadEmployeeDocument(file);
      
      // Create a new document entry that will appear in My Documents
      const newDocument = {
        name: documentName,
        type: documentType,
        description: `${documentName} uploaded during profile completion`,
        status: 'Pending',
        uploadDate: new Date().toISOString(),
      };
      
      // Update employee document collection
      await updateEmployeeProfile('documents', [newDocument]);
      
      toast({
        title: "Document Uploaded",
        description: `Your ${documentName} has been uploaded successfully and will appear in My Documents section.`,
      });
      return true;
    } catch (error) {
      console.error(`Error uploading ${documentName}:`, error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload your ${documentName}. Please try again.`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Personal Information form
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      nationality: "",
      phone: "",
    },
  });

  // Address form
  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      currentAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      permanentAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      sameAsCurrentAddress: false,
    },
  });

  // Emergency Contact form
  const emergencyContactForm = useForm<z.infer<typeof emergencyContactSchema>>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phoneNumber: "",
      address: "",
    },
  });

  // Government ID form
  const governmentIDForm = useForm<z.infer<typeof governmentIDSchema>>({
    resolver: zodResolver(governmentIDSchema),
    defaultValues: {
      aadharNumber: "",
      panNumber: "",
      passportNumber: "",
    },
  });

  // Educational Qualifications form
  const educationalQualificationsForm = useForm<z.infer<typeof educationalQualificationsSchema>>({
    resolver: zodResolver(educationalQualificationsSchema),
    defaultValues: {
      undergraduate: {
        degreeName: "",
        university: "",
        yearOfCompletion: "",
        percentageOrGrade: "",
      },
      postgraduate: {
        degreeName: "",
        university: "",
        yearOfCompletion: "",
        percentageOrGrade: "",
      },
      additionalCertifications: []
    },
  });

  // Bank Details form
  const bankDetailsForm = useForm<z.infer<typeof bankDetailsSchema>>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
    },
  });

  // Handle profile photo upload
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
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result as string);
        clearInterval(interval);
        setUploadProgress(100);
        
        // Send to server (would be actual API call in production)
        try {
          uploadDocument('profilePhoto', file)
            .then(() => {
              toast({
                title: "Photo Uploaded",
                description: "Your profile photo has been uploaded successfully.",
              });
              setUploadingPhoto(false);
            })
            .catch(error => {
              console.error('Error during photo upload:', error);
              toast({
                title: "Upload Failed",
                description: "Failed to save your profile photo. Please try again.",
                variant: "destructive"
              });
              setUploadingPhoto(false);
            });
        } catch (error) {
          console.error('Error during photo upload:', error);
          setUploadingPhoto(false);
        }
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

  // Handle permanent address same as current
  const handleSameAsCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSameAsCurrentAddress(checked);
    
    if (checked) {
      const currentAddress = addressForm.getValues('currentAddress');
      addressForm.setValue('permanentAddress', { ...currentAddress });
    }
  };

  // Handle form submissions for each step
  const onSubmitPersonalInfo = async (data: z.infer<typeof personalInfoSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call to save the data
      await updateEmployeeProfile('personalInfo', data);
      toast({
        title: "Personal Information Saved",
        description: "Your personal information has been saved successfully.",
      });
      setStep(1); // Move to next step (address)
    } catch (error) {
      console.error('Error saving personal information:', error);
      toast({
        title: "Error",
        description: "Failed to save your personal information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitAddress = async (data: z.infer<typeof addressSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call to save the data
      await updateEmployeeProfile('addresses', {
        currentAddress: data.currentAddress,
        permanentAddress: data.permanentAddress
      });
      toast({
        title: "Address Information Saved",
        description: "Your address information has been saved successfully.",
      });
      setStep(2); // Move to next step (emergency contact)
    } catch (error) {
      console.error('Error saving address information:', error);
      toast({
        title: "Error",
        description: "Failed to save your address information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEmergencyContact = async (data: z.infer<typeof emergencyContactSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call to save the data
      await updateEmployeeProfile('emergencyContact', data);
      toast({
        title: "Emergency Contact Saved",
        description: "Your emergency contact information has been saved successfully.",
      });
      setStep(3); // Move to next step (government IDs)
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      toast({
        title: "Error",
        description: "Failed to save your emergency contact information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitGovernmentID = async (data: z.infer<typeof governmentIDSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call to save the data
      await updateEmployeeProfile('governmentId', data);
      toast({
        title: "Government IDs Saved",
        description: "Your government ID information has been saved successfully.",
      });
      setStep(4); // Move to next step (educational qualifications)
    } catch (error) {
      console.error('Error saving government IDs:', error);
      toast({
        title: "Error",
        description: "Failed to save your government ID information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission for educational qualifications
  const onSubmitEducationalQualifications = async (data: z.infer<typeof educationalQualificationsSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call to save the data
      await updateEmployeeProfile('educationalQualifications', data);
      toast({
        title: "Educational Qualifications Saved",
        description: "Your educational information has been saved successfully.",
      });
      setStep(5); // Move to next step (bank details)
    } catch (error) {
      console.error('Error saving educational qualifications:', error);
      toast({
        title: "Error",
        description: "Failed to save your educational qualifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitBankDetails = async (data: z.infer<typeof bankDetailsSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call to save the data
      await updateEmployeeProfile('bankDetails', data);
      toast({
        title: "Bank Details Saved",
        description: "Your bank information has been saved successfully.",
      });
      setStep(6); // Move to completion step
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast({
        title: "Error",
        description: "Failed to save your bank details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    // Navigate to employee dashboard
    toast({
      title: "Profile Setup Complete",
      description: "Welcome to CeiTCS! Your profile has been set up successfully.",
    });
    navigate('/employee/dashboard');
  };

  // Step titles and descriptions
  const stepInfo = [
    { title: "Personal Information", description: "Please provide your basic personal information" },
    { title: "Address Information", description: "Please provide your current and permanent addresses" },
    { title: "Emergency Contact", description: "Please provide emergency contact information" },
    { title: "Government IDs", description: "Please provide your government ID information" },
    { title: "Educational Qualifications", description: "Please provide your educational background" },
    { title: "Bank Details", description: "Please provide your bank account information for salary deposits" },
    { title: "Profile Complete", description: "Your profile setup is complete" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <Card className="border-0 shadow-lg overflow-hidden mb-6">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription className="text-white opacity-90 text-base">
              First-time setup: Please complete your employee profile to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Progress Steps */}
            <div className="bg-white pt-6 px-6">
              <div className="flex justify-between mb-6">
                {stepInfo.map((s, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col items-center space-y-2"
                    style={{ width: `${100 / stepInfo.length}%` }}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium 
                      ${step > i 
                        ? "bg-green-100 text-green-700 border-2 border-green-500" 
                        : step === i 
                        ? "bg-orange-100 text-orange-700 border-2 border-orange-500" 
                        : "bg-gray-100 text-gray-400 border-2 border-gray-200"}`}
                    >
                      {step > i ? <Check className="h-5 w-5" /> : i + 1}
                    </div>
                    <div className="text-xs text-center font-medium truncate w-full px-1">
                      {s.title}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 h-1 mb-6">
                <div 
                  className="bg-orange-500 h-1 transition-all duration-500"
                  style={{ width: `${(step / (stepInfo.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <div className="px-6 pb-6">
              {/* Step 1: Personal Information */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center py-6">
                    <div className="relative group">
                      <Avatar className="h-28 w-28 border-2 border-white shadow-lg">
                        {profilePhoto ? (
                          <AvatarImage src={profilePhoto} className="object-cover" />
                        ) : (
                          <AvatarFallback className="bg-orange-100 text-orange-800 text-4xl">
                            <UserCircle className="h-12 w-12" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label 
                          htmlFor="profile-photo"
                          className="w-full h-full rounded-full flex items-center justify-center bg-black bg-opacity-50 cursor-pointer text-white"
                        >
                          <Upload className="h-6 w-6" />
                          <span className="sr-only">Upload Photo</span>
                        </label>
                        <input 
                          id="profile-photo" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                        />
                      </div>
                      
                      {uploadingPhoto && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <svg className="w-12 h-12" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeDasharray={`${uploadProgress}, 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  {uploadingPhoto && (
                    <p className="text-center text-sm text-gray-500">Uploading profile photo...</p>
                  )}
                  <Form {...personalInfoForm}>
                    <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={personalInfoForm.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="maritalStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marital Status</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select marital status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Single">Single</SelectItem>
                                  <SelectItem value="Married">Married</SelectItem>
                                  <SelectItem value="Divorced">Divorced</SelectItem>
                                  <SelectItem value="Widowed">Widowed</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nationality</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your nationality" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : "Continue to Address"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {/* Step 2: Address Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onSubmitAddress)} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Home className="mr-2 h-5 w-5 text-orange-500" />
                          Current Address
                        </h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <FormField
                              control={addressForm.control}
                              name="currentAddress.street"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Street Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your street address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={addressForm.control}
                            name="currentAddress.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="currentAddress.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your state" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="currentAddress.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal/Zip Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter zip code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="currentAddress.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sameAsCurrentAddress"
                          checked={sameAsCurrentAddress}
                          onChange={handleSameAsCurrentChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="sameAsCurrentAddress" className="text-sm font-medium text-gray-700">
                          Permanent address is same as current address
                        </label>
                      </div>

                      {!sameAsCurrentAddress && (
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <MapPin className="mr-2 h-5 w-5 text-orange-500" />
                            Permanent Address
                          </h3>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <FormField
                                control={addressForm.control}
                                name="permanentAddress.street"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter your street address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={addressForm.control}
                              name="permanentAddress.city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your city" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="permanentAddress.state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State/Province</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your state" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="permanentAddress.zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postal/Zip Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter zip code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="permanentAddress.country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your country" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-4 flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(0)}>
                          Back
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : "Continue to Emergency Contact"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {/* Step 3: Emergency Contact */}
              {step === 2 && (
                <div className="space-y-6">
                  <Form {...emergencyContactForm}>
                    <form onSubmit={emergencyContactForm.handleSubmit(onSubmitEmergencyContact)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <FormField
                            control={emergencyContactForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter emergency contact name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={emergencyContactForm.control}
                          name="relationship"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g. Spouse, Parent, Sibling" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={emergencyContactForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter emergency contact phone" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-2">
                          <FormField
                            control={emergencyContactForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter emergency contact address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="pt-4 flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : "Continue to Government IDs"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {/* Step 4: Identity Documents */}
              {step === 3 && (
                <div className="space-y-6">
                  <Form {...governmentIDForm}>
                    <form onSubmit={governmentIDForm.handleSubmit(onSubmitGovernmentID)} className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-6 w-6 text-orange-500" />
                        <h3 className="text-xl font-semibold text-gray-900">Identity Documents</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6 pl-8">
                        Please provide your government ID information and upload scanned copies for verification.
                      </p>
                      
                      {/* ID Information and Document Upload in Card Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Section - ID Information (smaller width) */}
                        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                          <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                            <Fingerprint className="h-4 w-4 mr-2 text-orange-500" />
                            ID Information
                          </h4>
                          
                          <div className="space-y-4">
                            <FormField
                              control={governmentIDForm.control}
                              name="aadharNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-medium">Aadhar Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter 12-digit Aadhar number" {...field} 
                                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" />
                                  </FormControl>
                                  <FormDescription className="text-xs text-gray-500">
                                    12-digit government ID number
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={governmentIDForm.control}
                              name="panNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-medium">PAN Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter 10-character PAN" {...field} 
                                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" />
                                  </FormControl>
                                  <FormDescription className="text-xs text-gray-500">
                                    10-character Permanent Account Number
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={governmentIDForm.control}
                              name="passportNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-medium">Passport Number <span className="text-gray-500 font-normal">(Optional)</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter passport number if available" {...field} 
                                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" />
                                  </FormControl>
                                  <FormDescription className="text-xs text-gray-500">
                                    Required for international travel
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        {/* Right Section - Document Uploads (larger width) */}
                        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                          <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                            <Upload className="h-4 w-4 mr-2 text-orange-500" />
                            Document Uploads
                          </h4>
                          
                          <div className="space-y-5">
                            <div className="rounded-md bg-gray-50 p-4 border border-gray-100">
                              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <CreditCard className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                                Aadhar Card
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DocumentUploader 
                                  label="Front Side"
                                  id="aadhar-front-upload"
                                  onUpload={(file) => {
                                    handleDocumentUpload('identification', file, 'Aadhar Card (Front)');
                                  }}
                                  description="Front side scan (max. 5MB)"
                                  compact={true}
                                />
                                <DocumentUploader 
                                  label="Back Side"
                                  id="aadhar-back-upload"
                                  onUpload={(file) => {
                                    handleDocumentUpload('identification', file, 'Aadhar Card (Back)');
                                  }}
                                  description="Back side scan (max. 5MB)"
                                  compact={true}
                                />
                              </div>
                            </div>
                            
                            <div className="rounded-md bg-gray-50 p-4 border border-gray-100">
                              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <CreditCard className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                                PAN Card
                              </h5>
                              <DocumentUploader 
                                label="PAN Card Scan"
                                id="pan-upload"
                                onUpload={(file) => {
                                  handleDocumentUpload('identification', file, 'PAN Card');
                                }}
                                description="Clear image of PAN card (max. 5MB)"
                              />
                            </div>
                            
                            <div className="rounded-md bg-gray-50 p-4 border border-gray-100">
                              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <CreditCard className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                                Passport <span className="text-xs font-normal text-gray-500">(Optional)</span>
                              </h5>
                              <DocumentUploader 
                                label="Passport Scan"
                                id="passport-upload"
                                onUpload={(file) => {
                                  handleDocumentUpload('identification', file, 'Passport');
                                }}
                                description="First and last page (max. 5MB)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Information Alert */}
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <InfoIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Document Verification</h3>
                            <div className="mt-1 text-sm text-blue-700">
                              <p>All uploaded documents will be verified by the HR department. Please ensure scans are clear and all information is legible.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(2)}>
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : "Continue to Educational Qualifications"}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {/* Step 5: Educational Qualifications */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-500" />
                    Educational Qualifications
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Please provide details about your educational background and upload your certificates.
                  </p>
                  
                  <Form {...educationalQualificationsForm}>
                    <form onSubmit={educationalQualificationsForm.handleSubmit(onSubmitEducationalQualifications)} className="space-y-6">
                      <Tabs defaultValue="undergraduate" className="w-full">
                        <TabsList className="mb-4 w-full bg-gray-100">
                          <TabsTrigger value="undergraduate" className="flex-1">Undergraduate</TabsTrigger>
                          <TabsTrigger value="postgraduate" className="flex-1">Postgraduate</TabsTrigger>
                          <TabsTrigger value="certifications" className="flex-1">Additional Certifications</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="undergraduate" className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <h4 className="text-md font-medium text-gray-700 mb-4">Undergraduate Details</h4>
                            </div>
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="undergraduate.degreeName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Degree Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. Bachelor of Engineering" 
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>Enter your complete degree name</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="undergraduate.university"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>University/Institution</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. Delhi University" 
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>Enter your university or college name</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="undergraduate.yearOfCompletion"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year of Completion</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. 2019"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="undergraduate.percentageOrGrade"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Percentage/CGPA</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. 85% or 8.5 CGPA"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="postgraduate" className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <h4 className="text-md font-medium text-gray-700 mb-4">Postgraduate Details (Optional)</h4>
                            </div>
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="postgraduate.degreeName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Degree Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. Master of Technology" 
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>Enter your complete degree name</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="postgraduate.university"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>University/Institution</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. IIT Delhi" 
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>Enter your university or college name</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="postgraduate.yearOfCompletion"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year of Completion</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. 2021"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationalQualificationsForm.control}
                              name="postgraduate.percentageOrGrade"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Percentage/CGPA</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. 85% or 8.5 CGPA"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="certifications" className="space-y-6">
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="text-md font-medium text-gray-700">Additional Certifications</h4>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                                onClick={addCertification}
                                type="button"
                              >
                                <Plus className="h-4 w-4" /> Add More
                              </Button>
                            </div>
                            
                            {certifications.map((cert, index) => (
                              <div key={cert.id} className="border border-gray-200 rounded-md p-4 bg-white">
                                {index > 0 && (
                                  <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-sm font-medium text-gray-700">Certificate {index + 1}</h5>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                                      onClick={() => removeCertification(cert.id)}
                                      type="button"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`cert-${cert.id}-name`}>Certificate Name</Label>
                                    <Input 
                                      id={`cert-${cert.id}-name`} 
                                      placeholder="e.g. AWS Certified Developer"
                                      className="mt-1"
                                      value={cert.name}
                                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`cert-${cert.id}-issuer`}>Issuing Authority</Label>
                                    <Input 
                                      id={`cert-${cert.id}-issuer`} 
                                      placeholder="e.g. Amazon Web Services"
                                      className="mt-1"
                                      value={cert.issuingAuthority}
                                      onChange={(e) => updateCertification(cert.id, 'issuingAuthority', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`cert-${cert.id}-year`}>Year</Label>
                                    <Input 
                                      id={`cert-${cert.id}-year`} 
                                      placeholder="e.g. 2022"
                                      className="mt-1"
                                      value={cert.year}
                                      onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`cert-${cert.id}-type`}>Certificate Type</Label>
                                    <Select
                                      onValueChange={(value) => updateCertification(cert.id, 'certificateType', value)}
                                      value={cert.certificateType}
                                    >
                                      <SelectTrigger id={`cert-${cert.id}-type`} className="mt-1">
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="technical">Technical</SelectItem>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="academic">Academic</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <DocumentUploader 
                                    label="Certificate"
                                    id={`cert-${cert.id}-upload`}
                                    onUpload={(file) => {
                                      handleDocumentUpload('education', file, `${cert.name} Certificate`);
                                    }}
                                    description="PDF or image of your certificate (max. 5MB)"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="pt-6 flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(3)}>
                          Back
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : "Continue to Bank Details"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {/* Step 6: Bank Details */}
              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-orange-500" />
                    Bank Account Details
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Please provide your bank account details for salary deposits and reimbursements.
                  </p>
                  
                  <Form {...bankDetailsForm}>
                    <form onSubmit={bankDetailsForm.handleSubmit(onSubmitBankDetails)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={bankDetailsForm.control}
                          name="accountHolderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Holder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account holder name" {...field} />
                              </FormControl>
                              <FormDescription>
                                Name as it appears on your bank account
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bankDetailsForm.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter bank name" {...field} />
                              </FormControl>
                              <FormDescription>
                                Full name of your bank (e.g., State Bank of India)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bankDetailsForm.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your complete bank account number
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bankDetailsForm.control}
                          name="ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IFSC Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter IFSC code" {...field} />
                              </FormControl>
                              <FormDescription>
                                11-character bank branch identification code
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mt-6">
                        <div className="flex items-start space-x-3">
                          <div className="text-yellow-500 mt-0.5">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Please ensure all bank details are accurate. Incorrect information may lead to delays in salary processing. 
                              Your bank details are securely stored and used only for official financial transactions.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(4)}>
                          Back
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : "Complete Profile"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {/* Step 7: Completion */}
              {step === 6 && (
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Setup Complete!</h3>
                  <p className="text-gray-500 mb-8 max-w-md">
                    Thank you for completing your profile. You can now access the employee dashboard and all system features.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
                    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-center shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <UserCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">Personal Details</h4>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-center shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">Documents</h4>
                      <p className="text-xs text-gray-500">Uploaded Successfully</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-center shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                        <CreditCard className="h-5 w-5 text-orange-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">Bank Details</h4>
                      <p className="text-xs text-gray-500">Saved Successfully</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 max-w-md">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your documents will be verified by the HR department. You'll receive notification once the verification is complete.
                    </p>
                  </div>
                  
                  <Button onClick={handleComplete} size="lg" className="px-8">
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletion;