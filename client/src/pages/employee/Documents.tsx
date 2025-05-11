import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Upload,
  FileUp,
  Loader2
} from 'lucide-react';
import { MOCK_EMPLOYEES } from '@/data/mockData';
import { Employee, Document } from '@/types/employee';
import { toast } from '@/components/ui/use-toast';
import { getEmployeeDocuments, uploadEmployeeDocument } from '@/services/employeeService';
import { useNavigate } from 'react-router-dom';

const EmployeeDocuments = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documentsTab, setDocumentsTab] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    description: '',
    file: null as File | null
  });

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        // Get token from localStorage
        const tokenStr = localStorage.getItem('ceitcs-token');
        const userStr = localStorage.getItem('ceitcs-user');
        
        if (!userStr || !tokenStr) {
          navigate('/login');
          return;
        }

        // Fetch documents data
        const documentData = await getEmployeeDocuments();
        
        // Make sure we have a documents array or create an empty one
        if (documentData.employee && !documentData.employee.documents) {
          documentData.employee.documents = [];
        }
        
        setEmployee(documentData.employee);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee documents:', error);
        toast({
          title: "Failed to load documents",
          description: "There was a problem loading your documents.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [navigate]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filterDocumentsByStatus = (documents: Document[] = [], status: string) => {
    if (!documents) return [];
    if (status === 'all') return documents;
    return documents.filter(doc => doc.status.toLowerCase() === status.toLowerCase());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument({
        ...newDocument,
        file: e.target.files[0]
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewDocument({
      ...newDocument,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setNewDocument({
      ...newDocument,
      type: value
    });
  };

  const handleSubmit = async () => {
    try {
      // Get token from localStorage
      const tokenStr = localStorage.getItem('ceitcs-token');
      
      if (!tokenStr) {
        navigate('/login');
        return;
      }

      if (!newDocument.file) {
        toast({
          title: "File Required",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', newDocument.file);
      formData.append('name', newDocument.name);
      formData.append('type', newDocument.type);
      formData.append('description', newDocument.description);

      // For production, use real API
      if (process.env.NODE_ENV === 'production') {
        await uploadEmployeeDocument(tokenStr, formData);
        
        // Refresh documents list
        const data = await getEmployeeDocuments(tokenStr);
        setEmployee(data.employee);
      } else {
        // In development, show success toast
        // Simulating adding a new document to the mock data
        if (employee) {
          const newDoc: Document = {
            id: `doc-${Math.floor(Math.random() * 1000)}`,
            name: newDocument.name,
            type: newDocument.type,
            description: newDocument.description,
            status: 'Pending',
            uploadDate: new Date().toISOString(),
            verifiedAt: null,
            fileUrl: '#',
          };
          
          setEmployee({
            ...employee,
            documents: [...(employee.documents || []), newDoc]
          });
        }
      }

      toast({
        title: "Document Uploaded",
        description: "Your document has been submitted for verification",
      });
      
      setOpenDialog(false);
      setNewDocument({
        name: '',
        type: '',
        description: '',
        file: null
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your document.",
        variant: "destructive",
      });
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  const getDocumentStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const getVerificationProgress = () => {
    if (!employee || !employee.documents || !employee.documents.length) return 0;
    const verifiedCount = employee.documents.filter(doc => 
      doc.status.toLowerCase() === 'verified'
    ).length;
    return Math.round((verifiedCount / employee.documents.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading your documents...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h3 className="text-xl font-medium mb-2">No employee information found</h3>
        <p className="text-gray-500 mb-4">There was a problem retrieving your information.</p>
        <Button onClick={() => navigate('/employee/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1></h1>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload size={16} />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload documents for verification by HR department.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="document-name">Document Name</Label>
                <Input
                  id="document-name"
                  name="name"
                  value={newDocument.name}
                  onChange={handleInputChange}
                  placeholder="E.g. Aadhar Card, PAN Card, etc."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={newDocument.type} onValueChange={handleSelectChange}>
                  <SelectTrigger id="document-type" className="mt-1">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identification">Identification Document</SelectItem>
                    <SelectItem value="address">Address Proof</SelectItem>
                    <SelectItem value="education">Educational Certificate</SelectItem>
                    <SelectItem value="employment">Previous Employment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="document-description">Description</Label>
                <Textarea
                  id="document-description"
                  name="description"
                  value={newDocument.description}
                  onChange={handleInputChange}
                  placeholder="Add details about the document"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="document-file">Upload File</Label>
                <div className="mt-1 flex items-center gap-4">
                  <Input
                    id="document-file"
                    type="file"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!newDocument.name || !newDocument.type || !newDocument.file}>
                Upload Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Document List */}
        <div className="md:w-3/4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Document List</CardTitle>
              <CardDescription>
                View and manage your uploaded documents
              </CardDescription>
            </CardHeader>
            
            <Tabs value={documentsTab} onValueChange={setDocumentsTab}>
              <div className="px-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all" className="text-xs md:text-sm">
                    All
                    <Badge className="ml-1.5 bg-gray-100 text-gray-700 hover:bg-gray-100">
                      {employee.documents?.length || 0}
                    </Badge>
                  </TabsTrigger>
                  
                  <TabsTrigger value="verified" className="text-xs md:text-sm">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Verified
                    <Badge className="ml-1.5 bg-green-100 text-green-700 hover:bg-green-100">
                      {filterDocumentsByStatus(employee.documents, 'verified').length}
                    </Badge>
                  </TabsTrigger>
                  
                  <TabsTrigger value="pending" className="text-xs md:text-sm">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Pending
                    <Badge className="ml-1.5 bg-amber-100 text-amber-700 hover:bg-amber-100">
                      {filterDocumentsByStatus(employee.documents, 'pending').length}
                    </Badge>
                  </TabsTrigger>
                  
                  <TabsTrigger value="rejected" className="text-xs md:text-sm">
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Rejected
                    <Badge className="ml-1.5 bg-red-100 text-red-700 hover:bg-red-100">
                      {filterDocumentsByStatus(employee.documents, 'rejected').length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <CardContent className="p-4 pt-4">
                  {employee.documents && employee.documents.length > 0 ? (
                    <div className="space-y-3">
                      {employee.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded">
                              <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded on {formatDate(doc.uploadDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getDocumentStatusClass(doc.status)}>
                              <span className="flex items-center gap-1.5">
                                {getDocumentStatusIcon(doc.status)}
                                {doc.status}
                              </span>
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => 
                              toast({
                                title: "Download Started",
                                description: "Your document is being downloaded",
                              })
                            }>
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-700">No documents found</h3>
                      <p className="text-gray-500 mt-1 mb-4">
                        You haven't uploaded any documents yet. Click the button below to upload your first document.
                      </p>
                      <Button onClick={() => setOpenDialog(true)}>
                        Upload Your First Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="verified" className="m-0">
                <CardContent className="p-4 pt-4">
                  {filterDocumentsByStatus(employee.documents, 'verified').length > 0 ? (
                    <div className="space-y-3">
                      {filterDocumentsByStatus(employee.documents, 'verified').map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded on {formatDate(doc.uploadDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-800">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Verified
                              </span>
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => 
                              toast({
                                title: "Download Started",
                                description: "Your document is being downloaded",
                              })
                            }>
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">
                      No verified documents found
                    </p>
                  )}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="pending" className="m-0">
                <CardContent className="p-4 pt-4">
                  {filterDocumentsByStatus(employee.documents, 'pending').length > 0 ? (
                    <div className="space-y-3">
                      {filterDocumentsByStatus(employee.documents, 'pending').map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded">
                              <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded on {formatDate(doc.uploadDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-amber-100 text-amber-800">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                Pending
                              </span>
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => 
                              toast({
                                title: "Download Started",
                                description: "Your document is being downloaded",
                              })
                            }>
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">
                      No pending documents found
                    </p>
                  )}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="rejected" className="m-0">
                <CardContent className="p-4 pt-4">
                  {filterDocumentsByStatus(employee.documents, 'rejected').length > 0 ? (
                    <div className="space-y-3">
                      {filterDocumentsByStatus(employee.documents, 'rejected').map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded">
                              <FileText className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded on {formatDate(doc.uploadDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-red-100 text-red-800">
                              <span className="flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5" />
                                Rejected
                              </span>
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => setOpenDialog(true)}>
                              Re-upload
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">
                      No rejected documents found
                    </p>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Document Stats */}
        <div className="md:w-1/4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Document Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Verification Progress */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Verification Progress</span>
                    <span className="text-sm font-medium">{getVerificationProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${getVerificationProgress()}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Document Count by Status */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                    <span className="text-xl font-bold text-green-700">
                      {filterDocumentsByStatus(employee.documents, 'verified').length}
                    </span>
                    <span className="text-xs text-gray-600">Verified</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2 bg-amber-50 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600 mb-1" />
                    <span className="text-xl font-bold text-amber-700">
                      {filterDocumentsByStatus(employee.documents, 'pending').length}
                    </span>
                    <span className="text-xs text-gray-600">Pending</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600 mb-1" />
                    <span className="text-xl font-bold text-red-700">
                      {filterDocumentsByStatus(employee.documents, 'rejected').length}
                    </span>
                    <span className="text-xs text-gray-600">Rejected</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" onClick={() => setOpenDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload New
              </Button>
            </CardFooter>
          </Card>
          
          {/* Required Documents */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 flex justify-center">
                    {employee.documents?.some(doc => doc.name.toLowerCase().includes('aadhar') && doc.status.toLowerCase() === 'verified') ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <span>Aadhar Card</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-5 flex justify-center">
                    {employee.documents?.some(doc => doc.name.toLowerCase().includes('pan') && doc.status.toLowerCase() === 'verified') ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <span>PAN Card</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-5 flex justify-center">
                    {employee.documents?.some(doc => 
                      (doc.name.toLowerCase().includes('education') || 
                       doc.name.toLowerCase().includes('degree') || 
                       doc.name.toLowerCase().includes('certificate')) && 
                      doc.status.toLowerCase() === 'verified') ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <span>Education Certificate</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-5 flex justify-center">
                    {employee.documents?.some(doc => 
                      (doc.name.toLowerCase().includes('employment') || 
                       doc.name.toLowerCase().includes('experience') || 
                       doc.name.toLowerCase().includes('work')) && 
                      doc.status.toLowerCase() === 'verified') ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <span>Employment Certificate</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-5 flex justify-center">
                    {employee.documents?.some(doc => 
                      (doc.name.toLowerCase().includes('bank') || 
                       doc.name.toLowerCase().includes('passbook') || 
                       doc.name.toLowerCase().includes('statement')) && 
                      doc.status.toLowerCase() === 'verified') ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <span>Bank Details Proof</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocuments;