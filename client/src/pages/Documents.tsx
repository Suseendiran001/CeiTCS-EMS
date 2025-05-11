import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  Download, 
  User, 
  Users, 
  Calendar, 
  FolderOpen,
  ChevronRight,
  Mail,
  Briefcase,
  UploadCloud,
  CheckSquare,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MOCK_EMPLOYEES, DEPARTMENTS } from '@/data/mockData';
import { Employee, EmployeeType, Document } from '@/types/employee';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const DocumentStatusColors = {
  verified: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    icon: <CheckCircle className="h-4 w-4" />,
    lightBg: 'bg-green-100'
  },
  pending: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    icon: <Clock className="h-4 w-4" />,
    lightBg: 'bg-amber-100'
  },
  rejected: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    icon: <XCircle className="h-4 w-4" />,
    lightBg: 'bg-red-100'
  }
};

const Documents = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentsTab, setDocumentsTab] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [documentStats, setDocumentStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });
  
  // Calculate document statistics when document data changes
  useEffect(() => {
    const allDocs: Document[] = [];
    let verified = 0;
    let pending = 0;
    let rejected = 0;
    
    MOCK_EMPLOYEES.forEach(employee => {
      employee.documents.forEach(doc => {
        allDocs.push(doc);
        if (doc.status.toLowerCase() === 'verified') verified++;
        else if (doc.status.toLowerCase() === 'pending') pending++;
        else if (doc.status.toLowerCase() === 'rejected') rejected++;
      });
    });
    
    setDocumentStats({
      total: allDocs.length,
      verified,
      pending,
      rejected
    });
  }, []);
  
  // Filter employees based on search term, department and employee type
  const filteredEmployees = MOCK_EMPLOYEES.filter(employee => {
    const matchesSearch = 
      searchTerm === '' || 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    const matchesType = 
      employeeTypeFilter === 'all' || 
      (employeeTypeFilter === 'Permanent' && employee.employeeType === EmployeeType.PERMANENT) ||
      (employeeTypeFilter === 'Contract' && employee.employeeType === EmployeeType.CONTRACT) ||
      (employeeTypeFilter === 'Internship' && employee.employeeType === EmployeeType.INTERNSHIP);
    
    return matchesSearch && matchesDepartment && matchesType;
  });
  
  // Get all documents from employees
  const getAllDocuments = (): { document: Document; employee: Employee }[] => {
    const documents: { document: Document; employee: Employee }[] = [];
    
    MOCK_EMPLOYEES.forEach(employee => {
      employee.documents.forEach(document => {
        documents.push({ document, employee });
      });
    });
    
    return documents;
  };
  
  // Filter documents based on tab
  const filterDocumentsByStatus = (docs: Document[], status: string | null): Document[] => {
    if (!status || status === 'all') return docs;
    return docs.filter(doc => doc.status.toLowerCase() === status.toLowerCase());
  };
  
  // Generate visually appealing status badge
  const getStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase() as keyof typeof DocumentStatusColors;
    const colors = DocumentStatusColors[statusKey] || {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      icon: <AlertCircle className="h-3 w-3" />,
      lightBg: 'bg-gray-100'
    };
    
    return (
      <Badge 
        className={cn(
          "flex gap-1 items-center font-medium py-0.5 px-2 h-6 border text-xs", 
          colors.lightBg, 
          colors.textColor, 
          colors.borderColor
        )}
      >
        <span className="flex-shrink-0">{colors.icon}</span>
        <span>{status}</span>
      </Badge>
    );
  };
  
  // Generate type badges with consistent styling
  const getTypeBadge = (type: EmployeeType) => {
    switch (type) {
      case EmployeeType.PERMANENT:
        return (
          <Badge className="bg-company-primary/10 text-company-primary border border-company-primary/20 font-medium">
            Permanent
          </Badge>
        );
      case EmployeeType.CONTRACT:
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            Contract
          </Badge>
        );
      case EmployeeType.INTERNSHIP:
        return (
          <Badge className="bg-purple-50 text-purple-700 border border-purple-200 font-medium">
            Internship
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // Format date with localization
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time elapsed since date
  const getTimeElapsed = (dateString: string | Date) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };
  
  // Get document type icon
  const getDocumentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'id proof':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'education proof':
        return <Briefcase className="h-4 w-4 text-amber-600" />;
      case 'employment proof':
        return <FileText className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // UI interaction handlers
  const handleViewDocuments = (employee: Employee) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSelectedEmployee(employee);
      setLoading(false);
    }, 300);
  };
  
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };
  
  const handleVerifyDocument = (document: Document) => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Document Verified",
        description: `${document.name} has been verified successfully.`,
        variant: "default",
      });
      
      // Update local state to show feedback
      if (selectedEmployee) {
        const updatedEmployee = {...selectedEmployee};
        updatedEmployee.documents = updatedEmployee.documents.map(doc => 
          doc.id === document.id ? {...doc, status: 'Verified'} : doc
        );
        setSelectedEmployee(updatedEmployee);
      }
    }, 600);
  };
  
  const handleRejectDocument = (document: Document) => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Document Rejected",
        description: `${document.name} has been rejected.`,
        variant: "destructive",
      });
      
      // Update local state to show feedback
      if (selectedEmployee) {
        const updatedEmployee = {...selectedEmployee};
        updatedEmployee.documents = updatedEmployee.documents.map(doc => 
          doc.id === document.id ? {...doc, status: 'Rejected'} : doc
        );
        setSelectedEmployee(updatedEmployee);
      }
    }, 600);
  };
  
  const handleDownloadDocument = (document: Document) => {
    setLoading(true);
    // Simulate download
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Document Downloaded",
        description: `${document.name} has been downloaded successfully.`,
      });
    }, 800);
  };
  
  const getVerificationProgress = () => {
    if (!selectedEmployee) return 0;
    const total = selectedEmployee.documents.length;
    if (total === 0) return 100;
    
    const verified = selectedEmployee.documents.filter(
      doc => doc.status.toLowerCase() === 'verified'
    ).length;
    
    return Math.round((verified / total) * 100);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-gray-500 mt-1">Verify and manage employee documents</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setSelectedEmployee(null)}>
          <Users size={16} />
          All Employees
        </Button>
      </div>
      
      {/* Document statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-company-primary overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <h3 className="text-2xl font-bold mt-1">{documentStats.total}</h3>
            </div>
            <div className="bg-company-primary/10 p-3 rounded-full">
              <FileText className="h-8 w-8 text-company-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <h3 className="text-2xl font-bold mt-1">{documentStats.verified}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold mt-1">{documentStats.pending}</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-full">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <h3 className="text-2xl font-bold mt-1">{documentStats.rejected}</h3>
            </div>
            <div className="bg-red-50 p-3 rounded-full">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loading overlay - appears during actions */}
        {loading && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-[300px] shadow-lg">
              <CardContent className="py-6 flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-4 border-company-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-center text-gray-600">Loading...</p>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Employee List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-company-primary/80 to-company-primary p-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users size={16} />
                  Employees
                </CardTitle>
                <Badge className="bg-white/20 text-white hover:bg-white/30 transition-colors">
                  {filteredEmployees.length}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="relative"> 
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-9 border-gray-200 focus-visible:ring-company-primary/20 focus:border-company-primary text-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-full border-gray-200 focus:border-company-primary focus-visible:ring-company-primary/20 text-xs h-9">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3 w-3 text-gray-500" />
                        <SelectValue placeholder="Department" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-medium text-gray-600">All Departments</SelectItem>
                      {DEPARTMENTS.map((department) => (
                        <SelectItem key={department.id} value={department.name} className="text-xs">
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={employeeTypeFilter} onValueChange={setEmployeeTypeFilter}>
                    <SelectTrigger className="w-full border-gray-200 focus:border-company-primary focus-visible:ring-company-primary/20 text-xs h-9">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-gray-500" />
                        <SelectValue placeholder="Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-medium text-gray-600">All Types</SelectItem>
                      <SelectItem value="Permanent" className="text-xs">Permanent</SelectItem>
                      <SelectItem value="Contract" className="text-xs">Contract</SelectItem>
                      <SelectItem value="Internship" className="text-xs">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="overflow-y-auto max-h-[calc(100vh-380px)]">

                {filteredEmployees.length > 0 ? (
                  <div className="space-y-2">
                    {filteredEmployees.map(employee => (
                      <div 
                        key={employee.id}
                        className={cn(
                          "py-2 px-2.5 rounded-md cursor-pointer transition-all duration-200 border",
                          selectedEmployee?.id === employee.id 
                            ? 'bg-company-primary/5 border-company-primary shadow-sm' 
                            : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                        )}
                        onClick={() => handleViewDocuments(employee)}
                      >
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8 border border-gray-200 flex-shrink-0">
                            {employee.profilePhotoUrl ? (
                              <AvatarImage src={employee.profilePhotoUrl} />
                            ) : (
                              <AvatarFallback className="bg-company-primary/10 text-company-primary text-xs">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 mb-0 leading-tight">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <div className="flex items-center text-xs text-gray-700 leading-tight">
                              <span className="text-company-primary">{employee.employeeId}</span>
                              <span className="mx-1 text-gray-300">•</span>
                              <span>{employee.department}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-1 flex-shrink-0">
                            <div className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-medium">
                              {employee.documents.length} docs
                            </div>
                            <div className="text-[12px] px-1.5 py-0.5 rounded-sm font-medium">
                              {employee.employeeType === EmployeeType.PERMANENT ? (
                                <span className="text-company-primary">Permanent</span>
                              ) : employee.employeeType === EmployeeType.CONTRACT ? (
                                <span className="text-blue-600">Contract</span>
                              ) : (
                                <span className="text-purple-600">Intern</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-800 font-medium mb-2">No employees found</h3>
                    <p className="text-gray-500 mb-4 text-sm max-w-xs">Try changing your search or filter settings</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setDepartmentFilter('all');
                        setEmployeeTypeFilter('all');
                      }}
                      className="border-gray-200 text-gray-700"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Documents Panel */}
        <div className="lg:col-span-2">
          <Card className="shadow-md border-0 overflow-hidden h-full flex flex-col">
            {selectedEmployee ? (
              <>
                <CardHeader className="bg-gray-50 border-b p-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        {selectedEmployee.profilePhotoUrl ? (
                          <AvatarImage src={selectedEmployee.profilePhotoUrl} alt="Employee" />
                        ) : (
                          <AvatarFallback className="bg-company-primary text-white font-semibold">
                            {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                          {selectedEmployee.firstName} {selectedEmployee.lastName}
                          <Badge className="ml-2" variant="outline">
                            {selectedEmployee.employeeId}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm mt-0.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          {selectedEmployee.department}
                          <span className="text-gray-300">•</span>
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(selectedEmployee.dateOfJoin)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-500 text-right mb-1">Verification Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={getVerificationProgress()} className="h-2 w-24" />
                          <span className="text-xs font-semibold">{getVerificationProgress()}%</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedEmployee(null)}
                        className="text-gray-500 hover:text-gray-700"
                        title="Back to list"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
                  <Tabs 
                    value={documentsTab} 
                    onValueChange={setDocumentsTab}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <TabsList className="grid grid-cols-4 w-full bg-gray-100/50">
                      <TabsTrigger 
                        value="all"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        All
                        <Badge className="ml-1.5 bg-gray-200/70 text-gray-700 hover:bg-gray-200/70">
                          {selectedEmployee.documents.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="verified"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-700"
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                        Verified
                        <Badge className="ml-1.5 bg-green-100 text-green-700 hover:bg-green-100">
                          {filterDocumentsByStatus(selectedEmployee.documents, 'verified').length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pending"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-700"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Pending
                        <Badge className="ml-1.5 bg-amber-100 text-amber-700 hover:bg-amber-100">
                          {filterDocumentsByStatus(selectedEmployee.documents, 'pending').length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="rejected"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-700"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1.5" />
                        Rejected
                        <Badge className="ml-1.5 bg-red-100 text-red-700 hover:bg-red-100">
                          {filterDocumentsByStatus(selectedEmployee.documents, 'rejected').length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={documentsTab} className="flex-1 overflow-hidden mt-4">
                      <div className="border rounded-md overflow-hidden h-full flex flex-col">
                        <div className="overflow-auto flex-1">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50/70 hover:bg-gray-50/70">
                                <TableHead className="w-[35%] text-sm text-center font-medium">Document</TableHead>
                                <TableHead className="w-[15%] text-sm text-center font-medium">Type</TableHead>
                                <TableHead className="w-[20%] text-sm text-center font-medium">Uploaded</TableHead>
                                <TableHead className="w-[15%] text-sm text-center font-medium">Status</TableHead>
                                <TableHead className="w-[15%] text-sm text-center font-medium">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filterDocumentsByStatus(selectedEmployee.documents, documentsTab).length > 0 ? (
                                filterDocumentsByStatus(selectedEmployee.documents, documentsTab).map(document => (
                                  <TableRow key={document.id} className="group hover:bg-gray-50">
                                    <TableCell className="py-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                          {getDocumentTypeIcon(document.type)}
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm text-gray-900 leading-tight">{document.name}</p>
                                          <p className="text-xs text-gray-500 leading-tight">
                                            ID: {document.id}
                                          </p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center py-2">
                                      <span className="text-[14px] text-gray-700">
                                        {document.type}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-center py-2">
                                      <div className="flex flex-col items-center">
                                        <span className="font-medium text-xs leading-tight">{formatDate(document.uploadDate)}</span>
                                        <span className="text-xs text-gray-500 leading-tight">{getTimeElapsed(document.uploadDate)}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center py-2">
                                      <div className="flex justify-center">
                                        {getStatusBadge(document.status)}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center py-2">
                                      <div className="flex justify-center">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="opacity-70 group-hover:opacity-100 h-8 w-8"
                                            >
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuItem
                                              onClick={() => handleViewDocument(document)}
                                              className="cursor-pointer"
                                            >
                                              <Eye className="h-4 w-4 mr-2" />
                                              Preview Document
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleDownloadDocument(document)}
                                              className="cursor-pointer"
                                            >
                                              <Download className="h-4 w-4 mr-2" />
                                              Download
                                            </DropdownMenuItem>
                                            {document.status.toLowerCase() === 'pending' && (
                                              <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                  onClick={() => handleVerifyDocument(document)}
                                                  className="text-green-600 focus:text-green-600 cursor-pointer"
                                                >
                                                  <CheckCircle className="h-4 w-4 mr-2" />
                                                  Mark as Verified
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  onClick={() => handleRejectDocument(document)}
                                                  className="text-red-600 focus:text-red-600 cursor-pointer"
                                                >
                                                  <XCircle className="h-4 w-4 mr-2" />
                                                  Reject Document
                                                </DropdownMenuItem>
                                              </>
                                            )}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                        <FileText className="h-6 w-6 text-gray-400" />
                                      </div>
                                      <h3 className="text-gray-800 font-medium mb-1">No documents found</h3>
                                      <p className="text-gray-500 text-sm mb-4 max-w-xs">
                                        {documentsTab === 'all' 
                                          ? 'This employee has no documents uploaded yet.' 
                                          : `No ${documentsTab} documents found for this employee.`}
                                      </p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FolderOpen className="h-10 w-10 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Select an Employee</h2>
                  <p className="text-gray-500 mb-6">
                    Choose an employee from the list to view and manage their documents. 
                    You can verify documents, download them, or mark them as rejected.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600 font-medium">Verify</p>
                    </div>
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <Download className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600 font-medium">Download</p>
                    </div>
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <CheckSquare className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600 font-medium">Review</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Document Preview Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-lg">
          <div className="flex flex-col lg:flex-row h-[600px]">
            {/* Document Preview Panel */}
            <div className="lg:w-2/3 border-r h-full flex flex-col bg-gray-50">
              <div className="bg-company-primary text-white p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center">
                  {selectedDocument && getDocumentTypeIcon(selectedDocument.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{selectedDocument?.name}</h3>
                  <p className="text-sm text-white/80">
                    {selectedDocument?.type} • ID: {selectedDocument?.id}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-auto flex justify-center items-center p-6">
                {/* Document display area */}
                <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                  <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 bg-company-primary/10 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-company-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                    <p className="text-gray-500 text-center max-w-sm mb-2">
                      This is a placeholder for the actual document viewer that would display
                      the contents of "{selectedDocument?.name}"
                    </p>
                    <div className="bg-gray-100 rounded px-4 py-2 text-xs text-gray-500 font-mono mt-4 w-full max-w-sm overflow-auto">
                      <p>document_id: {selectedDocument?.id}</p>
                      <p>type: {selectedDocument?.type}</p>
                      <p>uploaded: {selectedDocument && formatDate(selectedDocument.uploadDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border-t p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Uploaded:</span>
                  <span className="text-sm text-gray-700">
                    {selectedDocument && formatDate(selectedDocument.uploadDate)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({selectedDocument && getTimeElapsed(selectedDocument.uploadDate)})
                  </span>
                </div>
                <Button
                  onClick={() => {
                    if (selectedDocument) handleDownloadDocument(selectedDocument);
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
            
            {/* Document Info Panel */}
            <div className="lg:w-1/3 h-full flex flex-col overflow-hidden">
              <div className="bg-gray-50 border-b p-4">
                <h3 className="font-medium text-gray-800">Document Information</h3>
                <p className="text-sm text-gray-500 mt-1">Verify document details before approval</p>
              </div>
              
              <div className="p-5 flex-1 overflow-auto">
                <div className="space-y-6">
                  {/* Status Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                    <div className="flex items-center gap-2">
                      {selectedDocument && getStatusBadge(selectedDocument.status)}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Details Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Details</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-1 text-sm">
                        <div className="text-gray-500">Document ID:</div>
                        <div className="col-span-2 font-medium text-gray-900">{selectedDocument?.id}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-sm">
                        <div className="text-gray-500">Document Type:</div>
                        <div className="col-span-2 font-medium text-gray-900">{selectedDocument?.type}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-sm">
                        <div className="text-gray-500">File Format:</div>
                        <div className="col-span-2 font-medium text-gray-900">PDF / Image</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-sm">
                        <div className="text-gray-500">Size:</div>
                        <div className="col-span-2 font-medium text-gray-900">~4.2 MB</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Employee Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Employee</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        {selectedEmployee?.profilePhotoUrl ? (
                          <AvatarImage src={selectedEmployee.profilePhotoUrl} alt="Employee" />
                        ) : (
                          <AvatarFallback className="bg-company-primary text-white text-xs">
                            {selectedEmployee?.firstName.charAt(0)}{selectedEmployee?.lastName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{selectedEmployee?.employeeId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Notes Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                    <textarea 
                      className="w-full h-20 rounded-md border border-gray-200 resize-none text-sm p-2"
                      placeholder="Add verification notes..."
                    />
                  </div>
                </div>
              </div>
              
              {selectedDocument?.status.toLowerCase() === 'pending' && (
                <div className="border-t p-4 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    className="w-1/2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      handleRejectDocument(selectedDocument);
                      setDocumentDialogOpen(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button
                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleVerifyDocument(selectedDocument);
                      setDocumentDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              )}
              
              {selectedDocument?.status.toLowerCase() === 'verified' && (
                <div className="border-t p-4">
                  <div className="p-3 bg-green-50 border border-green-100 rounded-md flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Document Verified</h4>
                      <p className="text-sm text-green-700">This document has been verified and approved.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedDocument?.status.toLowerCase() === 'rejected' && (
                <div className="border-t p-4">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-red-800">Document Rejected</h4>
                      <p className="text-sm text-red-700">This document has been rejected and needs to be resubmitted.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
