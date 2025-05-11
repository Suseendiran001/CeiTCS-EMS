import axios from 'axios';

// Base URL for API
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('ceitcs-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get employee profile data
export const getEmployeeProfile = async () => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.get(`${API_URL}/employee/profile`, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    */
    
    // For both development and production demo, check if we have stored profile data first
    const profileStr = localStorage.getItem('ceitcs-employee-profile');
    if (profileStr) {
      try {
        // Use the stored profile data if available
        const profile = JSON.parse(profileStr);
        return profile;
      } catch (e) {
        console.error('Error parsing stored profile data:', e);
      }
    }
    
    // If no stored data, use mock data
    // Get any stored user data
    const userStr = localStorage.getItem('ceitcs-user');
    let userId = null;
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        userId = userData.id;
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
    
    // Mock employee profile data
    return {
      id: userId || '1001',
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@ceitcs.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'United States',
      department: 'Development',
      position: 'Software Engineer',
      employeeType: 'Full-time',
      status: 'Active',
      dateOfJoin: '2023-02-15',
      reportingManager: 'Jane Smith',
      profilePhotoUrl: null,
      currentAddress: {
        street: '123 Tech Lane',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      permanentAddress: {
        street: '123 Tech Lane',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA' 
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phoneNumber: '+1 (555) 987-6543',
        address: '123 Tech Lane, San Francisco, CA'
      },
      bankDetails: {
        accountName: 'John Doe',
        accountNumber: 'XXXX-XXXX-XXXX-1234',
        bankName: 'Global Bank',
        branchName: 'Tech Center Branch',
        ifscCode: 'GLOB1234'
      },
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'Stanford University',
          yearOfCompletion: '2018',
          gpa: '3.8'
        }
      ],
      documents: {
        resume: { url: null, isVerified: false },
        idProof: { url: null, isVerified: false },
        addressProof: { url: null, isVerified: false },
        educationCertificates: { url: null, isVerified: false },
        offerLetter: { url: null, isVerified: true }
      }
    };
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    throw error;
  }
};

// Submit completed profile (first login flow)
export const completeEmployeeProfile = async (profileData: FormData): Promise<any> => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.post(`${API_URL}/employee/profile/complete`, profileData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update user's firstLogin status in localStorage
      const userStr = localStorage.getItem('ceitcs-user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        userData.firstLogin = false;
        localStorage.setItem('ceitcs-user', JSON.stringify(userData));
      }
      
      return response.data;
    }
    */
    
    // Update user's firstLogin status in localStorage
    const userStr = localStorage.getItem('ceitcs-user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      userData.firstLogin = false;
      localStorage.setItem('ceitcs-user', JSON.stringify(userData));
    }
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Profile completed successfully'
    };
  } catch (error) {
    console.error('Error completing profile:', error);
    throw error;
  }
};

