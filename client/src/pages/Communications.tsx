import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  FileText, 
  Search, 
  Plus, 
  Check, 
  AlertCircle, 
  Clock, 
  Copy, 
  File, 
  Edit,
  Trash,
  ChevronDown,
  CheckCircle,
  X,
  Eye,
  RefreshCw,
  Filter,
  Book,
  Download
} from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { Employee, EmployeeType, Document } from '@/types/employee';
import { cn } from '@/lib/utils';
import { 
  MOCK_EMPLOYEES, 
  CommunicationType,
  CommunicationStatus,
  EmailTemplate,
  Communication,
  formatDate,
  getTimeElapsed,
  getStatusBadgeProps,
  mockTemplates,
  mockCommunications
} from '@/data/mockData';

// Main Communications component
const Communications = () => {
  // State management
  const [activeTab, setActiveTab] = useState('emails'); // emails, templates
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewEmailDialog, setShowNewEmailDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 10;
  const [sortKey, setSortKey] = useState<'date' | 'status' | 'name'>('date');
  const [previewEmail, setPreviewEmail] = useState<Communication | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Track emails sent to each employee
  const [sentEmails, setSentEmails] = useState<Communication[]>(mockCommunications);
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);

  // Automatically send offer letter and joining letter to newly added employees
  const handleEmployeeAdded = (employee: Employee) => {
    // Find offer letter template
    const offerTemplate = templates.find(t => t.type === CommunicationType.OFFER_LETTER);
    if (offerTemplate) {
      sendEmail(employee, offerTemplate);
    }
    
    // Find joining letter template
    const joiningTemplate = templates.find(t => t.type === CommunicationType.JOINING_LETTER);
    if (joiningTemplate) {
      sendEmail(employee, joiningTemplate);
    }
    
    toast({
      title: "Welcome emails sent",
      description: `Offer letter and joining letter have been sent to ${employee.firstName} ${employee.lastName}.`,
    });
  };
  
  // Function to send email to an employee using a template
  const sendEmail = (employee: Employee, template: EmailTemplate) => {
    // Replace template variables with actual employee data
    const position = employee.position || 'Software Engineer';
    const department = employee.department || 'Engineering';
    const employeeType = employee.employeeType || EmployeeType.PERMANENT;
    const reportingManager = employee.reportingManager || 'HR Manager';
    const companyAddress = '123 Tech Park, Chennai, Tamil Nadu, India - 600001';
    
    // Format salary with employee type-specific amounts
    let salaryAmount = 0;
    if (employee.salary && employee.salary.totalCTC) {
      salaryAmount = employee.salary.totalCTC * 12; // Annual CTC
    } else {
      // Default salaries based on employee type
      switch(employeeType) {
        case EmployeeType.PERMANENT:
          salaryAmount = 800000; // ₹8,00,000 for permanent
          break;
        case EmployeeType.CONTRACT:
          salaryAmount = 650000; // ₹6,50,000 for contract
          break;
        case EmployeeType.INTERNSHIP:
          salaryAmount = 300000; // ₹3,00,000 for intern
          break;
        default:
          salaryAmount = 500000; // Default
      }
    }
    
    // Format salary as Indian currency with commas
    const salary = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(salaryAmount);
    
    // Calculate dates based on current date
    const startDate = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
    const acceptanceDeadline = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    
    // Add end date calculation for internship period
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6); // 6 months internship period
    
    // Add current date
    const currentDate = formatDate(new Date());
    
    const isIntern = employee.employeeType === EmployeeType.INTERNSHIP;
    const year = new Date().getFullYear();
    
    let body = template.body
      .replace(/{{employeeName}}/g, `${employee.firstName} ${employee.lastName}`)
      .replace(/{{position}}/g, position)
      .replace(/{{department}}/g, department)
      .replace(/{{employeeType}}/g, employeeType)
      .replace(/{{reportingManager}}/g, reportingManager)
      .replace(/{{companyAddress}}/g, companyAddress)
      .replace(/{{startDate}}/g, formatDate(startDate))
      .replace(/{{endDate}}/g, formatDate(endDate))
      .replace(/{{salary}}/g, salary)
      .replace(/{{currentDate}}/g, currentDate)
      .replace(/{{acceptanceDeadline}}/g, formatDate(acceptanceDeadline))
      .replace(/{{employeeId}}/g, employee.employeeId)
      .replace(/{{year}}/g, year.toString())
      .replace(/{{isIntern}}/g, isIntern ? 'true' : '')
      .replace(/{{regNo}}/g, employee.regNo || '')
      .replace(/{{university}}/g, employee.university || '');
    
    // Create new communication record
    const newEmail: Communication = {
      id: `email-${Date.now()}`,
      employeeId: employee.employeeId,
      templateId: template.id,
      subject: template.subject,
      body: body,
      status: CommunicationStatus.SENT,
      sentAt: new Date(),
      createdAt: new Date(),
    };
    
    // Add to sent emails
    setSentEmails(prev => [newEmail, ...prev]);
  };
  
  // Filter emails by search term
  const filteredEmails = sentEmails.filter(email => {
    const employee = MOCK_EMPLOYEES.find(emp => emp.employeeId === email.employeeId);
    if (!employee) return false;
    
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort emails based on selected key
  const sortedEmails = [...filteredEmails].sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
    } else if (sortKey === 'status') {
      return a.status.localeCompare(b.status);
    } else if (sortKey === 'name') {
      const employeeA = MOCK_EMPLOYEES.find((emp) => emp.employeeId === a.employeeId);
      const employeeB = MOCK_EMPLOYEES.find((emp) => emp.employeeId === b.employeeId);
      return (employeeA?.firstName || '').localeCompare(employeeB?.firstName || '');
    }
    return 0;
  });

  // Paginate emails
  const paginatedEmails = sortedEmails.slice(
    (currentPage - 1) * emailsPerPage,
    currentPage * emailsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-gray-500">
          Manage employee communications including offer letters and joining letters.
        </p>
      </div>
      
      <Tabs defaultValue="emails" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Sent Communications
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Email Templates
            </TabsTrigger>
          </TabsList>
          
          <div>
            {activeTab === 'emails' ? (
              <Button 
                onClick={() => setShowNewEmailDialog(true)}
                className="gap-2 bg-company-primary hover:bg-company-primary/90"
              >
                <Send className="h-4 w-4" />
                Send New Email
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setEditingTemplate(null);
                  setShowTemplateDialog(true);
                }}
                className="gap-2 bg-company-primary hover:bg-company-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Email Communications</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search emails..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>
                View and manage all communications sent to employees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Select onValueChange={(value) => setSortKey(value as 'date' | 'status' | 'name')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="name">Employee Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Employee</TableHead>
                    <TableHead className="w-[20%] text-center">Sent</TableHead>
                    <TableHead className="w-[20%] text-center">Status</TableHead>
                    <TableHead className="w-[15%] text-center">Type</TableHead>
                    <TableHead className="w-[10%] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmails.length > 0 ? (
                    paginatedEmails.map((email) => {
                      const employee = MOCK_EMPLOYEES.find(emp => emp.employeeId === email.employeeId);
                      const template = templates.find(t => t.id === email.templateId);
                      
                      return (
                        <TableRow key={email.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                {employee?.profilePhotoUrl ? (
                                  <AvatarImage src={employee.profilePhotoUrl} />
                                ) : (
                                  <AvatarFallback className="bg-company-primary/10 text-company-primary text-xs">
                                    {employee?.firstName.charAt(0)}{employee?.lastName.charAt(0)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{employee?.firstName} {employee?.lastName}</p>
                                <p className="text-xs text-gray-500">{employee?.employeeId}</p>
                                <p className="text-xs text-gray-600 truncate max-w-[250px] mt-1 italic">{email.subject}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-xs">{email.sentAt ? formatDate(email.sentAt) : '-'}</span>
                              <span className="text-xs text-gray-500">{email.sentAt ? getTimeElapsed(email.sentAt) : ''}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={getStatusBadgeProps(email.status).className}>
                              {getStatusBadgeProps(email.status).label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-normal bg-gray-50">
                              {template?.type || 'General'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 mx-auto">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Resend Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Text
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No emails found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <CardFooter className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {Math.ceil(filteredEmails.length / emailsPerPage)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === Math.ceil(filteredEmails.length / emailsPerPage)}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Email Templates</CardTitle>
              <CardDescription>
                Create and manage templates for different types of communications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="border overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        Last updated: {formatDate(template.updatedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 flex-1">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-500">Subject:</span>
                        <p className="text-sm">{template.subject}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Type:</span>
                        <Badge className="ml-2 bg-blue-50 text-blue-700 border border-blue-200">
                          {template.type}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t flex justify-between bg-gray-50">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 px-2"
                        onClick={() => {
                          setEditingTemplate(template);
                          setShowTemplateDialog(true);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 px-2"
                        onClick={() => {
                          // Clone template
                          const newTemplate = {
                            ...template,
                            id: `template-${Date.now()}`,
                            name: `${template.name} (Copy)`,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                          };
                          setTemplates([...templates, newTemplate]);
                          toast({ description: 'Template duplicated successfully' });
                        }}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Duplicate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* New Email Dialog */}
      <Dialog open={showNewEmailDialog} onOpenChange={setShowNewEmailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Send New Email</DialogTitle>
            <DialogDescription>
              Compose and send an email to an employee.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_EMPLOYEES.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} ({employee.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Use Template</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Template</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Input 
                placeholder="Email subject" 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <Textarea 
                placeholder="Write your message here..."
                className="min-h-[200px]"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewEmailDialog(false)}>Cancel</Button>
            <Button className="gap-2" onClick={() => {
              toast({
                title: "Email sent successfully",
                description: "Your email has been sent to the selected employee.",
              });
              setShowNewEmailDialog(false);
            }}>
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Template Editor Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Modify the existing email template.' : 'Create a new email template for future use.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <Input placeholder="e.g. Welcome Email" defaultValue={editingTemplate?.name} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Type</label>
                <Select defaultValue={editingTemplate?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CommunicationType.OFFER_LETTER}>{CommunicationType.OFFER_LETTER}</SelectItem>
                    <SelectItem value={CommunicationType.JOINING_LETTER}>{CommunicationType.JOINING_LETTER}</SelectItem>
                    <SelectItem value={CommunicationType.DOCUMENT_REQUEST}>{CommunicationType.DOCUMENT_REQUEST}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <Input placeholder="Email subject" defaultValue={editingTemplate?.subject} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Template Content</label>
                <div className="text-xs text-gray-500">
                  Available Variables: 
                  <span className="font-mono">&#123;&#123;employeeName&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;position&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;department&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;employeeType&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;startDate&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;salary&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;acceptanceDeadline&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;reportingManager&#125;&#125;</span>, 
                  <span className="font-mono">&#123;&#123;companyAddress&#125;&#125;</span>
                </div>
              </div>
              <Textarea 
                placeholder="Write your template here..."
                className="min-h-[250px] font-mono text-sm"
                defaultValue={editingTemplate?.body}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: editingTemplate ? "Template updated" : "Template created",
                description: editingTemplate ? "Your template has been updated successfully." : "Your new template has been created.",
              });
              setShowTemplateDialog(false);
            }}>
              {editingTemplate ? 'Save Changes' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feature for automatically sending emails when employees are added */}
      <Card className="mt-6 border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Book className="h-5 w-5 text-company-primary" />
            Automatic Email Notifications
          </CardTitle>
          <CardDescription>
            New employees will automatically receive offer letters and joining letters when they are added to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Offer Letter</p>
                <p className="text-sm text-gray-500">Automatically sent when a new employee is added to the system.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Joining Letter</p>
                <p className="text-sm text-gray-500">Automatically sent along with the offer letter to provide joining details.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-gray-500">Configure automatic emails in templates section</p>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('templates')}>
            Manage Templates
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Communications;
