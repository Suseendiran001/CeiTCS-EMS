import { Employee, EmployeeType, Document } from '../types/employee';

export const DEPARTMENTS = [
  { id: '1', name: 'Human Resources', head: 'Sarah Johnson', description: 'Handles employee relations, recruitment, and organizational development' },
  { id: '2', name: 'Engineering', head: 'Rajesh Kumar', description: 'Develops and maintains software applications and technical infrastructure' },
  { id: '3', name: 'Finance', head: 'Emma Thompson', description: 'Manages company finances, budgeting, and financial reporting' },
  { id: '4', name: 'Marketing', head: 'David Chen', description: 'Handles brand strategy, digital marketing, and customer engagement' },
  { id: '5', name: 'Operations', head: 'Anita Patel', description: 'Oversees day-to-day operations and business processes' },
  { id: '6', name: 'Sales', head: 'John Miller', description: 'Manages client relationships and revenue generation' },
];

const generateDocuments = (): Document[] => {
  return [
    {
      id: '1',
      name: 'Aadhar Card',
      type: 'ID Proof',
      url: '#',
      uploadDate: new Date('2023-01-15'),
      status: 'Verified',
    },
    {
      id: '2',
      name: 'PAN Card',
      type: 'ID Proof',
      url: '#',
      uploadDate: new Date('2023-01-15'),
      status: 'Verified',
    },
    {
      id: '3',
      name: 'Graduation Certificate',
      type: 'Education Proof',
      url: '#',
      uploadDate: new Date('2023-01-16'),
      status: 'Verified',
    },
    {
      id: '4',
      name: 'Previous Employment Certificate',
      type: 'Employment Proof',
      url: '#',
      uploadDate: new Date('2023-01-17'),
      status: 'Pending',
    },
  ];
};

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'P001',
    firstName: 'Muthu',
    lastName: 'Kannan',
    email: 'muthu.kannan@ceitcs.com',
    phone: '9876543210',
    gender: 'Male',
    dateOfBirth: '1990-05-15',
    nationality: 'Indian',
    maritalStatus: 'Married',
    employeeType: EmployeeType.PERMANENT,
    department: 'Engineering',
    position: 'Senior Software Engineer',
    dateOfJoin: '2022-01-10',
    reportingManager: 'Rajesh Kumar',
    permanentAddress: {
      street: '123 Main Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India',
    },
    currentAddress: {
      street: '123 Main Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India',
    },
    governmentId: {
      aadharNumber: '1234 5678 9012',
      panNumber: 'ABCDE1234F',
      isAadharVerified: true,
      isPanVerified: true,
    },
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '12345678901234',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Muthu Kannan',
    },
    profilePhotoUrl: '',
    documents: generateDocuments(),
    salary: {
      basic: 50000,
      hra: 20000,
      da: 10000,
      ta: 5000,
      otherAllowances: 15000,
      totalCTC: 100000,
    },
    status: 'Active',
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date('2023-05-15'),
  },
  {
    id: '2',
    employeeId: 'C001',
    firstName: 'Selvi',
    lastName: 'Murugan',
    email: 'selvi.murugan@ceitcs.com',
    phone: '9876543211',
    gender: 'Female',
    dateOfBirth: '1992-08-20',
    nationality: 'Indian',
    maritalStatus: 'Single',
    employeeType: EmployeeType.CONTRACT,
    department: 'Marketing',
    position: 'Digital Marketing Specialist',
    dateOfJoin: '2022-03-15',
    reportingManager: 'David Chen',
    permanentAddress: {
      street: '456 Park Avenue',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      zipCode: '641001',
      country: 'India',
    },
    currentAddress: {
      street: '789 Lake View',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      zipCode: '641001',
      country: 'India',
    },
    governmentId: {
      aadharNumber: '2345 6789 0123',
      panNumber: 'BCDEF2345G',
      isAadharVerified: true,
      isPanVerified: false,
    },
    bankDetails: {
      bankName: 'ICICI Bank',
      accountNumber: '23456789012345',
      ifscCode: 'ICICI0002345',
      accountHolderName: 'Selvi Murugan',
    },
    profilePhotoUrl: '',
    documents: generateDocuments(),
    salary: {
      basic: 30000,
      hra: 12000,
      da: 6000,
      ta: 3000,
      otherAllowances: 9000,
      totalCTC: 60000,
    },
    status: 'Active',
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2023-04-10'),
  },
  {
    id: '3',
    employeeId: 'I001',
    firstName: 'Karthik',
    lastName: 'Subramanian',
    email: 'karthik.subramanian@ceitcs.com',
    phone: '9876543212',
    gender: 'Male',
    dateOfBirth: '1998-11-12',
    nationality: 'Indian',
    maritalStatus: 'Single',
    employeeType: EmployeeType.INTERNSHIP,
    department: 'Engineering',
    position: 'Software Development Intern',
    dateOfJoin: '2023-01-05',
    reportingManager: 'Muthu Kannan',
    permanentAddress: {
      street: '789 Green Road',
      city: 'Madurai',
      state: 'Tamil Nadu',
      zipCode: '625001',
      country: 'India',
    },
    currentAddress: {
      street: '789 Green Road',
      city: 'Madurai',
      state: 'Tamil Nadu',
      zipCode: '625001',
      country: 'India',
    },
    governmentId: {
      aadharNumber: '3456 7890 1234',
      panNumber: 'CDEFG3456H',
      isAadharVerified: false,
      isPanVerified: false,
    },
    bankDetails: {
      bankName: 'SBI Bank',
      accountNumber: '34567890123456',
      ifscCode: 'SBIN0003456',
      accountHolderName: 'Karthik Subramanian',
    },
    profilePhotoUrl: '',
    documents: generateDocuments().slice(0, 2),
    salary: {
      basic: 15000,
      hra: 0,
      da: 0,
      ta: 2000,
      otherAllowances: 3000,
      totalCTC: 20000,
    },
    status: 'Probation',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
  },
  {
    id: '4',
    employeeId: 'P002',
    firstName: 'Lakshmi',
    lastName: 'Priya',
    email: 'lakshmi.priya@ceitcs.com',
    phone: '9876543213',
    gender: 'Female',
    dateOfBirth: '1991-04-25',
    nationality: 'Indian',
    maritalStatus: 'Married',
    employeeType: EmployeeType.PERMANENT,
    department: 'Human Resources',
    position: 'HR Manager',
    dateOfJoin: '2021-06-15',
    reportingManager: 'Sarah Johnson',
    permanentAddress: {
      street: '101 Lake View',
      city: 'Tiruchy',
      state: 'Tamil Nadu',
      zipCode: '620001',
      country: 'India',
    },
    currentAddress: {
      street: '101 Lake View',
      city: 'Tiruchy',
      state: 'Tamil Nadu',
      zipCode: '620001',
      country: 'India',
    },
    governmentId: {
      aadharNumber: '4567 8901 2345',
      panNumber: 'DEFGH4567I',
      isAadharVerified: true,
      isPanVerified: true,
    },
    bankDetails: {
      bankName: 'Axis Bank',
      accountNumber: '45678901234567',
      ifscCode: 'UTIB0004567',
      accountHolderName: 'Lakshmi Priya',
    },
    profilePhotoUrl: '',
    documents: generateDocuments(),
    salary: {
      basic: 60000,
      hra: 24000,
      da: 12000,
      ta: 6000,
      otherAllowances: 18000,
      totalCTC: 120000,
    },
    status: 'Active',
    createdAt: new Date('2021-06-15'),
    updatedAt: new Date('2023-03-20'),
  },
  {
    id: '5',
    employeeId: 'P003',
    firstName: 'Vikram',
    lastName: 'Reddy',
    email: 'vikram.reddy@ceitcs.com',
    phone: '9876543214',
    gender: 'Male',
    dateOfBirth: '1985-09-30',
    nationality: 'Indian',
    maritalStatus: 'Married',
    employeeType: EmployeeType.PERMANENT,
    department: 'Finance',
    position: 'Financial Analyst',
    dateOfJoin: '2020-11-10',
    reportingManager: 'Emma Thompson',
    permanentAddress: {
      street: '222 River View',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001',
      country: 'India',
    },
    currentAddress: {
      street: '222 River View',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001',
      country: 'India',
    },
    governmentId: {
      aadharNumber: '5678 9012 3456',
      panNumber: 'EFGHI5678J',
      isAadharVerified: true,
      isPanVerified: true,
    },
    bankDetails: {
      bankName: 'Kotak Bank',
      accountNumber: '56789012345678',
      ifscCode: 'KKBK0005678',
      accountHolderName: 'Vikram Reddy',
    },
    profilePhotoUrl: '',
    documents: generateDocuments(),
    salary: {
      basic: 45000,
      hra: 18000,
      da: 9000,
      ta: 4500,
      otherAllowances: 13500,
      totalCTC: 90000,
    },
    status: 'Active',
    createdAt: new Date('2020-11-10'),
    updatedAt: new Date('2023-02-15'),
  },
];

// Enum for communication types
export enum CommunicationType {
  OFFER_LETTER = 'Offer Letter',
  JOINING_LETTER = 'Joining Letter',
  DOCUMENT_REQUEST = 'Document Request',
}

// Enum for communication status
export enum CommunicationStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  DELIVERED = 'Delivered',
  READ = 'Read',
  FAILED = 'Failed',
}

// Interface for email templates
export interface EmailTemplate {
  id: string;
  name: string;
  type: CommunicationType;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for sent communications
export interface Communication {
  id: string;
  employeeId: string;
  templateId: string;
  subject: string;
  body: string;
  status: CommunicationStatus;
  sentAt: Date;
  createdAt: Date;
}

// Helper functions for formatting dates and times
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getTimeElapsed = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const diffMinutes = Math.floor(diffMs / (1000 * 60)) % 60;

  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Communication status data (to be used with Badge component in React files)
export const getStatusBadgeProps = (status: CommunicationStatus) => {
  switch (status) {
    case CommunicationStatus.SENT:
      return { className: "bg-blue-50 text-blue-700 border border-blue-200", label: "Sent" };
    case CommunicationStatus.DELIVERED:
      return { className: "bg-purple-50 text-purple-700 border border-purple-200", label: "Delivered" };
    case CommunicationStatus.READ:
      return { className: "bg-green-50 text-green-700 border border-green-200", label: "Read" };
    case CommunicationStatus.FAILED:
      return { className: "bg-red-50 text-red-700 border border-red-200", label: "Failed" };
    case CommunicationStatus.DRAFT:
      return { className: "bg-gray-50 text-gray-700 border border-gray-200", label: "Draft" };
    default:
      return { variant: "outline", label: "Unknown" };
  }
};

// Mock email templates
export const mockTemplates: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Offer Letter',
    type: CommunicationType.OFFER_LETTER,
    subject: 'Offer of Employment - {{position}} at CeiTCS',
    body: `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="/ceitcs-logo.png" alt="CeiTCS Logo" style="width: 150px; height: auto;"/>
        <h1 style="color: #4169E1; margin: 10px 0;">CeiTCS</h1>
        <p style="color: #4169E1;">Cloud Enabled Intellectual Technology and Consulting Services</p>
      </div>

      <p style="text-align: right;">Reference: CeiTCS/HR/{{employeeId}}/2023</p>
      <p style="text-align: right;">Date: {{currentDate}}</p>

      <p>Dear {{employeeName}},</p>

      <p>We are delighted to extend an offer of employment to you for the position of <strong>{{position}}</strong> with CeiTCS. This offer follows our recent discussions and interviews, and we are impressed with your qualifications and potential contribution to our organization.</p>

      <h3>Employment Details:</h3>
      <ul style="line-height: 1.6;">
        <li><strong>Position:</strong> {{position}}</li>
        <li><strong>Department:</strong> {{department}}</li>
        <li><strong>Employment Type:</strong> {{employeeType}}</li>
        <li><strong>Reporting Manager:</strong> {{reportingManager}}</li>
        <li><strong>Start Date:</strong> {{startDate}}</li>
        <li><strong>Work Location:</strong> {{companyAddress}}</li>
      </ul>

      <h3>Compensation Package:</h3>
      <ul style="line-height: 1.6;">
        <li><strong>Annual CTC:</strong> {{salary}}</li>
        <li>Detailed breakdown of the salary structure will be provided in your appointment letter</li>
        <li>Additional benefits include health insurance, annual leave, and professional development opportunities</li>
      </ul>

      <h3>Pre-joining Requirements:</h3>
      <ul style="line-height: 1.6;">
        <li>Original and photocopies of all educational certificates</li>
        <li>Government-issued ID proofs (Aadhar, PAN)</li>
        <li>Recent passport-size photographs</li>
        <li>Previous employment documents (if applicable)</li>
      </ul>

      <p>This offer is contingent upon:</p>
      <ul style="line-height: 1.6;">
        <li>Successful completion of background verification</li>
        <li>Submission of all required documents</li>
        <li>Signing of the employment agreement</li>
      </ul>

      <p>To accept this offer, please sign and return a copy of this letter by <strong>{{acceptanceDeadline}}</strong>. This offer will remain valid until this date.</p>

      <p>We are excited about the prospect of you joining CeiTCS and believe you will be a valuable addition to our team. If you have any questions, please don't hesitate to contact our HR department.</p>

      <div style="margin-top: 40px;">
        <p>Welcome to the CeiTCS family!</p>
        <p>Best Regards,<br/>
        Lakshmi Priya<br/>
        HR Manager<br/>
        CeiTCS</p>
      </div>
    </div>`,
    createdAt: new Date(2023, 9, 15),
    updatedAt: new Date(2023, 10, 5)
  },
  {
    id: 'template-2',
    name: 'Joining Letter',
    type: CommunicationType.JOINING_LETTER,
    subject: 'Joining Letter - CeiTCS',
    body: `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="/ceitcs-logo.png" alt="CeiTCS Logo" style="width: 150px; height: auto;"/>
        <h1 style="color: #4169E1; margin: 10px 0;">CeiTCS</h1>
        <p style="color: #4169E1;">Cloud Enabled Intellectual Technology and Consulting Services</p>
      </div>

      <p style="text-align: right;">Reference: CeiTCS/JL/{{employeeId}}/2023</p>
      <p style="text-align: right;">Date: {{currentDate}}</p>

      <h2 style="text-align: center; margin: 30px 0;">TO WHOMSOEVER IT MAY CONCERN</h2>

      <p>This is to certify that <strong>{{employeeName}}</strong> (Employee ID: {{employeeId}}) has been granted permission to undergo training and internship at CeiTCS in the following technology areas:</p>

      <ul style="line-height: 1.6;">
        <li><strong>Cloud Technology:</strong> AWS, Azure, and Cloud Infrastructure</li>
        <li><strong>Machine Learning:</strong> Data Analysis, Model Development, and Implementation</li>
        <li><strong>Deep Learning:</strong> Neural Networks, Computer Vision, and Natural Language Processing</li>
        <li><strong>React JS:</strong> Modern Web Development and UI/UX Implementation</li>
      </ul>

      <h3>Training Details:</h3>
      <ul style="line-height: 1.6;">
        <li><strong>Duration:</strong> From {{startDate}} to {{endDate}}</li>
        <li><strong>Position:</strong> {{position}}</li>
        <li><strong>Department:</strong> {{department}}</li>
        <li><strong>Reporting Manager:</strong> {{reportingManager}}</li>
        <li><strong>Work Location:</strong> {{companyAddress}}</li>
        <li><strong>Internship Amount:</strong> {{salary}} per month</li>
      </ul>

      <h3>Training Schedule:</h3>
      <ul style="line-height: 1.6;">
        <li>Monday to Friday: 9:00 AM to 6:00 PM</li>
        <li>Saturday & Sunday: Off</li>
        <li>Training includes both theoretical and practical sessions</li>
      </ul>

      <p>During this period, the intern is expected to:</p>
      <ul style="line-height: 1.6;">
        <li>Maintain regular attendance</li>
        <li>Follow company policies and guidelines</li>
        <li>Complete assigned projects and tasks</li>
        <li>Participate in team activities and training sessions</li>
      </ul>

      <div style="margin-top: 40px;">
        <p>For<br/>
        CeiTCS<br/>
        Cloud enabled intellectual Technology and Consulting services</p>
        
        <p style="margin-top: 20px;">
        Mohan Raj G<br/>
        Managing Director</p>
      </div>
    </div>`,
    createdAt: new Date(2023, 9, 15),
    updatedAt: new Date(2023, 10, 20)
  },
  {
    id: 'template-3',
    name: 'Document Request',
    type: CommunicationType.DOCUMENT_REQUEST,
    subject: 'Urgent: Required Documents for Employee Records',
    body: `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="/ceitcs-logo.png" alt="CeiTCS Logo" style="width: 150px; height: auto;"/>
        <h1 style="color: #4169E1; margin: 10px 0;">CeiTCS</h1>
        <p style="color: #4169E1;">Cloud Enabled Intellectual Technology and Consulting Services</p>
      </div>

      <p style="text-align: right;">Reference: CeiTCS/DOC/{{employeeId}}/2023</p>
      <p style="text-align: right;">Date: {{currentDate}}</p>

      <p>Dear {{employeeName}},</p>

      <p>I hope this email finds you well. As part of our ongoing employee documentation process, we require the following documents to complete your employee records:</p>

      <h3>Required Documents:</h3>
      <ol style="line-height: 1.6;">
        <li><strong>Identity Proof (Any two):</strong>
          <ul>
            <li>Aadhar Card</li>
            <li>PAN Card</li>
            <li>Passport</li>
            <li>Driving License</li>
          </ul>
        </li>
        <li><strong>Educational Certificates:</strong>
          <ul>
            <li>10th Standard Mark Sheet</li>
            <li>12th Standard Mark Sheet</li>
            <li>Degree Certificates</li>
            <li>Additional Certification (if any)</li>
          </ul>
        </li>
        <li><strong>Professional Documents:</strong>
          <ul>
            <li>Updated Resume</li>
            <li>Previous Employment Certificates</li>
            <li>Relieving Letters</li>
            <li>Experience Letters</li>
          </ul>
        </li>
        <li><strong>Additional Requirements:</strong>
          <ul>
            <li>Recent Passport-size Photographs (4 copies)</li>
            <li>Bank Account Details</li>
            <li>Emergency Contact Information</li>
          </ul>
        </li>
      </ol>

      <h3>Submission Guidelines:</h3>
      <ul style="line-height: 1.6;">
        <li>All documents should be self-attested</li>
        <li>Submit both original and photocopies for verification</li>
        <li>Documents should be clear and legible</li>
        <li>File format: PDF or clear scanned copies</li>
      </ul>

      <p><strong>Submission Deadline: {{acceptanceDeadline}}</strong></p>

      <p>Please note that these documents are essential for completing your employee profile and ensuring compliance with company policies and regulatory requirements.</p>

      <p>If you have any questions or need clarification, please don't hesitate to contact the HR department.</p>

      <div style="margin-top: 40px;">
        <p>Best Regards,<br/>
        Lakshmi Priya<br/>
        HR Manager<br/>
        CeiTCS</p>
      </div>
    </div>`,
    createdAt: new Date(2023, 10, 1),
    updatedAt: new Date(2023, 10, 1)
  }
];