// Get employee dashboard data
export const getEmployeeDashboardData = async () => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.get(`${API_URL}/employee/dashboard`, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    */
    
    // For both development and production demo, use mock data
    const profile = await getEmployeeProfile();
    
    return {
      employee: profile,
      leaveBalance: {
        annual: 15,
        sick: 10,
        casual: 7,
        compensatory: 2
      },
      leaveHistory: [
        {
          id: '1',
          type: 'Annual Leave',
          startDate: '2025-03-10',
          endDate: '2025-03-15',
          reason: 'Family vacation',
          status: 'approved'
        },
        {
          id: '2',
          type: 'Sick Leave',
          startDate: '2025-02-05',
          endDate: '2025-02-06',
          reason: 'Fever and cold',
          status: 'approved'
        },
        {
          id: '3',
          type: 'Casual Leave',
          startDate: '2025-04-20',
          endDate: '2025-04-20',
          reason: 'Personal work',
          status: 'pending'
        }
      ],
      upcomingHolidays: [
        {
          id: '1',
          name: 'Independence Day',
          date: '2025-07-04',
          type: 'National'
        },
        {
          id: '2',
          name: 'Memorial Day',
          date: '2025-05-26',
          type: 'National'
        },
        {
          id: '3',
          name: 'Company Foundation Day',
          date: '2025-06-15',
          type: 'Company'
        }
      ],
      attendance: {
        present: 20,
        absent: 0,
        leave: 2,
        late: 1
      },
      announcements: [
        {
          id: '1',
          title: 'Quarterly All-Hands Meeting',
          message: 'Please join us for the quarterly all-hands meeting on May 5, 2025 at 3:00 PM in the main conference room.',
          date: '2025-04-20',
          priority: 'high'
        },
        {
          id: '2',
          title: 'New Health Insurance Policy',
          message: 'We are upgrading our health insurance policy effective June 1, 2025. Please check your email for details.',
          date: '2025-04-15',
          priority: 'medium'
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Update employee profile data
export const updateEmployeeProfile = async (
  section: 'personalInfo' | 'addresses' | 'emergencyContact' | 'governmentId' | 'educationalQualifications' | 'bankDetails' | 'documents',
  data: any,
  field?: string
): Promise<any> => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.put(`${API_URL}/employees/profile/${section}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      return response.data;
    }
    */
    
    // For development/demo, get current profile from localStorage
    const userStr = localStorage.getItem('ceitcs-user');
    if (!userStr) return null;
    
    // Get existing profile data from localStorage if available
    let profileStr = localStorage.getItem('ceitcs-employee-profile');
    let profile = profileStr ? JSON.parse(profileStr) : {};
    
    // Create a merged profile with the new data based on section
    if (field) {
      // If a specific field in the section is being updated
      profile = {
        ...profile,
        [section]: {
          ...(profile[section] || {}),
          [field]: data
        }
      };
    } else {
      // If the entire section is being updated
      profile = {
        ...profile,
        [section]: data
      };
    }
    
    // Special handling for profile completion to ensure data shows in profile
    if (section === 'personalInfo') {
      // Update top-level personal fields directly on profile
      Object.keys(data).forEach(key => {
        profile[key] = data[key];
      });
    } else if (section === 'documents') {
      // Ensure documents array exists and is updated correctly
      if (!profile.documents) profile.documents = [];
      if (Array.isArray(data)) {
        // If data is an array, append the new documents
        profile.documents = [...profile.documents, ...data];
      } else {
        // If data is a single document, add it to the array
        profile.documents.push(data);
      }
    }
    
    // Store updated profile in localStorage
    localStorage.setItem('ceitcs-employee-profile', JSON.stringify(profile));
    
    // If profile was completed, update the user's isProfileCompleted status
    const userData = JSON.parse(userStr);
    if (!userData.isProfileCompleted && section === 'bankDetails') {
      userData.isProfileCompleted = true;
      localStorage.setItem('ceitcs-user', JSON.stringify(userData));
    }
    
    return { success: true, data: profile };
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    throw error;
  }
};

// Request leave
export const requestLeave = async (leaveData: any) => {
  try {
    // In production, this would make an API call
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.post(`${API_URL}/employee/leaves`, leaveData, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Leave request submitted successfully',
      leaveId: 'L' + Date.now()
    };
  } catch (error) {
    console.error('Error requesting leave:', error);
    throw error;
  }
};

// Cancel leave request
export const cancelLeaveRequest = async (leaveId: string) => {
  try {
    // In production, this would make an API call
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.delete(`${API_URL}/employee/leaves/${leaveId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Leave request cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    throw error;
  }
};

// Get employee documents
export const getEmployeeDocuments = async (token?: string) => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.get(`${API_URL}/employee/documents`, {
        headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader()
      });
      return response.data;
    }
    */
    
    // For development/demo, first check if we have stored profile data
    const profileStr = localStorage.getItem('ceitcs-employee-profile');
    let profile = null;
    
    if (profileStr) {
      try {
        profile = JSON.parse(profileStr);
      } catch (e) {
        console.error('Error parsing stored profile data:', e);
      }
    }
    
    // Check if the employee has uploaded documents during profile completion
    if (profile && profile.documents && Array.isArray(profile.documents) && profile.documents.length > 0) {
      // Format the documents to match the expected structure
      const formattedDocuments = profile.documents.map(doc => ({
        id: doc.id || `doc-${Math.floor(Math.random() * 1000)}`,
        name: doc.name,
        type: doc.type || 'pdf',
        size: doc.size || '1.0 MB',
        uploadDate: doc.uploadDate || new Date().toISOString(),
        status: doc.status || 'Pending',
        description: doc.description || '',
        url: doc.url || null,
        verifiedAt: doc.verifiedAt || null,
        fileUrl: doc.fileUrl || '#'
      }));
      
      return {
        employee: {
          ...profile,
          documents: formattedDocuments
        },
        requiredDocuments: [
          {
            id: '1',
            name: 'PAN Card',
            description: 'Permanent Account Number card',
            status: profile.documents.some(doc => doc.name.toLowerCase().includes('pan')) ? 'completed' : 'pending'
          },
          {
            id: '2',
            name: 'Aadhar Card',
            description: 'Government issued identity card',
            status: profile.documents.some(doc => doc.name.toLowerCase().includes('aadhar')) ? 'completed' : 'pending'
          },
          {
            id: '3',
            name: 'Education Certificate',
            description: 'Latest education certificate',
            status: profile.documents.some(doc => 
              doc.name.toLowerCase().includes('education') || 
              doc.name.toLowerCase().includes('certificate') ||
              doc.name.toLowerCase().includes('degree')
            ) ? 'completed' : 'pending'
          }
        ]
      };
    }
    
    // If no documents found or profile not complete, return empty documents array
    return {
      employee: {
        ...profile,
        documents: []
      },
      requiredDocuments: [
        {
          id: '1',
          name: 'PAN Card',
          description: 'Permanent Account Number card',
          status: 'pending'
        },
        {
          id: '2',
          name: 'Aadhar Card',
          description: 'Government issued identity card',
          status: 'pending'
        },
        {
          id: '3',
          name: 'Education Certificate',
          description: 'Latest education certificate',
          status: 'pending'
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching employee documents:', error);
    throw error;
  }
};

// Upload employee document
export const uploadDocument = async (documentType: string, file: File): Promise<any> => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      const response = await axios.post(`${API_URL}/employees/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      return response.data;
    }
    */
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Document uploaded successfully',
      documentId: 'DOC' + Date.now()
    };
  } catch (error) {
    console.error(`Error uploading document:`, error);
    throw error;
  }
};

// Alias for uploadDocument to maintain backward compatibility
export const uploadEmployeeDocument = uploadDocument;

// Create new employee
export const createEmployee = async (employeeData: FormData) => {
  try {
    // For debugging - log the content of formData
    console.log("Creating employee with data:", {
      firstName: employeeData.get("firstName"),
      lastName: employeeData.get("lastName"),
      email: employeeData.get("email"),
      employeeType: employeeData.get("employeeType"),
      department: employeeData.get("department"),
      position: employeeData.get("position"),
      dateOfJoin: employeeData.get("dateOfJoin")
    });
    
    // Always send to the backend API
    const response = await axios.post(`${API_URL}/employees`, employeeData, {
      headers: {
        ...getAuthHeader()
        // Let browser set content-type with correct boundary for FormData
      }
    });
    
    console.log("Employee created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating employee:', error);
    
    // Enhanced error handling
    if (error.response) {
      console.error('Server responded with:', error.response.status, error.response.data);
    }
    
    throw error;
  }
};

// Get employee communications
export const getEmployeeCommunications = async () => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.get(`${API_URL}/employee/communications`, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    */
    
    // For development/demo, use mock data
    return {
      communications: [
        {
          id: '1',
          subject: 'Welcome to CeiTCS',
          message: 'Welcome to CeiTCS! We are delighted to have you on board. This email contains important information about your onboarding process.',
          date: '2025-04-22T09:30:00.000Z',
          read: true,
          important: true,
          type: 'email',
          sender: {
            name: 'HR Department',
            department: 'Human Resources',
            avatar: undefined
          }
        },
        {
          id: '2',
          subject: 'Salary Slip - April 2025',
          message: 'Your salary slip for April 2025 has been generated. You can download it from your profile or the attached document.',
          date: '2025-04-25T14:15:00.000Z',
          read: false,
          important: true,
          type: 'document',
          sender: {
            name: 'Finance Team',
            department: 'Finance',
            avatar: undefined
          }
        },
        {
          id: '3',
          subject: 'Team Meeting Reminder',
          message: 'This is a reminder for the team meeting scheduled tomorrow at 10:00 AM. Please prepare your weekly updates.',
          date: '2025-04-25T11:00:00.000Z',
          read: true,
          important: false,
          type: 'notification',
          sender: {
            name: 'Project Manager',
            department: 'Development',
            avatar: undefined
          }
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
};

// Mark communication as read
export const markCommunicationAsRead = async (communicationId: string) => {
  try {
    // In a real application, this would make an API call in production
    // But for our demo, we'll use mock data in both environments
    // Commenting out the production API call for now
    /*
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.post(`${API_URL}/employee/communications/${communicationId}/read`, {}, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    */
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Communication marked as read'
    };
  } catch (error) {
    console.error('Error marking communication as read:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    // In production, this would make an API call
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.post(`${API_URL}/employee/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings: any) => {
  try {
    // In production, this would make an API call
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.post(`${API_URL}/employee/settings/notifications`, settings, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Notification settings updated successfully'
    };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

// Update security settings
export const updateSecuritySettings = async (settings: any) => {
  try {
    // In production, this would make an API call
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.post(`${API_URL}/employee/settings/security`, settings, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    
    // For development/demo, just return success
    return {
      success: true,
      message: 'Security settings updated successfully'
    };
  } catch (error) {
    console.error('Error updating security settings:', error);
    throw error;
  }
};

// Get employee profile completion status
export const getProfileCompletionStatus = async (): Promise<{
  isComplete: boolean;
  completedSections: string[];
}> => {
  try {
    const response = await axios.get(`${API_URL}/employees/profile/completion-status`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile completion status:`, error);
    throw error;
  }
};

// Get all employees for admin
export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw error;
  }
};

// Get admin dashboard data
export const getAdminDashboardData = async () => {
  try {
    const employees = await getAllEmployees();
    
    // Get all documents from all employees
    const documents = await axios.get(`${API_URL}/employees/documents`, {
      headers: getAuthHeader()
    });
    
    return {
      employees,
      documents: documents.data
    };
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};

// Get document verification stats
export const getDocumentStats = async () => {
  try {
    // In production, call the API
    if (process.env.NODE_ENV === 'production') {
      const response = await axios.get(`${API_URL}/employees/documents/stats`, {
        headers: getAuthHeader()
      });
      return response.data;
    }
    
    // For development/demo, use mock data
    // In a real app, we would calculate this from employees
    return {
      total: 45,
      verified: 30,
      pending: 10,
      rejected: 5
    };
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
};