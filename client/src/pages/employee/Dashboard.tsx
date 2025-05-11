import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  FileText, 
  CalendarDays, 
  Bell,
  User,
  Loader2,
  FileCheck,
  Calendar as CalendarIcon
} from 'lucide-react';

import { getEmployeeDashboardData } from '@/services/employeeService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types for dashboard data
interface DashboardData {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
    employeeId: string;
    profilePhoto: string | null;
    status: string;
  };
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
  documentsNeeded: Array<{
    id: string;
    name: string;
    required: boolean;
    submitted: boolean;
  }>;
}

// Government holidays in India for 2025
const GOVERNMENT_HOLIDAYS_2025 = [
  { date: '2025-01-01', title: 'New Year\'s Day', type: 'holiday' },
  { date: '2025-01-14', title: 'Pongal', type: 'holiday' },
  { date: '2025-01-15', title: 'Makar Sankranti', type: 'holiday' },
  { date: '2025-01-26', title: 'Republic Day', type: 'holiday' },
  { date: '2025-03-17', title: 'Holi', type: 'holiday' },
  { date: '2025-04-14', title: 'Tamil New Year', type: 'holiday' },
  { date: '2025-04-18', title: 'Good Friday', type: 'holiday' },
  { date: '2025-05-01', title: 'May Day', type: 'holiday' },
  { date: '2025-08-15', title: 'Independence Day', type: 'holiday' },
  { date: '2025-09-02', title: 'Ganesh Chaturthi', type: 'holiday' },
  { date: '2025-10-02', title: 'Gandhi Jayanti', type: 'holiday' },
  { date: '2025-10-23', title: 'Dussehra', type: 'holiday' },
  { date: '2025-11-12', title: 'Diwali', type: 'holiday' },
  { date: '2025-12-25', title: 'Christmas', type: 'holiday' }
];

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Check if a date is a government holiday
  const isGovernmentHoliday = (date: Date): { isHoliday: boolean; holiday?: typeof GOVERNMENT_HOLIDAYS_2025[0] } => {
    const dateString = date.toISOString().split('T')[0];
    const holiday = GOVERNMENT_HOLIDAYS_2025.find(h => h.date === dateString);
    return { isHoliday: !!holiday, holiday };
  };
  
  // Get holidays for a specific month
  const getHolidaysForMonth = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    return GOVERNMENT_HOLIDAYS_2025.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getFullYear() === year && holidayDate.getMonth() === monthIndex;
    }).sort((a, b) => {
      return new Date(a.date).getDate() - new Date(b.date).getDate();
    });
  };
  
  // Handle month change in calendar
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Get token from localStorage
        const tokenStr = localStorage.getItem('ceitcs-token');
        const userStr = localStorage.getItem('ceitcs-user');
        
        if (!tokenStr || !userStr) {
          navigate('/login');
          return;
        }
        
        // Call the API to get dashboard data
        const apiData = await getEmployeeDashboardData();
        
        // Transform API response data to match our interface format
        const formattedData: DashboardData = {
          employee: {
            id: apiData.employee.id,
            firstName: apiData.employee.firstName,
            lastName: apiData.employee.lastName,
            email: apiData.employee.email,
            position: apiData.employee.position,
            department: apiData.employee.department,
            employeeId: apiData.employee.employeeId,
            profilePhoto: apiData.employee.profilePhotoUrl || null,
            status: apiData.employee.status
          },
          announcements: apiData.announcements || [],
          upcomingEvents: apiData.upcomingHolidays?.map((holiday: any) => ({
            id: holiday.id,
            title: holiday.name,
            date: holiday.date,
            type: holiday.type.toLowerCase()
          })) || [],
          documentsNeeded: []
        };
        
        // Add document data if available
        if (apiData.documents) {
          formattedData.documentsNeeded = Object.keys(apiData.documents).map((key, index) => ({
            id: index.toString(),
            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
            required: true,
            submitted: apiData.documents[key].isVerified || apiData.documents[key].url != null
          }));
        }

        setDashboardData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Failed to load dashboard",
          description: "There was a problem loading your dashboard information.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h3 className="text-xl font-medium mb-2">Dashboard not available</h3>
        <p className="text-gray-500 mb-4">There was a problem retrieving your dashboard information.</p>
        <Button onClick={() => navigate('/login')}>
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date header positioned at the top center */}
      <div className="flex justify-center mb-4">
        <div className="bg-white shadow-sm rounded-lg px-6 py-2.5 border border-slate-100 flex items-center gap-3 w-auto min-w-[230px]">
          <CalendarDays className="h-5 w-5 text-orange-600" />
          <p className="text-sm font-medium">Today: <span className="text-orange-600 ml-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
        </div>
      </div>

      {/* Employee Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Attendance Status Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm">
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-green-800">Today's Status</p>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {dashboardData.employee.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Loader2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">On Time</p>
                <p className="text-xs text-gray-500">Checked in: 9:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Stats Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-blue-800">Attendance</p>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                April 2025
              </Badge>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">96.7%</p>
                <p className="text-xs text-gray-500">1 absence this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balance Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-sm">
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-orange-800">Leave Balance</p>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                2025
              </Badge>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">12 days</p>
                <p className="text-xs text-gray-500">4 days used this year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-0 shadow-sm">
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-purple-800">Performance</p>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                Q2 2025
              </Badge>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">Excellent</p>
                <p className="text-xs text-gray-500">Last review: Mar 15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Calendar with integrated events on right side, and Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Calendar with right-side events - takes 2/3 of width */}
        <div className="md:col-span-2">
          {/* Calendar Card with integrated events/holidays */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                  <div>
                    <CardTitle className="text-base">Calendar</CardTitle>
                    <CardDescription className="text-xs">View holidays and events</CardDescription>
                  </div>
                </div>
                <p className="text-base font-medium">{getMonthName(currentMonth)}</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">            
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Calendar on the left - takes 1/2 of the card */}
                <div className="lg:col-span-1 p-4 flex justify-center relative">
                  <div className="w-full">
                    <h3 className="text-sm font-semibold mb-3 text-center">April 2025</h3>
                    <Calendar
                      mode="single"
                      selected={undefined}
                      onSelect={setSelectedDate}
                      onMonthChange={handleMonthChange}
                      className="rounded-md w-full"
                      modifiers={{
                        holiday: (date) => isGovernmentHoliday(date).isHoliday
                      }}
                      modifiersStyles={{
                        holiday: {
                          color: 'rgb(220, 38, 38)',
                          fontWeight: 'bold',
                        }
                      }}
                      styles={{
                        day_today: { 
                          backgroundColor: 'rgb(255, 237, 213)',
                          color: 'rgb(234, 88, 12)', 
                          fontWeight: 'bold',
                          borderRadius: '9999px',
                        },
                        day_selected: { 
                          backgroundColor: 'rgb(124, 58, 237)',
                          color: 'white', 
                          fontWeight: 'bold',
                          borderRadius: '9999px',
                        },
                        head_cell: {
                          width: '36px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: 'rgb(107, 114, 128)',
                          textTransform: 'uppercase'
                        },
                        cell: {
                          width: '38px',
                          height: '38px',
                          padding: '1px'
                        },
                        day: {
                          margin: '0',
                          width: '34px',
                          height: '34px',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        },
                        nav_button: {
                          padding: '2px',
                          margin: '0 2px'
                        },
                        caption: {
                          padding: '2px 0',
                          display: 'none' // Hide the built-in caption
                        },
                        months: {
                          padding: '2px'
                        },
                        table: {
                          width: '100%',
                          borderCollapse: 'separate',
                          borderSpacing: '2px'
                        }
                      }}
                      formatters={{
                        formatWeekday: (date) => {
                          return date.toLocaleDateString('en-US', { weekday: 'narrow' });
                        }
                      }}
                    />
    
                    {/* Legend with fixed positioning to avoid overlap */}
                    <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                        <span className="text-gray-700">Holiday</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                        <span className="text-gray-700">Today</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
                        <span className="text-gray-700">Selected</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Holidays list on the right side - inside calendar card */}
                <div className="lg:col-span-1 p-3 border-t lg:border-t-0 lg:border-l flex justify-center">
                  <div className="w-full max-w-sm">
                    <Tabs defaultValue="holidays" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 mb-2">
                        <TabsTrigger value="holidays">Holidays</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="holidays" className="mt-0">                  
                        <ScrollArea className="h-[280px]">
                          <div className="space-y-2 pr-3">
                            {getHolidaysForMonth(currentMonth).length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-4">
                                No holidays in {getMonthName(currentMonth)}
                              </p>
                            ) : (
                              getHolidaysForMonth(currentMonth).map((holiday, index) => {
                                const holidayDate = new Date(holiday.date);
                                return (
                                  <div key={index} className="flex items-start gap-3 border-b pb-2">
                                    <div className="bg-red-100 text-red-800 rounded-md w-10 h-10 flex items-center justify-center text-md font-medium flex-shrink-0">
                                      {holidayDate.getDate()}
                                    </div>
                                    <div>
                                      <p className="font-medium">{holiday.title}</p>
                                      <p className="text-xs text-gray-500">
                                        {holidayDate.toLocaleDateString('en-US', {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="events" className="mt-0">
                        <ScrollArea className="h-[280px]">
                          {dashboardData.upcomingEvents.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
                          ) : (
                            <div className="space-y-2 pr-3">
                              {dashboardData.upcomingEvents.map((event) => {
                                const eventDate = new Date(event.date);
                                return (
                                  <div key={event.id} className="flex items-start gap-3 border-b pb-2">
                                    <div className="bg-blue-100 text-blue-800 rounded-md w-10 h-10 flex items-center justify-center text-md font-medium flex-shrink-0">
                                      {eventDate.getDate()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium">{event.title}</p>
                                      <p className="text-xs text-gray-500">
                                        {eventDate.toLocaleDateString('en-US', {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                    <Badge variant="outline" 
                                      className={
                                        event.type === 'meeting' ? 'bg-blue-50 text-blue-700' : 
                                        event.type === 'deadline' ? 'bg-red-50 text-red-700' : 
                                        event.type === 'review' ? 'bg-purple-50 text-purple-700' : 
                                        'bg-green-50 text-green-700'
                                      }
                                    >
                                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Announcements only - takes 1/3 of width */}
        <div className="md:col-span-1">
          {/* Announcements */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-base">Announcements</CardTitle>
              </div>
              <CardDescription className="text-xs">Important company announcements</CardDescription>
            </CardHeader>
            <CardContent className="p-3 flex-grow">
              <ScrollArea className="h-[calc(100%-10px)] max-h-full pr-3">
                <div className="space-y-4">
                  {dashboardData.announcements.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No announcements</p>
                  ) : (
                    dashboardData.announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-3 hover:bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">{announcement.title}</h3>
                          <Badge className={
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            announcement.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-400">
                          Posted: {formatDate(announcement.date)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;