// Mock communications
export const mockCommunications: Communication[] = [
  {
    id: 'comm-1',
    employeeId: 'P001',
    templateId: 'template-1',
    subject: 'Job Offer - Software Developer at CeiTCS',
    body: `Dear Muthu Kannan,

We are pleased to offer you the position of Software Developer with CeiTCS. This letter confirms our offer with the following details:

* Start Date: November 20, 2023
* Salary: ₹600,000 per annum
* Position: Software Developer

Please confirm your acceptance of this offer by November 10, 2023.

We look forward to welcoming you to our team!

Sincerely,
HR Department
CeiTCS`,
    status: CommunicationStatus.SENT,
    sentAt: new Date(2023, 10, 3, 14, 30),
    createdAt: new Date(2023, 10, 3, 14, 30),
  },
  {
    id: 'comm-2',
    employeeId: 'P001',
    templateId: 'template-2',
    subject: 'Welcome to CeiTCS - Joining Information',
    body: `Dear Muthu Kannan,

We are delighted to welcome you to CeiTCS. As per our offer, you are scheduled to join us on November 20, 2023 as Software Developer.

On your first day, please report to our office at 9:00 AM with the following documents:

1. Identity proof (Passport/Driver's License)
2. Address proof
3. Educational certificates
4. Previous employment certificates
5. Tax-related documents

If you have any questions before your start date, please don't hesitate to contact us.

We're excited to have you join our team!

Best regards,
HR Department
CeiTCS`,
    status: CommunicationStatus.DELIVERED,
    sentAt: new Date(2023, 10, 3, 14, 35),
    createdAt: new Date(2023, 10, 3, 14, 35),
  },
  {
    id: 'comm-3',
    employeeId: 'C001',
    templateId: 'template-1',
    subject: 'Job Offer - UX Designer at CeiTCS',
    body: `Dear Selvi Murugan,

We are pleased to offer you the position of UX Designer with CeiTCS. This letter confirms our offer with the following details:

* Start Date: November 15, 2023
* Salary: ₹650,000 per annum
* Position: UX Designer

Please confirm your acceptance of this offer by November 8, 2023.

We look forward to welcoming you to our team!

Sincerely,
HR Department
CeiTCS`,
    status: CommunicationStatus.READ,
    sentAt: new Date(2023, 10, 1, 10, 15),
    createdAt: new Date(2023, 10, 1, 10, 15),
  },
  {
    id: 'comm-4',
    employeeId: 'C001',
    templateId: 'template-2',
    subject: 'Welcome to CeiTCS - Joining Information',
    body: `Dear Selvi Murugan,

We are delighted to welcome you to CeiTCS. As per our offer, you are scheduled to join us on November 15, 2023 as UX Designer.

On your first day, please report to our office at 9:00 AM with the following documents:

1. Identity proof (Passport/Driver's License)
2. Address proof
3. Educational certificates
4. Previous employment certificates
5. Tax-related documents

If you have any questions before your start date, please don't hesitate to contact us.

We're excited to have you join our team!

Best regards,
HR Department
CeiTCS`,
    status: CommunicationStatus.SENT,
    sentAt: new Date(2023, 10, 1, 10, 20),
    createdAt: new Date(2023, 10, 1, 10, 20),
  },
  {
    id: 'comm-5',
    employeeId: 'I001',
    templateId: 'template-3',
    subject: 'Important: Documents Required',
    body: `Dear Karthik Subramanian,

We hope this email finds you well. We are writing to request the following documents that are required for our records:

1. Updated resume
2. Educational certificates
3. Professional certifications

Please submit these documents at your earliest convenience, preferably before November 10, 2023.

Thank you for your prompt attention to this matter.

Best regards,
HR Department
CeiTCS`,
    status: CommunicationStatus.SENT,
    sentAt: new Date(2023, 10, 5, 16, 45),
    createdAt: new Date(2023, 10, 5, 16, 45),
  },
];

