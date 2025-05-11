import React, { useState, useEffect } from 'react';
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail,
  Bell,
  Search,
  FileText,
  ChevronDown,
  Loader2,
  MessagesSquare,
  FileDown
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { getEmployeeCommunications, markCommunicationAsRead } from '@/services/employeeService';

interface Email {
  id: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  important: boolean;
  category: 'inbox' | 'sent' | 'drafts';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'document' | 'leave' | 'announcement' | 'general';
}

const EmployeeCommunications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('emails');
  const [emails, setEmails] = useState<Email[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingEmail, setViewingEmail] = useState<Email | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  // Filter emails based on search query
  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter notifications based on search query
  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch data on component mount
  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        setLoading(true);
        
        // Fetch real communications data from API
        const communicationsData = await getEmployeeCommunications();
        
        // Process the communications data
        const fetchedEmails: Email[] = [];
        const fetchedNotifications: Notification[] = [];
        
        if (communicationsData && communicationsData.communications) {
          communicationsData.communications.forEach((comm: any) => {
            // Convert API data to our interface format
            if (comm.type === 'email') {
              fetchedEmails.push({
                id: comm.id,
                subject: comm.subject,
                content: comm.message,
                date: comm.date,
                read: comm.read,
                important: comm.important || false,
                category: 'inbox'
              });
            } else {
              fetchedNotifications.push({
                id: comm.id,
                title: comm.subject,
                message: comm.message,
                date: comm.date,
                read: comm.read,
                type: comm.type === 'document' ? 'document' : 
                      comm.type === 'leave' ? 'leave' :
                      comm.type === 'announcement' ? 'announcement' : 'general'
              });
            }
          });
        }
        
        // Include any sent emails if they exist in the response
        if (communicationsData && communicationsData.sentEmails) {
          communicationsData.sentEmails.forEach((email: any) => {
            fetchedEmails.push({
              ...email,
              category: 'sent'
            });
          });
        }
        
        // Include any draft emails if they exist in the response
        if (communicationsData && communicationsData.draftEmails) {
          communicationsData.draftEmails.forEach((email: any) => {
            fetchedEmails.push({
              ...email,
              category: 'drafts'
            });
          });
        }
        
        setEmails(fetchedEmails);
        setNotifications(fetchedNotifications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching communications:', error);
        toast({
          title: "Failed to load communications",
          description: "There was a problem loading your communications.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchCommunications();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const markAsRead = async (id: string) => {
    try {
      // Call API to mark as read
      await markCommunicationAsRead(id);
      
      // Update local state
      setEmails(emails.map(email => 
        email.id === id ? { ...email, read: true } : email
      ));
      
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: "Failed to update",
        description: "Could not mark communication as read.",
        variant: "destructive",
      });
    }
  };
  
  const handleViewEmail = (email: Email) => {
    setViewingEmail(email);
    if (!email.read) {
      markAsRead(email.id);
    }
  };
  
  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSendingReply(true);
      
      // Create a new reply email that will be sent
      const newEmail = {
        subject: `Re: ${viewingEmail?.subject}`,
        content: replyContent,
        recipient: "hr@ceitcs.com", // This would come from the original email in a real app
        category: 'sent',
      };
      
      // In a real app, you'd send this to an API endpoint
      // await sendEmailReply(newEmail);
      
      // For now we'll just wait a moment to simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the email to the sent folder
      setEmails([...emails, {
        ...newEmail,
        id: `reply_${Date.now()}`,
        date: new Date().toISOString(),
        read: true,
        important: false,
        category: 'sent'
      } as Email]);
      
      toast({
        title: "Reply Sent",
        description: "Your reply was sent successfully.",
      });
      
      setReplyContent('');
      setViewingEmail(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Failed to Send",
        description: "There was a problem sending your reply.",
        variant: "destructive",
      });
    } finally {
      setSendingReply(false);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'leave':
        return <FileDown className="h-4 w-4 text-green-500" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-orange-500" />;
      default:
        return <MessagesSquare className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'document':
        return <Badge className="bg-blue-100 text-blue-800">Document</Badge>;
      case 'leave':
        return <Badge className="bg-green-100 text-green-800">Leave</Badge>;
      case 'announcement':
        return <Badge className="bg-orange-100 text-orange-800">Announcement</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">General</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading your communications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end w-full">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search communications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="emails" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails
            <Badge variant="secondary" className="ml-1">
              {emails.filter(e => !e.read && e.category === 'inbox').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            <Badge variant="secondary" className="ml-1">
              {notifications.filter(n => !n.read).length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="emails" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Email Messages</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Filter 
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                View and manage your email communications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Subject</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead className="w-[100px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map((email) => (
                      <TableRow 
                        key={email.id}
                        className={`cursor-pointer ${!email.read ? 'font-medium' : ''}`}
                        onClick={() => handleViewEmail(email)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {email.important && (
                              <Badge className="bg-red-100 text-red-800 mr-1">Important</Badge>
                            )}
                            <span>{email.subject}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 truncate max-w-[300px]">
                          {email.content.substring(0, 60)}...
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {formatDate(email.date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            email.category === 'inbox' 
                              ? (!email.read ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600') 
                              : email.category === 'sent' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                          }>
                            {email.category === 'inbox' 
                              ? (email.read ? 'Read' : 'Unread') 
                              : email.category === 'sent' 
                                ? 'Sent' 
                                : 'Draft'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-gray-500">No emails found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>
                Important updates and notifications from the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border rounded-lg flex items-start justify-between ${
                        notification.read ? 'bg-white' : 'bg-blue-50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${notification.read ? '' : 'font-semibold'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-400">
                              {formatDate(notification.date)}
                            </p>
                            {getNotificationBadge(notification.type)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Email Viewing Dialog */}
      <Dialog open={!!viewingEmail} onOpenChange={() => setViewingEmail(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewingEmail?.subject}</DialogTitle>
            <DialogDescription className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatDate(viewingEmail?.date || '')}</span>
              {viewingEmail?.category === 'inbox' && (
                <span>From: HR Department &lt;hr@ceitcs.com&gt;</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border-t border-b py-4">
            <p className="text-sm">{viewingEmail?.content}</p>
          </div>
          
          {viewingEmail?.category === 'inbox' && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium">Reply:</p>
                <Textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                  className="min-h-[100px]"
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingEmail(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReply} disabled={sendingReply}>
                  {sendingReply && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send Reply
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeCommunications;