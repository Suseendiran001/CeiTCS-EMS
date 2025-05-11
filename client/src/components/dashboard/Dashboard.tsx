import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  FileCheck, 
  FileClock, 
  Calendar,
  TrendingUp,
  BarChart3,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
// Import mock data
import { MOCK_EMPLOYEES } from '@/data/mockData';

// Static data for dashboard
const STATIC_DOCUMENT_STATS = {
  total: 45,
  verified: 30,
  pending: 10,
  rejected: 5
};

const STATIC_UPCOMING_REVIEWS = [
  { id: 'rev1', employeeId: 'P001', employeeName: 'Muthu Kannan', reviewDate: '2025-05-20', reviewType: 'Performance' },
  { id: 'rev2', employeeId: 'C001', employeeName: 'Selvi Murugan', reviewDate: '2025-05-25', reviewType: 'Contract' },
  { id: 'rev3', employeeId: 'P002', employeeName: 'Lakshmi Priya', reviewDate: '2025-06-01', reviewType: 'Performance' }
];

const STATIC_REVENUE_DATA = {
  currentMonth: 5200000,
  lastMonth: 4800000,
  growthPercentage: 8.33,
  projectedNext: 5500000
};

const STATIC_RECRUITMENT_DATA = {
  openPositions: 12,
  applications: 87,
  interviewsScheduled: 24,
  recentHires: 6
};

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  iconColor 
}: { 
  title: string; 
  value: string | number; 
  description: string; 
  icon: React.ReactNode; 
  iconColor: string;
}) => (
  <Card className="transition-all duration-300 hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`rounded-full p-2 ${iconColor} transition-transform duration-300 hover:scale-110`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const RecentEmployee = ({
  name,
  position,
  department,
  date,
  imageUrl,
  employeeId,
}: {
  name: string;
  position: string;
  department: string;
  date: string;
  imageUrl?: string;
  employeeId: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center gap-4 py-3 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-all duration-200 hover:translate-x-1"
      onClick={() => navigate(`/view-employee/${employeeId}`)}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-company-light transition-transform duration-200 hover:scale-105">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-company-primary font-bold">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-500 truncate">{position} • {department}</p>
      </div>
      <div className="text-sm text-gray-500">{date}</div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [documentStats, setDocumentStats] = useState<{
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  }>({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use mock data instead of API calls
      setEmployees(MOCK_EMPLOYEES);
      setDocumentStats(STATIC_DOCUMENT_STATS);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Count employees by type
  const permanentCount = employees.filter(e => e.employeeType === 'Permanent').length;
  const contractCount = employees.filter(e => e.employeeType === 'Contract').length;
  const internCount = employees.filter(e => e.employeeType === 'Internship').length;
  
  // Recent employees (sorted by join date)
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.dateOfJoin).getTime() - new Date(a.dateOfJoin).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-company-primary animate-spin" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-red-600 font-medium mb-2">Error Loading Dashboard</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-company-primary text-white px-4 py-2 rounded-md hover:bg-company-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Date header positioned at the top center */}
      <div className="flex justify-center mb-4">
        <div className="bg-white shadow-sm rounded-lg px-6 py-2.5 border border-slate-100 flex items-center gap-3 w-auto min-w-[230px]">
          <CalendarDays className="h-5 w-5 text-company-primary" />
          <p className="text-sm font-medium">Today: <span className="text-company-primary ml-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={employees.length || 0}
          description="Active personnel in the system"
          icon={<Users className="h-4 w-4 text-white" />}
          iconColor="bg-company-primary text-white"
        />
        <StatsCard
          title="Permanent Employees"
          value={permanentCount || 0}
          description={`${employees.length ? ((permanentCount / employees.length) * 100).toFixed(0) : 0}% of workforce`}
          icon={<UserPlus className="h-4 w-4 text-white" />}
          iconColor="bg-blue-500 text-white"
        />
        <StatsCard
          title="Documents Verified"
          value={documentStats.verified || 0}
          description={`${documentStats.pending || 0} pending verification`}
          icon={<FileCheck className="h-4 w-4 text-white" />}
          iconColor="bg-green-500 text-white"
        />
        <StatsCard
          title="Upcoming Reviews"
          value={STATIC_UPCOMING_REVIEWS.length}
          description="Performance reviews due this month"
          icon={<Calendar className="h-4 w-4 text-white" />}
          iconColor="bg-orange-500 text-white"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Employee Distribution */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Employee Distribution</CardTitle>
            <CardDescription>
              Breakdown by employment type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-company-primary"></div>
                  <span className="text-sm">Permanent ({permanentCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm">Contract ({contractCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm">Internship ({internCount})</span>
                </div>
              </div>
              <div className="flex justify-center items-center p-2 rounded-full bg-gray-100 transition-transform duration-300 hover:scale-105">
                <BarChart3 className="h-12 w-12 text-company-primary" />
              </div>
            </div>
            
            {/* Simple bar chart representation */}
            <div className="space-y-2">
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-company-primary">
                      Permanent
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-company-primary">
                      {employees.length ? ((permanentCount / employees.length) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-company-light">
                  <div
                    style={{ width: employees.length ? `${(permanentCount / employees.length) * 100}%` : '0%' }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-company-primary transition-all duration-700 animate-in slide-in-from-left"
                  ></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-blue-500">
                      Contract
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-500">
                      {employees.length ? ((contractCount / employees.length) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-100">
                  <div
                    style={{ width: employees.length ? `${(contractCount / employees.length) * 100}%` : '0%' }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-400 transition-all duration-700 animate-in slide-in-from-left delay-150"
                  ></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-500">
                      Internship
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-500">
                      {employees.length ? ((internCount / employees.length) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: employees.length ? `${(internCount / employees.length) * 100}%` : '0%' }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-400 transition-all duration-700 animate-in slide-in-from-left delay-300"
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
            <CardDescription>
              New employees who have joined recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee) => (
                  <RecentEmployee
                    key={employee._id || employee.id}
                    name={`${employee.firstName} ${employee.lastName}`}
                    position={employee.position}
                    department={employee.department}
                    date={new Date(employee.dateOfJoin).toLocaleDateString()}
                    imageUrl={employee.profilePhoto ? `${employee.profilePhoto}` : undefined}
                    employeeId={employee.employeeId || employee._id}
                  />
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No employees found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue Stats Card */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Revenue Statistics</CardTitle>
            <CardDescription>Monthly revenue overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Current Month</p>
                <p className="text-2xl font-bold text-company-primary">₹{(STATIC_REVENUE_DATA.currentMonth / 100000).toFixed(1)}L</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414 4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    {STATIC_REVENUE_DATA.growthPercentage}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Last Month</p>
                <p className="text-2xl font-bold text-gray-700">₹{(STATIC_REVENUE_DATA.lastMonth / 100000).toFixed(1)}L</p>
                <p className="text-xs text-gray-500 mt-2">Closed on {new Date(new Date().setDate(0)).toLocaleDateString()}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Projected Next</p>
                <p className="text-2xl font-bold text-blue-600">₹{(STATIC_REVENUE_DATA.projectedNext / 100000).toFixed(1)}L</p>
                <p className="text-xs text-gray-500 mt-2">Based on current trends</p>
              </div>
              <div className="border rounded-lg p-4 bg-company-light">
                <p className="text-sm text-company-primary mb-1 font-medium">Year to Date</p>
                <p className="text-2xl font-bold text-company-primary">₹2.7Cr</p>
                <p className="text-xs text-company-primary/70 mt-2">21% above target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Stats Card */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Recruitment Overview</CardTitle>
            <CardDescription>Current hiring status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center border rounded-lg p-4">
                <div className="mr-4 p-3 bg-blue-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Open Positions</p>
                  <p className="text-2xl font-bold">{STATIC_RECRUITMENT_DATA.openPositions}</p>
                </div>
              </div>
              <div className="flex items-center border rounded-lg p-4">
                <div className="mr-4 p-3 bg-green-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-2xl font-bold">{STATIC_RECRUITMENT_DATA.applications}</p>
                </div>
              </div>
              <div className="flex items-center border rounded-lg p-4">
                <div className="mr-4 p-3 bg-purple-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interviews</p>
                  <p className="text-2xl font-bold">{STATIC_RECRUITMENT_DATA.interviewsScheduled}</p>
                </div>
              </div>
              <div className="flex items-center border rounded-lg p-4">
                <div className="mr-4 p-3 bg-orange-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recent Hires</p>
                  <p className="text-2xl font-bold">{STATIC_RECRUITMENT_DATA.recentHires}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Reviews Card */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Upcoming Performance Reviews</CardTitle>
          <CardDescription>Employee reviews scheduled for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {STATIC_UPCOMING_REVIEWS.map((review) => {
                  const reviewDate = new Date(review.reviewDate);
                  const isUpcoming = reviewDate > new Date();
                  
                  return (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{review.employeeName}</div>
                        <div className="text-sm text-gray-500">{review.employeeId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          review.reviewType === 'Performance' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {review.reviewType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reviewDate.toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isUpcoming ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isUpcoming ? 'Scheduled' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Document Stats Card */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Document Verification</CardTitle>
          <CardDescription>Status of employee document verifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-100 rounded-md hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">Verified</h4>
                <div className="bg-green-100 p-2 rounded-full">
                  <FileCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-700">{documentStats.verified || 0}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-green-600">
                  {documentStats.total ? ((documentStats.verified / documentStats.total) * 100).toFixed(0) : 0}% of total
                </p>
                <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                  +5 this week
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-1.5 mt-3">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${documentStats.total ? ((documentStats.verified / documentStats.total) * 100) : 0}%` }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-md hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-amber-800">Pending</h4>
                <div className="bg-amber-100 p-2 rounded-full">
                  <FileClock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-amber-700">{documentStats.pending || 0}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-amber-600">
                  {documentStats.total ? ((documentStats.pending / documentStats.total) * 100).toFixed(0) : 0}% of total
                </p>
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  2 urgent
                </span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-1.5 mt-3">
                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${documentStats.total ? ((documentStats.pending / documentStats.total) * 100) : 0}%` }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-100 rounded-md hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-800">Rejected</h4>
                <div className="bg-red-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <path d="M12 9v4"/>
                    <path d="M12 17h.01"/>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-red-700">{documentStats.rejected || 0}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-red-600">
                  {documentStats.total ? ((documentStats.rejected / documentStats.total) * 100).toFixed(0) : 0}% of total
                </p>
                <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                  3 to fix
                </span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-1.5 mt-3">
                <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${documentStats.total ? ((documentStats.rejected / documentStats.total) * 100) : 0}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Recent Document Activity</h4>
            <div className="space-y-2">
              {[
                { user: 'Lakshmi Priya', action: 'verified', document: 'PAN Card', employee: 'Selvi Murugan', time: '2 hours ago' },
                { user: 'Lakshmi Priya', action: 'rejected', document: 'Address Proof', employee: 'Karthik Subramanian', time: '1 day ago' },
                { user: 'Rajesh Kumar', action: 'verified', document: 'Experience Certificate', employee: 'Muthu Kannan', time: '2 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                    activity.action === 'verified' ? 'bg-green-100 text-green-700' : 
                    activity.action === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {activity.action === 'verified' ? (
                      <FileCheck className="h-4 w-4" />
                    ) : activity.action === 'rejected' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 9v4"/>
                        <path d="M12 17h.01"/>
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    ) : (
                      <FileClock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p>
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-600"> {activity.action} the </span>
                      <span className="font-medium">{activity.document}</span>
                      <span className="text-gray-600"> for </span>
                      <span className="font-medium">{activity.employee}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/documents" className="inline-flex items-center text-sm text-company-primary hover:text-company-primary/80">
                View all document activity
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/add-employee">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-company-light cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <UserPlus className="h-8 w-8 text-company-primary" />
                <p className="mt-2 text-sm font-medium">Add New Employee</p>
              </div>
            </Link>
            <Link to="/employees">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-company-light cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <FileClock className="h-8 w-8 text-blue-500" />
                <p className="mt-2 text-sm font-medium">Manage Employees</p>
              </div>
            </Link>
            <Link to="/documents">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-company-light cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <FileCheck className="h-8 w-8 text-green-500" />
                <p className="mt-2 text-sm font-medium">Document Verification</p>
              </div>
            </Link>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-company-light cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <p className="mt-2 text-sm font-medium">Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <button 
        onClick={fetchDashboardData} 
        className="flex items-center justify-center px-4 py-2 bg-company-primary/10 text-company-primary rounded-md hover:bg-company-primary/20 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 12a9 9 0 0 0 15 6.7L21 16"></path>
          <path d="M21 22v-6h-6"></path>
        </svg>
        Refresh Data
      </button>
    </div>
  );
};

export default Dashboard;
