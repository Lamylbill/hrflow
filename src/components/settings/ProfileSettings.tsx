
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useAuth();

  // Load user data from localStorage
  useEffect(() => {
    if (userId) {
      // Get user profile info from localStorage
      const storedName = localStorage.getItem("userName");
      const storedEmail = localStorage.getItem("userEmail");
      const storedPhone = localStorage.getItem(`${userId}:userPhone`);
      const storedAvatar = localStorage.getItem(`${userId}:userAvatar`);
      
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhone(storedPhone);
      if (storedAvatar) setAvatarUrl(storedAvatar);
    }
  }, [userId]);

  const handleSave = () => {
    if (!userId) return;
    
    // Save updated profile information to localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem(`${userId}:userPhone`, phone);
    
    if (avatarUrl) {
      localStorage.setItem(`${userId}:userAvatar`, avatarUrl);
    }
    
    // Notify user of successful update
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    });
    
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            This information will be displayed throughout the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <div className="relative">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <span className="sr-only">Change avatar</span>
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <span className="text-xs font-bold">+</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={!isEditing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={true} // Email should be read-only as it's tied to authentication
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSettings;
