
export enum EmployeeType {
  PERMANENT = 'Permanent',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GovernmentID {
  aadharNumber?: string;
  panNumber?: string;
  aadharImageUrl?: string;
  panImageUrl?: string;
  isAadharVerified?: boolean;
  isPanVerified?: boolean;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
  status: 'Pending' | 'Verified' | 'Rejected';
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: Date | string;
  nationality: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  employeeType: EmployeeType;
  department: string;
  position: string;
  dateOfJoin: Date | string;
  reportingManager?: string;
  permanentAddress: Address;
  currentAddress: Address;
  sameAsPermenantAddress?: boolean;
  governmentId: GovernmentID;
  bankDetails: BankDetails;
  profilePhotoUrl?: string;
  documents: Document[];
  salary?: {
    basic: number;
    hra: number;
    da: number;
    ta: number;
    otherAllowances: number;
    totalCTC: number;
  };
  status: 'Active' | 'Inactive' | 'On Leave' | 'Probation';
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  description: string;
}
