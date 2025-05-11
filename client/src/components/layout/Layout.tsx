import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Mail, 
  Settings, 
  Home, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminNotification from '@/components/common/AdminNotification';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  collapsed?: boolean;
}

const NavItem = ({ icon, label, to, isActive, collapsed = false }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center ${
        collapsed 
          ? 'justify-center w-11 h-11 mx-auto p-0' 
          : 'gap-3 px-3 py-2.5'
      } rounded-md transition-all duration-200 ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'text-indigo-100 hover:bg-white/10 hover:text-white'
      }`}
      title={collapsed ? label : ""}
    >
      <div className="flex items-center justify-center w-5 h-5">
        {icon}
      </div>
      <span 
        className={`font-medium font-nunito transition-all duration-200 ${
          collapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100'
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('ceitcs-user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
    
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarCollapsed(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', to: '/' },
    { icon: <Users size={18} />, label: 'Employees', to: '/employees' },
    { icon: <UserPlus size={18} />, label: 'Add Employee', to: '/add-employee' },
    { icon: <FileText size={18} />, label: 'Documents', to: '/documents' },
    { icon: <Mail size={18} />, label: 'Communications', to: '/communications' },
    { icon: <Settings size={18} />, label: 'Settings', to: '/settings' },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('ceitcs-user');
    // Redirect to login page
    navigate('/login');
  };
  
  const getUserInitials = () => {
    if (!user?.name) return "A";
    return user.name.split(' ').map((n: string) => n[0]).join('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 h-10 w-10 shadow-md"
          onClick={toggleSidebar}
        >
          <div className="flex items-center justify-center w-full h-full">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </div>
        </Button>
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 shadow-md transition-all duration-300 ease-in-out ${
          sidebarOpen ? (sidebarCollapsed ? 'w-16 opacity-100' : 'w-64 opacity-100') : '-translate-x-full w-64 opacity-0'
        } ${isMobile ? 'lg:translate-x-0 lg:opacity-100' : ''}`}
        style={{ 
          background: 'linear-gradient(135deg, #5a67d8 0%, #3c366b 100%)',
          transitionProperty: 'transform, opacity, width',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div 
          className="flex flex-col h-full font-nunito" 
          data-sidebar="sidebar"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {/* Logo */}
          <div 
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 bg-white ${sidebarCollapsed ? 'px-2' : 'px-4'} shadow-sm`}
            style={{ 
              borderRight: '2px solid transparent',
              borderImage: 'linear-gradient(135deg, #5a67d8 0%, #3c366b 100%) 1'
            }}
          >
            {!sidebarCollapsed && (
              <Link to="/" className="flex flex-col">
                <span 
                  className="text-2xl font-bold font-nunito" 
                  style={{ 
                    background: 'linear-gradient(135deg, #5a67d8 0%, #3c366b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  CeiTCS
                </span>
                <span 
                  className="text-xs opacity-90 font-nunito block" 
                  style={{ 
                    background: 'linear-gradient(135deg, #5a67d8 0%, #3c366b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Employee Management System
                </span>
              </Link>
            )}
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center rounded-full w-8 h-8 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Toggle sidebar"
              >
                <div 
                  className="flex items-center justify-center w-full h-full"
                  style={{ 
                    background: 'linear-gradient(135deg, #5a67d8 0%, #3c366b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </div>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-4 ${sidebarCollapsed ? 'px-2' : 'px-3'} space-y-1.5 overflow-y-auto`}>
            {/* Navigation Items */}
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={location.pathname === item.to}
                collapsed={sidebarCollapsed}
              />
            ))}
          </nav>
          
          {/* Logout at the bottom */}
          <div className="mt-auto px-3 py-4 border-t border-white/10">
            <Button 
              variant="outline" 
              className={`${sidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full'} mt-4 gap-2 shadow-sm bg-white/10 text-white border-white/20 hover:bg-white hover:text-red-600 hover:font-bold transition-colors`}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className={`font-nunito ${sidebarCollapsed ? 'hidden' : 'block'}`}>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? (sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64') : ''} pt-0 pb-8 pl-0`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Top header with user profile */}
        <header className="bg-white border-b fixed top-0 right-0 left-0 z-20 shadow-sm"
                style={{
                  left: sidebarOpen ? (sidebarCollapsed ? '4rem' : '16rem') : '0',
                  transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
          <div className="px-4 md:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold font-nunito">
                  {(location.pathname === '/' || location.pathname === '/dashboard') && (
                    <span>Welcome, <span style={{ 
                      background: 'linear-gradient(135deg, #5a67d8 0%, #3c366b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 'bold'
                    }}>{user?.name?.split(' ')[0] || 'admin'}</span></span>
                  )}
                  {(location.pathname !== '/' && location.pathname !== '/dashboard') && (
                    <span style={{ 
                      background: 'linear-gradient(135deg, #5a67d8 0%, #3c366b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}</span>
                  )}
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Admin Notification */}
                <AdminNotification />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 rounded-full group">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-indigo-100">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium group-hover:text-indigo-600 transition-colors">{user?.name || 'Admin'}</span>
                      </div>
                      <span className="absolute inset-0 rounded-full sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 text-sm text-center text-gray-500 border-b">
                      {user?.email || 'admin@ceitcs.com'}
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/admin-profile')}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container max-w-full h-full px-4 md:px-6 mx-auto py-6 mt-16">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => {
            setSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;
