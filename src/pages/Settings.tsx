
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import PasswordSettings from "@/components/settings/PasswordSettings";
import PreferencesSettings from "@/components/settings/PreferencesSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Check URL for specific settings section
  const path = window.location.pathname;
  useState(() => {
    if (path.includes("/password")) {
      setActiveTab("password");
    } else if (path.includes("/preferences")) {
      setActiveTab("preferences");
    } else {
      setActiveTab("profile");
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarLoggedIn />

      <main className="flex-grow pt-24 pb-12">
        <div className="hr-container">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Account Settings</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => {
                setActiveTab(value);
                navigate(`/settings${value === "profile" ? "" : `/${value}`}`);
              }}
              className="w-full"
            >
              <TabsList className="w-full border-b rounded-none bg-transparent p-0 h-auto dark:border-gray-700">
                <div className="flex">
                  <TabsTrigger 
                    value="profile" 
                    className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent dark:text-gray-300 dark:data-[state=active]:text-white"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="password" 
                    className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent dark:text-gray-300 dark:data-[state=active]:text-white"
                  >
                    Password
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences" 
                    className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent dark:text-gray-300 dark:data-[state=active]:text-white"
                  >
                    Preferences
                  </TabsTrigger>
                </div>
              </TabsList>
              <div className="p-6">
                <TabsContent value="profile" className="m-0">
                  <ProfileSettings />
                </TabsContent>
                <TabsContent value="password" className="m-0">
                  <PasswordSettings />
                </TabsContent>
                <TabsContent value="preferences" className="m-0">
                  <PreferencesSettings />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
