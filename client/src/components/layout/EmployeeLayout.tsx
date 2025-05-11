import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, Home, FileText, Mail, LogOut, Menu, ChevronRight, ChevronLeft, Settings, UserCircle, X,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileCompletionCheck from "@/components/employees/ProfileCompletionCheck";

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

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

const EmployeeLayout = ({ children }: EmployeeLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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
  }, [isMobile, location.pathname]);

  const EMPLOYEE_NAV_ITEMS = [
    { icon: <Home size={18} />, label: 'Dashboard', to: '/employee/dashboard' },
    { icon: <UserCircle size={18} />, label: 'My Profile', to: '/employee/profile' },
    { icon: <FileText size={18} />, label: 'My Documents', to: '/employee/documents' },
    { icon: <Mail size={18} />, label: 'Communications', to: '/employee/communications' },
    { icon: <Settings size={18} />, label: 'Account Settings', to: '/employee/settings' },
  ];

  const handleNavItemClick = (item: string) => {
    if (item === 'logout') {
      handleLogout();
    } else if (item === 'profile') {
      navigate('/employee/profile');
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('ceitcs-user');
    localStorage.removeItem('ceitcs-token');
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return "E";
    return user.name.split(' ').map((n: string) => n[0]).join('');
  };

  return (
    <ProfileCompletionCheck>
      <div className="flex min-h-screen bg-gray-50">
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
        
        <aside
          className={`fixed inset-y-0 left-0 z-40 shadow-md transition-all duration-300 ease-in-out ${
            sidebarOpen ? (sidebarCollapsed ? 'w-16 opacity-100' : 'w-64 opacity-100') : '-translate-x-full w-64 opacity-0'
          } ${isMobile ? 'lg:translate-x-0 lg:opacity-100' : ''}`}
          style={{ 
            background: 'linear-gradient(135deg, #f97316 0%, #b91c1c 100%)',
            transitionProperty: 'transform, opacity, width',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div 
            className="flex flex-col h-full font-nunito" 
            data-sidebar="sidebar"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <div 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 bg-white ${sidebarCollapsed ? 'px-2' : 'px-4'} shadow-sm`}
              style={{ 
                borderRight: '2px solid transparent',
                borderImage: 'linear-gradient(135deg, #f97316 0%, #b91c1c 100%) 1'
              }}
            >
              {!sidebarCollapsed && (
                <Link to="/employee/dashboard" className="flex flex-col">
                  <span 
                    className="text-2xl font-bold font-nunito" 
                    style={{ 
                      background: 'linear-gradient(135deg, #f97316 0%, #b91c1c 100%)',
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
                      background: 'linear-gradient(135deg, #f97316 0%, #b91c1c 100%)',
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
                  className="flex items-center justify-center rounded-full w-8 h-8 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  aria-label="Toggle sidebar"
                >
                  <div 
                    className="flex items-center justify-center w-full h-full"
                    style={{ 
                      background: 'linear-gradient(135deg, #f97316 0%, #b91c1c 100%)',
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

            <nav className={`flex-1 py-4 ${sidebarCollapsed ? 'px-2' : 'px-3'} space-y-1.5 overflow-y-auto`}>
              {EMPLOYEE_NAV_ITEMS.map((item) => (
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

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? (sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64') : ''} pt-0 pb-8 pl-0`}
          style={{ 
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <header className="bg-white border-b fixed top-0 right-0 left-0 z-20 shadow-sm" 
                  style={{
                    left: sidebarOpen ? (sidebarCollapsed ? '4rem' : '16rem') : '0',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
            <div className="px-4 md:px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold font-nunito">
                    {location.pathname === '/employee/dashboard' && user?.name && (
                      <span>Welcome, <span 
                        style={{ 
                          background: 'linear-gradient(135deg, #f97316 0%, #b91c1c 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >{user.name.split(' ')[0]}</span></span>
                    )}
                    {(!user?.name || location.pathname !== '/employee/dashboard') && (
                      <span
                        style={{ 
                          background: 'linear-gradient(135deg, #f97316 0%, #b91c1c 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >{EMPLOYEE_NAV_ITEMS.find(item => item.to === location.pathname)?.label || 'Dashboard'}</span>
                    )}
                  </h1>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 rounded-full">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-orange-100">
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user?.name || 'Employee'}</span>
                      </div>
                      <span className="absolute inset-0 rounded-full sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 text-sm text-center text-gray-500 border-b">
                      {user?.email || 'employee@ceitcs.com'}
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/employee/profile')}>
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
          </header>

          <div className="container max-w-full h-full px-4 md:px-6 mx-auto py-6 mt-16">
            {children}
          </div>
        </main>

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
    </ProfileCompletionCheck>
  );
};

export default EmployeeLayout;