import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import EmployeeLayout from "@/components/layout/EmployeeLayout";
import Dashboard from "@/components/dashboard/Dashboard";
import EmployeesList from "@/components/employees/EmployeesList";
import EmployeeForm from "@/components/employees/EmployeeForm";
import ViewEmployee from "@/pages/ViewEmployee";
import Documents from "@/pages/Documents";
import Communications from "@/pages/Communications";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import EmployeeProfile from "@/pages/employee/Profile";
import EmployeeDocuments from "@/pages/employee/Documents";
import EmployeeCommunications from "@/pages/employee/Communications";
import EmployeeSettings from "@/pages/employee/Settings";
import ProfileCompletion from "@/pages/employee/ProfileCompletion";

const queryClient = new QueryClient();

// Protected Route component with minimal checks
const ProtectedRoute = ({ children, requiredRole }: { children: ReactNode, requiredRole?: 'admin' | 'employee' }) => {
  const user = localStorage.getItem('ceitcs-user');
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // No role validation - allow any authenticated user to access any route
  // This is as per the requirement to remove all login restrictions
  
  return <>{children}</>;
};

// Component to handle role-based redirection
const RoleRedirect = () => {
  const user = localStorage.getItem('ceitcs-user');
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  try {
    const userData = JSON.parse(user);
    if (userData.role === 'admin') {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/employee/dashboard" />;
    }
  } catch (error) {
    console.error("Error parsing user data", error);
    return <Navigate to="/login" />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Root route - redirects based on role */}
          <Route path="/" element={<RoleRedirect />} />
          
          {/* Admin Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <EmployeesList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <EmployeeForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-employee/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <ViewEmployee />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <Documents />
                </Layout>
              </ProtectedRoute>
            }
          />          <Route
            path="/communications"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <Communications />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Employee Protected Routes */}
          <Route
            path="/employee/profile-completion"
            element={
              <ProtectedRoute requiredRole="employee">
                <ProfileCompletion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeLayout>
                  <EmployeeDashboard />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeLayout>
                  <EmployeeProfile />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/documents"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeLayout>
                  <EmployeeDocuments />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/communications"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeLayout>
                  <EmployeeCommunications />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/settings"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeLayout>
                  <EmployeeSettings />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
