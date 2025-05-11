import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Mail,
  Loader2,
  Users,
  CheckCircle,
  CalendarDays,
  UserMinus,
  TrendingUp
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getAllEmployees } from '@/services/employeeService';
import { Employee, EmployeeType } from '@/types/employee';
// Import mock data
import { MOCK_EMPLOYEES } from '@/data/mockData';

// Static employee statistics data
const EMPLOYEE_STATS = {
  totalEmployees: 128,
  active: 115,
  onLeave: 8,
  newHires: 12,
  attrition: {
    rate: "3.2%",
    lastQuarter: 4
  }
};

const EmployeesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch employees from the backend
  useEffect(() => {
    fetchEmployees();
  }, []);
    const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        // Use static mock data instead of API call
        setEmployees(MOCK_EMPLOYEES);
        setLoading(false);
      }, 800); // Simulate network delay
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load employee data. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map(e => e.department)));
  
  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const employeeId = employee.employeeId?.toLowerCase() || '';
    const email = employee.email?.toLowerCase() || '';
    const department = employee.department?.toLowerCase() || '';
    const position = employee.position?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      searchTerm === '' || 
      fullName.includes(searchTermLower) ||
      employeeId.includes(searchTermLower) ||
      email.includes(searchTermLower) ||
      department.includes(searchTermLower) ||
      position.includes(searchTermLower);
      
    const matchesType = 
      !filterType || 
      employee.employeeType === filterType;
      
    const matchesDepartment = 
      !filterDepartment || 
      employee.department === filterDepartment;
    
    return matchesSearch && matchesType && matchesDepartment;
  });

  // Function to get badge color based on employee status
  const getStatusBadge = (employee: any) => {
    const status = employee.status || 'Active'; // Default to Active if status is not provided
    
    const statusMap: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'On Leave': 'bg-yellow-100 text-yellow-800',
      'Probation': 'bg-purple-100 text-purple-800',
    };
    
    const badgeClass = statusMap[status] || statusMap['Active']; // Default to Active styling
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {status}
      </span>
    );
  };
  
  // Function to get badge color based on employee type
  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'Permanent': 'bg-company-primary text-white',
      'Contract': 'bg-blue-500 text-white',
      'Internship': 'bg-gray-500 text-white',
    };
    
    const badgeClass = typeMap[type] || 'bg-gray-500 text-white'; // Default styling
    
    return (
      <Badge className={badgeClass} variant="outline">
        {type}
      </Badge>
    );
  };

  // Handle view profile click
  const handleViewProfile = (employeeId: string) => {
    navigate(`/view-employee/${employeeId}`);
  };

  // Handle edit employee click
  const handleEditEmployee = (employeeId: string) => {
    navigate(`/edit-employee/${employeeId}`);
  };

  // Handle view documents click
  const handleViewDocuments = (employeeId: string) => {
    navigate(`/documents?employeeId=${employeeId}`);
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full bg-red-100 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Error Loading Employees</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button 
            onClick={fetchEmployees}
            className="bg-company-primary text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Employee Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold">{EMPLOYEE_STATS.totalEmployees}</p>
              </div>
              <div className="rounded-full p-2 bg-company-light">
                <Users className="h-5 w-5 text-company-primary" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span className="flex items-center text-green-600 mr-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{EMPLOYEE_STATS.newHires}
              </span>
              new hires this quarter
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold">{EMPLOYEE_STATS.active}</p>
              </div>
              <div className="rounded-full p-2 bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span className="text-green-600 mr-2">
                {Math.round((EMPLOYEE_STATS.active / EMPLOYEE_STATS.totalEmployees) * 100)}%
              </span>
              of workforce available
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">On Leave</p>
                <p className="text-2xl font-bold">{EMPLOYEE_STATS.onLeave}</p>
              </div>
              <div className="rounded-full p-2 bg-amber-100">
                <CalendarDays className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span className="text-amber-600 mr-2">
                {Math.round((EMPLOYEE_STATS.onLeave / EMPLOYEE_STATS.totalEmployees) * 100)}%
              </span>
              of workforce on leave
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Attrition Rate</p>
                <p className="text-2xl font-bold">{EMPLOYEE_STATS.attrition.rate}</p>
              </div>
              <div className="rounded-full p-2 bg-red-100">
                <UserMinus className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span className="text-red-600 mr-2">
                {EMPLOYEE_STATS.attrition.lastQuarter}
              </span>
              exits in last quarter
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div></div> {/* Empty div to maintain layout structure */}
        <Link to="/add-employee">
          <Button className="gap-2">
            <Plus size={16} />
            <span>Add Employee</span>
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search employees..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={(value) => setFilterType(value === 'all' ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={(value) => setFilterDepartment(value === 'all' ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Employees Table */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee._id || employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-company-light">
                          {employee.profilePhoto ? (
                            <img 
                              src={`${employee.profilePhoto}`}
                              alt={`${employee.firstName} ${employee.lastName}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-company-primary font-bold">
                              {employee.firstName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{getTypeBadge(employee.employeeType)}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                    <TableCell>{getStatusBadge(employee)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Filter size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewProfile(employee._id || employee.id)}>
                            <Eye size={16} className="mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEmployee(employee._id || employee.id)}>
                            <Edit size={16} className="mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDocuments(employee._id || employee.id)}>
                            <FileText size={16} className="mr-2" />
                            Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail size={16} className="mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No employees found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination (static for now) */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-company-primary text-white">1</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
          
          {/* Refresh button */}
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline"
              onClick={fetchEmployees}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesList;
