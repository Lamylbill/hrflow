
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const PreferencesSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);

  // Load preferences on component mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem("userPreferences");
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);
      setEmailNotifications(preferences.emailNotifications ?? true);
      setAppNotifications(preferences.appNotifications ?? true);
      setDarkMode(preferences.darkMode ?? false);
      setCompactView(preferences.compactView ?? false);
    }
  }, []);

  const handleSavePreferences = () => {
    const preferences = {
      emailNotifications,
      appNotifications,
      darkMode,
      compactView
    };
    
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    
    toast({
      title: "Preferences saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Customize your application experience.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about important events via email
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="app-notifications" className="text-base">App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive in-app notifications
                </p>
              </div>
              <Switch 
                id="app-notifications" 
                checked={appNotifications}
                onCheckedChange={setAppNotifications}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Appearance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark mode for the interface
                </p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact-view" className="text-base">Compact View</Label>
                <p className="text-sm text-muted-foreground">
                  Use compact spacing in lists and tables
                </p>
              </div>
              <Switch 
                id="compact-view" 
                checked={compactView}
                onCheckedChange={setCompactView}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Button onClick={handleSavePreferences}>Save Preferences</Button>
    </div>
  );
};

export default PreferencesSettings;
