
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
      
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose between light and dark mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch 
              id="dark-mode" 
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="compact-view">Compact View</Label>
            <Switch 
              id="compact-view" 
              checked={compactView}
              onCheckedChange={handleCompactViewToggle}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={handleEmailNotificationsToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="app-notifications">In-App Notifications</Label>
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
