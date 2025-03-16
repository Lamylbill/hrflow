
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const PreferencesSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);

  const isDarkMode = theme === "dark";

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  const handleCompactViewToggle = () => {
    setCompactView(!compactView);
    // Apply compact view logic here
    document.documentElement.classList.toggle("compact-view");
    
    toast({
      title: compactView ? "Compact view disabled" : "Compact view enabled",
      description: compactView 
        ? "The interface will now show more content" 
        : "The interface will now be more compact",
    });
  };

  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
    toast({
      title: emailNotifications ? "Email notifications disabled" : "Email notifications enabled",
      description: "Your notification preferences have been updated",
    });
  };

  const handleAppNotificationsToggle = () => {
    setAppNotifications(!appNotifications);
    toast({
      title: appNotifications ? "App notifications disabled" : "App notifications enabled",
      description: "Your notification preferences have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize your application experience
        </p>
      </div>
      
      <Card className="border dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="dark:text-white">
          <CardTitle>Theme</CardTitle>
          <CardDescription className="dark:text-gray-300">
            Choose between light and dark mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="dark:text-gray-200">Dark Mode</Label>
            <Switch 
              id="dark-mode" 
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="compact-view" className="dark:text-gray-200">Compact View</Label>
            <Switch 
              id="compact-view" 
              checked={compactView}
              onCheckedChange={handleCompactViewToggle}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="dark:text-white">
          <CardTitle>Notifications</CardTitle>
          <CardDescription className="dark:text-gray-300">
            Configure how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="dark:text-gray-200">Email Notifications</Label>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={handleEmailNotificationsToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="app-notifications" className="dark:text-gray-200">In-App Notifications</Label>
            <Switch 
              id="app-notifications" 
              checked={appNotifications}
              onCheckedChange={handleAppNotificationsToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesSettings;