const offerLetterTemplate: EmailTemplate = {
  id: 'template-offer-letter',
  name: 'Offer Letter Template',
  type: CommunicationType.OFFER_LETTER,
  subject: 'Welcome to CeiTCS - Offer Letter',
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="/ceitcs-logo.png" alt="CeiTCS Logo" style="width: 150px; height: auto;"/>
        <h1 style="color: #4169E1; margin: 10px 0;">CeiTCS</h1>
        <p style="color: #4169E1;">Cloud Enabled Intellectual Technology and Consulting Services</p>
      </div>

      <p style="text-align: right;">Date: {{currentDate}}</p>
      
      <p>Dear {{employeeName}},</p>

      <p>We are delighted to welcome you to CeiTCS. Following our recent discussions, we are pleased to offer you the position of {{position}} in our {{department}} department.</p>

      <h3>Position Details:</h3>
      <ul>
        <li>Position: {{position}}</li>
        <li>Department: {{department}}</li>
        <li>Employment Type: {{employeeType}}</li>
        <li>Reporting Manager: {{reportingManager}}</li>
        <li>Start Date: {{startDate}}</li>
        <li>Annual CTC: {{salary}}</li>
      </ul>

      <p>Please review the attached documents for detailed information about your benefits and company policies.</p>

      <p>To accept this offer, please sign and return this letter by {{acceptanceDeadline}}.</p>

      <p>We look forward to welcoming you to the CeiTCS family!</p>

      <div style="margin-top: 40px;">
        <p>Best Regards,<br/>
        HR Department<br/>
        CeiTCS</p>
      </div>

      <div style="margin-top: 40px; color: #666; font-size: 12px;">
        <p>{{companyAddress}}</p>
      </div>
    </div>
  `,
  createdAt: new Date(),
  updatedAt: new Date()
};

const joiningLetterTemplate: EmailTemplate = {
  id: 'template-joining-letter',
  name: 'Joining Letter Template',
  type: CommunicationType.JOINING_LETTER,
  subject: 'CeiTCS - Joining Letter',
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="/ceitcs-logo.png" alt="CeiTCS Logo" style="width: 150px; height: auto;"/>
        <h1 style="color: #4169E1; margin: 10px 0;">CeiTCS</h1>
        <p style="color: #4169E1;">Cloud Enabled Intellectual Technology and Consulting Services</p>
      </div>

      <p style="text-align: right;">Date: {{currentDate}}</p>

      <h2 style="text-align: center; margin: 30px 0;">TO WHOMSOEVER IT MAY CONCERN</h2>

      <p>This is to certify that {{employeeName}} has been granted permission to do training internship in Cloud Technology, Machine Learning, Deep Learning and React JS at our organization for the limited period from {{startDate}} to {{endDate}}.</p>

      <p>During this period, {{employeeName}} will be working as {{position}} in the {{department}} department.</p>

      <p>Training Areas:</p>
      <ul>
        <li>Cloud Technology</li>
        <li>Machine Learning</li>
        <li>Deep Learning</li>
        <li>React JS</li>
      </ul>

      <p>Internship Amount: {{salary}}</p>

      <div style="margin-top: 40px;">
        <p>For<br/>
        CeiTCS<br/>
        Cloud enabled intellectual Technology and Consulting services</p>
        
        <p style="margin-top: 20px;">Mohan Raj G</p>
      </div>

      <div style="margin-top: 40px; color: #666; font-size: 12px;">
        <p>{{companyAddress}}</p>
      </div>
    </div>
  `,
  createdAt: new Date(),
  updatedAt: new Date()
};
