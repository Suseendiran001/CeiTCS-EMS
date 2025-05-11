import React from 'react';

interface ProfileCompletionCheckProps {
  children: React.ReactNode;
}

// Profile completion check is now disabled - all employees can access the system
// without completing their profile as per the requirements
const ProfileCompletionCheck = ({ children }: ProfileCompletionCheckProps) => {
  // Simply return children without any checks
  return <>{children}</>;
};

export default ProfileCompletionCheck;