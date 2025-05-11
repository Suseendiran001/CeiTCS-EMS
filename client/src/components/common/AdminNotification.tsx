import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  FileCheck, 
  UserCheck, 
  User, 
  Clock, 
  X,
  CheckCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

// Define notification types
type NotificationType = 'document_verification' | 'new_employee' | 'profile_update' | 'document_upload';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  employeeId?: string;
  employeeName?: string;
  documentId?: string;
  documentName?: string;
  photoUrl?: string;
}

const AdminNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    // This would be an API call in production
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  // Mock function to fetch notifications
  const fetchNotifications = () => {
    // In production, this would be an API call
    const mockNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'document_verification',
        title: 'Document Verification Required',
        message: 'Aadhar card uploaded by Rajesh Kumar needs verification',
        timestamp: new Date(new Date().getTime() - 35 * 60000), // 35 minutes ago
        isRead: false,
        employeeId: 'EMP001',
        employeeName: 'Rajesh Kumar',
        documentId: 'DOC12345',
        documentName: 'Aadhar Card'
      },
      {
        id: 'n2',
        type: 'profile_update',
        title: 'Profile Completed',
        message: 'Anita Singh has completed her profile setup',
        timestamp: new Date(new Date().getTime() - 2 * 3600000), // 2 hours ago
        isRead: false,
        employeeId: 'EMP002',
        employeeName: 'Anita Singh'
      },
      {
        id: 'n3',
        type: 'document_upload',
        title: 'New Document Uploaded',
        message: 'PAN Card uploaded by Vikram Sharma',
        timestamp: new Date(new Date().getTime() - 5 * 3600000), // 5 hours ago
        isRead: true,
        employeeId: 'EMP003',
        employeeName: 'Vikram Sharma',
        documentId: 'DOC12346',
        documentName: 'PAN Card'
      },
      {
        id: 'n4',
        type: 'new_employee',
        title: 'New Employee Registered',
        message: 'New employee Priya Patel has been registered',
        timestamp: new Date(new Date().getTime() - 24 * 3600000), // 1 day ago
        isRead: true,
        employeeId: 'EMP004',
        employeeName: 'Priya Patel'
      }
    ];
    
    setNotifications(mockNotifications);
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'document_verification':
        navigate(`/documents?employeeId=${notification.employeeId}`);
        break;
      case 'new_employee':
      case 'profile_update':
        navigate(`/employees?id=${notification.employeeId}`);
        break;
      case 'document_upload':
        navigate(`/documents?employeeId=${notification.employeeId}&documentId=${notification.documentId}`);
        break;
    }
  };

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString();
  };

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'document_verification':
        return <FileCheck className="h-4 w-4 text-indigo-600" />;
      case 'new_employee':
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'profile_update':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'document_upload':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Render notification item
  const renderNotificationItem = (notification: Notification) => (
    <DropdownMenuItem
      key={notification.id}
      className={`px-4 py-3 focus:bg-gray-100 cursor-pointer ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
      onClick={() => handleNotificationClick(notification)}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium mb-0.5 ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2 mb-1">
            {notification.message}
          </p>
          <div className="flex items-center gap-2">
            {notification.employeeName && (
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-[8px] bg-gray-200">
                    {notification.employeeName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-gray-500">{notification.employeeId}</span>
              </div>
            )}
            <span className="text-[10px] text-gray-400">{getRelativeTime(notification.timestamp)}</span>
          </div>
        </div>
        {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>}
      </div>
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative w-9 h-9 rounded-full">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-blue-600 hover:text-blue-700"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          <DropdownMenuGroup>
            {notifications.length > 0 ? (
              notifications.map(notification => renderNotificationItem(notification))
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            )}
          </DropdownMenuGroup>
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between"
                onClick={() => navigate('/notifications')}
              >
                <span>View all notifications</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotification;