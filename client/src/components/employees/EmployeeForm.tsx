// EmployeeForm.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, Check, Info, User, Briefcase, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createEmployee } from '@/services/employeeService';
import { DEPARTMENTS } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

// Add this import at the top for the animation
import { motion, AnimatePresence } from "framer-motion";

// Create schema for the admin form (simplified version)
const employeeFormSchema = z.object({
  // Basic Information
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  
  // Employment Details
  employeeType: z.enum(["Permanent", "Contract", "Internship"]),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(2, "Position/Title is required"),
  dateOfJoin: z.string().min(1, "Date of join is required"),
  
  // Salary Information
  salary: z.object({
    basic: z.coerce.number().min(0, "Cannot be negative"),
    hra: z.coerce.number().min(0, "Cannot be negative"),
    da: z.coerce.number().min(0, "Cannot be negative"),
    ta: z.coerce.number().min(0, "Cannot be negative"),
    otherAllowances: z.coerce.number().min(0, "Cannot be negative"),
  }),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

const defaultValues: Partial<EmployeeFormValues> = {
  name: "",
  email: "",
  employeeType: "Permanent",
  department: "",
  position: "",
  dateOfJoin: new Date().toISOString().split('T')[0],
  salary: {
    basic: 0,
    hra: 0,
    da: 0,
    ta: 0,
    otherAllowances: 0,
  },
};

// Form steps with icons
const STEPS = [
  { id: "basic", label: "Basic Info", icon: <User size={18} /> },
  { id: "employment", label: "Employment", icon: <Briefcase size={18} /> },
  { id: "salary", label: "Salary", icon: <DollarSign size={18} /> },
  { id: "review", label: "Review", icon: <Check size={18} /> },
];

const EmployeeForm = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  // Watch fields for conditional rendering
  const employeeType = form.watch("employeeType");
  
  // Effect to reset form after success animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        form.reset(defaultValues);
        setStep(0);
        // Ensure isSubmitting is reset to false
        setIsSubmitting(false);
        // Scroll to top when resetting the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 5000); // Reduced timeout from 500ms to 250ms for faster reset
    }
    return () => clearTimeout(timer);
  }, [showSuccess, form]);
  
  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const onSubmit = async (data: z.infer<typeof employeeFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData object for the API call
      const formData = new FormData();
      
      // Split full name into first and last name
      const nameParts = data.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || ' ';  // Ensure lastName is not empty
      
      // Add basic info - ensure all required fields are present
      formData.append("firstName", firstName);
      formData.append("lastName", lastName || ' '); // Provide a space if lastName is empty
      formData.append("email", data.email);
      formData.append("employeeType", data.employeeType);
      formData.append("department", data.department);
      formData.append("position", data.position);
      formData.append("dateOfJoin", data.dateOfJoin);
      
      // Create a salary object and append as a string
      const salaryData = {
        basic: Number(data.salary.basic) || 0,
        hra: Number(data.salary.hra) || 0,
        da: Number(data.salary.da) || 0,
        ta: Number(data.salary.ta) || 0,
        otherAllowances: Number(data.salary.otherAllowances) || 0
      };
      
      formData.append("salary", JSON.stringify(salaryData));
      
      console.log("Form data being sent:", {
        firstName,
        lastName,
        email: data.email,
        employeeType: data.employeeType,
        department: data.department,
        position: data.position,
        dateOfJoin: data.dateOfJoin,
        salary: salaryData
      });
      
      // Call API to create new employee with basic details
      const response = await createEmployee(formData);
      
      toast({
        title: "Employee Registration Successful",
        description: `Employee ID ${response.employeeId}. A temporary password has been sent to ${data.email}`,
      });
      
      // Show success animation
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      // Reset isSubmitting state on error
      setIsSubmitting(false);
      
      // More specific error handling
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast({
          title: "Submission Error",
          description: error.response.data.error || "Failed to create employee",
          variant: "destructive"
        });
      } else if (error.message && error.message.includes("already exists")) {
        toast({
          title: "Email Already Registered",
          description: "An employee with this email address already exists in the system.",
          variant: "destructive"
        });
        setStep(0);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit form. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      // Add a finally block to ensure isSubmitting is always reset
      // This is important for cases where the request is interrupted or times out
      if (!showSuccess) {
        setIsSubmitting(false);
      }
    }
  };
  
  // Render form steps
  const renderStep = () => {
    switch (step) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-6 items-start">
              {/* Basic Info Fields */}
              <div className="w-full space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee's full name" {...field} className="bg-gray-50 border-gray-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="employee@example.com" {...field} className="bg-gray-50 border-gray-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 1: // Employment Details
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-company-primary">Employment Details</h3>
              
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="employeeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Type*</FormLabel>
                      <div className="grid grid-cols-3 gap-3">
                        <div 
                          className={`border rounded-md p-4 text-center cursor-pointer transition-all ${field.value === 'Permanent' ? 'border-company-primary bg-company-light shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                          onClick={() => form.setValue('employeeType', 'Permanent')}
                        >
                          <Briefcase className="mx-auto h-6 w-6 mb-2 text-company-primary" />
                          <p className="font-medium">Permanent</p>
                        </div>
                        <div 
                          className={`border rounded-md p-4 text-center cursor-pointer transition-all ${field.value === 'Contract' ? 'border-company-primary bg-company-light shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                          onClick={() => form.setValue('employeeType', 'Contract')}
                        >
                          <Briefcase className="mx-auto h-6 w-6 mb-2 text-company-primary" />
                          <p className="font-medium">Contract</p>
                        </div>
                        <div 
                          className={`border rounded-md p-4 text-center cursor-pointer transition-all ${field.value === 'Internship' ? 'border-company-primary bg-company-light shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                          onClick={() => form.setValue('employeeType', 'Internship')}
                        >
                          <Briefcase className="mx-auto h-6 w-6 mb-2 text-company-primary" />
                          <p className="font-medium">Internship</p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-200">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept.id} value={dept.name}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position/Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Software Engineer" {...field} className="bg-white border-gray-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="dateOfJoin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Join*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-white border-gray-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
        
      case 2: // Salary Information
        return (
          <div className="space-y-6">
            {employeeType === "Internship" ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                <p className="text-sm">
                  For internships, only stipend and travel allowance are typically provided.
                  Other salary components are optional.
                </p>
              </div>
            ) : null}
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="salary.basic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {employeeType === "Internship" ? "Stipend" : "Basic Salary"} (₹)*
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {employeeType !== "Internship" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salary.hra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House Rent Allowance (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salary.da"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dearness Allowance (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salary.ta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Allowance (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salary.otherAllowances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Allowances (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Salary Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-gray-600">
                    {employeeType === "Internship" ? "Stipend" : "Basic Salary"}:
                  </span>
                  <span className="font-medium">₹{form.watch("salary.basic") || 0}</span>
                </div>
                
                {employeeType !== "Internship" && (
                  <>
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span className="text-gray-600">House Rent Allowance:</span>
                      <span className="font-medium">₹{form.watch("salary.hra") || 0}</span>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span className="text-gray-600">Dearness Allowance:</span>
                      <span className="font-medium">₹{form.watch("salary.da") || 0}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-gray-600">Travel Allowance:</span>
                  <span className="font-medium">₹{form.watch("salary.ta") || 0}</span>
                </div>
                
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-gray-600">Other Allowances:</span>
                  <span className="font-medium">
                    ₹{form.watch("salary.otherAllowances") || 0}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 mt-1 border-t">
                  <span className="font-bold">Total CTC:</span>
                  <span className="font-bold text-company-primary">
                    ₹
                    {(
                      (parseInt(form.watch("salary.basic") as any) || 0) +
                      (parseInt(form.watch("salary.hra") as any) || 0) +
                      (parseInt(form.watch("salary.da") as any) || 0) +
                      (parseInt(form.watch("salary.ta") as any) || 0) +
                      (parseInt(form.watch("salary.otherAllowances") as any) || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // Review case with a beautiful summary layout
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information Summary */}
              <Card>
                <CardHeader className="bg-gray-50 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-company-primary" />
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-lg">{form.watch("name")}</h3>
                      <p className="text-gray-600 text-sm">{form.watch("email")}</p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-center text-blue-800 text-sm">
                      <p>An email with temporary password will be sent to this address.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Employment Details Summary */}
              <Card>
                <CardHeader className="bg-gray-50 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-company-primary" />
                    <CardTitle className="text-lg">Employment Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-center mb-4">
                      <Badge variant="outline" className="bg-company-light text-company-primary font-medium px-3 py-1.5">
                        {form.watch("employeeType")}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Department:</div>
                      <div className="font-medium">{form.watch("department")}</div>
                      
                      <div className="text-gray-500">Position:</div>
                      <div className="font-medium">{form.watch("position")}</div>
                      
                      <div className="text-gray-500">Join Date:</div>
                      <div className="font-medium">{form.watch("dateOfJoin")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Salary Information Summary */}
              <Card>
                <CardHeader className="bg-gray-50 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-company-primary" />
                    <CardTitle className="text-lg">Salary Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div className="text-gray-500">Basic Salary:</div>
                      <div className="font-medium">₹{form.watch("salary.basic") || 0}</div>
                      
                      {employeeType !== "Internship" && (
                        <>
                          <div className="text-gray-500">HRA:</div>
                          <div className="font-medium">₹{form.watch("salary.hra") || 0}</div>
                          
                          <div className="text-gray-500">DA:</div>
                          <div className="font-medium">₹{form.watch("salary.da") || 0}</div>
                        </>
                      )}
                      
                      <div className="text-gray-500">TA:</div>
                      <div className="font-medium">₹{form.watch("salary.ta") || 0}</div>
                      
                      <div className="text-gray-500">Other:</div>
                      <div className="font-medium">₹{form.watch("salary.otherAllowances") || 0}</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center py-2 font-semibold">
                      <div>Total CTC:</div>
                      <div className="text-company-primary text-lg">₹
                        {(
                          (parseInt(form.watch("salary.basic") as any) || 0) +
                          (parseInt(form.watch("salary.hra") as any) || 0) +
                          (parseInt(form.watch("salary.da") as any) || 0) +
                          (parseInt(form.watch("salary.ta") as any) || 0) +
                          (parseInt(form.watch("salary.otherAllowances") as any) || 0)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 border rounded-lg p-4 flex items-center gap-3">
              <Info size={20} className="text-blue-500" />
              <p className="text-sm text-gray-700">
                After submission, the employee will receive an email with login credentials. They'll be prompted to complete their full profile with personal details and documents.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence>
        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm"
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center text-center max-w-md mx-4"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  times: [0, 0.6, 1],
                  ease: "easeOut" 
                }}
                className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
              >
                <CheckCircle size={50} className="text-green-600" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                Employee Created Successfully!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                The employee has been added to the system and an email with login credentials has been sent.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full bg-gray-100 rounded-full h-3 mb-2"
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.7, duration: 4 }}
                  className="bg-company-primary h-3 rounded-full"
                />
              </motion.div>
              <motion.p 
                className="text-sm text-gray-500 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Refreshing form for new employee...
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-company-primary/5 border-b pb-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <CardDescription className="mt-1 text-gray-600">
                    Enter basic employee information to generate login credentials
                  </CardDescription>
                </div>
                
                <Badge variant="outline" className="px-4 py-1.5 font-medium">
                  Step {step + 1} of {STEPS.length}
                </Badge>
              </div>
            </CardHeader>
            
            {/* Progress Steps */}
            <div className="px-6 pt-6 pb-4">
              {/* Desktop Version - Hidden on small screens */}
              <div className="hidden md:flex justify-between w-full relative">
                {/* Steps without the continuous line */}
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center z-10 w-[25%]">
                    <div className="flex items-center justify-center mb-2">
                      <div 
                        className={`flex items-center justify-center w-9 h-9 rounded-full border-2 flex-shrink-0 transition-colors ${
                          i < step ? 'bg-company-primary border-company-primary text-white' :
                          i === step ? 'border-company-primary bg-company-light text-company-primary' :
                          'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        {i < step ? <Check size={16} /> : s.icon}
                      </div>
                    </div>
                    <div 
                      className={`text-sm font-medium text-center transition-colors ${
                        i <= step ? 'text-company-primary' : 'text-gray-500'
                      }`}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Version - Only show current step with prev/next indicators */}
              <div className="flex items-center justify-between md:hidden">
                <div className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                      'border-company-primary bg-company-light text-company-primary'
                    }`}
                  >
                    {STEPS[step].icon}
                  </div>
                  <div className="ml-2 text-sm font-medium text-company-primary">
                    {STEPS[step].label} <span className="text-gray-500 text-xs">({step + 1}/{STEPS.length})</span>
                  </div>
                </div>
                
                <div className="flex -space-x-1">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < step ? 'bg-company-primary' : 
                        i === step ? 'bg-company-primary ring-2 ring-company-light' : 
                        'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-6">
                  {renderStep()}
                </CardContent>
                
                <CardFooter className="px-6 py-5 bg-gray-50 border-t flex flex-wrap justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 0}
                    className="gap-1.5 min-w-[100px]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {step < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="gap-1.5 min-w-[100px] bg-company-primary hover:bg-company-dark"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-1.5 min-w-[160px] bg-company-primary hover:bg-company-dark"
                    >
                      {isSubmitting ? "Processing..." : "Create Employee"}
                      {isSubmitting ? null : <Check className="h-4 w-4" />}
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeForm;
