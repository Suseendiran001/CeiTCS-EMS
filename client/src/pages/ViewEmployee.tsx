import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail, Phone, MapPin, FileText, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/types/employee';
import { useToast } from '@/components/ui/use-toast';
import { getAllEmployees } from '@/services/employeeService';

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<any | null>(null);
  
  useEffect(() => {
    fetchEmployeeData();
  }, [id]);
  
  const fetchEmployeeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const employees = await getAllEmployees();
      const foundEmployee = employees.find(emp => emp._id === id || emp.employeeId === id);
      
      if (foundEmployee) {
        setEmployee(foundEmployee);
      } else {
        setError('Employee not found');
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError('Failed to load employee data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load employee data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-company-primary animate-spin" />
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h3 className="text-xl font-medium mb-2">Employee Not Found</h3>
        <p className="text-gray-500 mb-4">The employee you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/employees')}>Back to Employees</Button>
      </div>
    );
  }
  
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Not specified';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const handleEditEmployee = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Employee editing functionality will be available soon.",
    });
  };
  
  const getBadgeColor = (status: string = 'Active') => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-amber-100 text-amber-800';
      case 'Probation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getEmployeeTypeBadge = (type: string) => {
    switch (type) {
      case 'Permanent':
        return 'bg-company-primary/20 text-company-primary';
      case 'Contract':
        return 'bg-blue-100 text-blue-800';
      case 'Internship':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const status = employee.status || 'Active';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/employees')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Employee Details</h1>
        </div>
        <Button onClick={handleEditEmployee}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Employee
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-company-light">
              {employee.profilePhoto ? (
                <img 
                  src={`${employee.profilePhoto}`} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-company-light text-company-primary text-4xl font-bold">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </div>
              )}
              <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                status === 'Active' ? 'bg-green-500' : 
                status === 'On Leave' ? 'bg-amber-500' : 
                status === 'Probation' ? 'bg-blue-500' : 'bg-red-500'
              }`}></div>
            </div>
            
            <h2 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h2>
            <p className="text-gray-500">{employee.position}</p>
            <p className="text-sm text-gray-400">{employee.department}</p>
            
            <div className="flex justify-center gap-2 mt-3">
              <Badge className={getEmployeeTypeBadge(employee.employeeType)}>
                {employee.employeeType}
              </Badge>
              <Badge className={getBadgeColor(status)}>
                {status}
              </Badge>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{employee.phone || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Joined {formatDate(employee.dateOfJoin)}</span>
              </div>
              {employee.currentAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-sm">
                    {employee.currentAddress.city || ''}, {employee.currentAddress.state || ''}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1">{employee.firstName} {employee.lastName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Employee ID</h3>
                      <p className="mt-1">{employee.employeeId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                      <p className="mt-1">{formatDate(employee.dateOfBirth)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                      <p className="mt-1">{employee.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
                      <p className="mt-1">{employee.nationality || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Marital Status</h3>
                      <p className="mt-1">{employee.maritalStatus || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {employee.permanentAddress && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Permanent Address</h3>
                      <p>
                        {employee.permanentAddress.street || ''}, <br />
                        {employee.permanentAddress.city || ''}, {employee.permanentAddress.state || ''}, {employee.permanentAddress.zipCode || ''}, <br />
                        {employee.permanentAddress.country || ''}
                      </p>
                    </div>
                  )}
                  
                  {employee.currentAddress && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Current Address</h3>
                      <p>
                        {employee.currentAddress.street || ''}, <br />
                        {employee.currentAddress.city || ''}, {employee.currentAddress.state || ''}, {employee.currentAddress.zipCode || ''}, <br />
                        {employee.currentAddress.country || ''}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Department</h3>
                      <p className="mt-1">{employee.department || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Position</h3>
                      <p className="mt-1">{employee.position || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Employee Type</h3>
                      <p className="mt-1">{employee.employeeType || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="mt-1">{status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Join</h3>
                      <p className="mt-1">{formatDate(employee.dateOfJoin)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Reporting Manager</h3>
                      <p className="mt-1">{employee.reportingManager || 'Not Assigned'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & IDs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {employee.governmentId && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Aadhar Number</h3>
                        <p className="mt-1">{employee.governmentId.aadharNumber || 'Not Available'}</p>
                        <Badge className={(employee.governmentId.isAadharVerified || employee.governmentId.aadharVerified) ? 'bg-green-100 text-green-800 mt-2' : 'bg-amber-100 text-amber-800 mt-2'}>
                          {(employee.governmentId.isAadharVerified || employee.governmentId.aadharVerified) ? 'Verified' : 'Pending Verification'}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">PAN Number</h3>
                        <p className="mt-1">{employee.governmentId.panNumber || 'Not Available'}</p>
                        <Badge className={(employee.governmentId.isPanVerified || employee.governmentId.panVerified) ? 'bg-green-100 text-green-800 mt-2' : 'bg-amber-100 text-amber-800 mt-2'}>
                          {(employee.governmentId.isPanVerified || employee.governmentId.panVerified) ? 'Verified' : 'Pending Verification'}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Uploaded Documents</h3>
                    {employee.documents && employee.documents.length > 0 ? (
                      <div className="space-y-3">
                        {employee.documents.map((doc: any) => (
                          <div key={doc.id || doc._id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded on {formatDate(doc.uploadDate || doc.createdAt)}
                                </p>
                              </div>
                            </div>
                            <Badge className={
                              doc.status === 'Verified' || doc.verified ? 'bg-green-100 text-green-800' : 
                              doc.status === 'Rejected' || doc.rejected ? 'bg-red-100 text-red-800' : 
                              'bg-amber-100 text-amber-800'
                            }>
                              {doc.status || (doc.verified ? 'Verified' : 'Pending')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No documents uploaded yet.</p>
                    )}

                    {employee.governmentId && (
                      <div className="space-y-3 mt-4">
                        {employee.governmentId.aadharImage && (
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">Aadhar Card</p>
                                <p className="text-xs text-gray-500">
                                  Government ID
                                </p>
                              </div>
                            </div>
                            <Badge className={
                              (employee.governmentId.isAadharVerified || employee.governmentId.aadharVerified) ? 
                              'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }>
                              {(employee.governmentId.isAadharVerified || employee.governmentId.aadharVerified) ? 
                                'Verified' : 'Pending'}
                            </Badge>
                          </div>
                        )}
                        
                        {employee.governmentId.panImage && (
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">PAN Card</p>
                                <p className="text-xs text-gray-500">
                                  Government ID
                                </p>
                              </div>
                            </div>
                            <Badge className={
                              (employee.governmentId.isPanVerified || employee.governmentId.panVerified) ? 
                              'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }>
                              {(employee.governmentId.isPanVerified || employee.governmentId.panVerified) ? 
                                'Verified' : 'Pending'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financials">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {employee.bankDetails && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Bank Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs text-gray-500">Bank Name</h4>
                          <p className="font-medium">{employee.bankDetails.bankName || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500">Account Holder</h4>
                          <p className="font-medium">{employee.bankDetails.accountHolderName || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500">Account Number</h4>
                          <p className="font-medium">
                            {employee.bankDetails.accountNumber ? 
                              '•'.repeat(Math.max(0, employee.bankDetails.accountNumber.length - 4)) +
                              employee.bankDetails.accountNumber.slice(-4)
                              : 'Not specified'
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500">IFSC Code</h4>
                          <p className="font-medium">{employee.bankDetails.ifscCode || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {employee.salary ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Salary Structure</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-2">
                          <div className="flex justify-between py-1 border-b border-dashed">
                            <span className="text-gray-600">
                              {employee.employeeType === 'Internship' ? 'Stipend' : 'Basic Salary'}:
                            </span>
                            <span className="font-medium">₹{employee.salary.basic?.toLocaleString() || 0}</span>
                          </div>
                          
                          {employee.employeeType !== 'Internship' && (
                            <>
                              <div className="flex justify-between py-1 border-b border-dashed">
                                <span className="text-gray-600">House Rent Allowance:</span>
                                <span className="font-medium">₹{employee.salary.hra?.toLocaleString() || 0}</span>
                              </div>
                              
                              <div className="flex justify-between py-1 border-b border-dashed">
                                <span className="text-gray-600">Dearness Allowance:</span>
                                <span className="font-medium">₹{employee.salary.da?.toLocaleString() || 0}</span>
                              </div>
                            </>
                          )}
                          
                          <div className="flex justify-between py-1 border-b border-dashed">
                            <span className="text-gray-600">Travel Allowance:</span>
                            <span className="font-medium">₹{employee.salary.ta?.toLocaleString() || 0}</span>
                          </div>
                          
                          <div className="flex justify-between py-1 border-b border-dashed">
                            <span className="text-gray-600">Other Allowances:</span>
                            <span className="font-medium">₹{employee.salary.otherAllowances?.toLocaleString() || 0}</span>
                          </div>
                          
                          <div className="flex justify-between py-2 mt-1 border-t">
                            <span className="font-bold">Total CTC:</span>
                            <span className="font-bold text-company-primary">₹{
                              ((employee.salary.totalCTC || 0) || 
                              ((employee.salary.basic || 0) + 
                               (employee.salary.hra || 0) + 
                               (employee.salary.da || 0) + 
                               (employee.salary.ta || 0) + 
                               (employee.salary.otherAllowances || 0))).toLocaleString()
                            }</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No salary information available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          variant="outline"
          onClick={fetchEmployeeData}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7L21 16"></path>
            <path d="M21 22v-6h-6"></path>
          </svg>
          Refresh Employee Data
        </Button>
      </div>
    </div>
  );
};

export default ViewEmployee;
