
import React from 'react';

interface AuthLoadingIndicatorProps {
  message?: string;
}

const AuthLoadingIndicator: React.FC<AuthLoadingIndicatorProps> = ({ 
  message = "Checking authentication..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default AuthLoadingIndicator;
