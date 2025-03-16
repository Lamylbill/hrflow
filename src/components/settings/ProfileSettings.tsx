
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { EventTypes, emitEvent } from "@/utils/eventBus";

const ProfileSettings = () => {
  const { userId } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (userId) {
      // Load user profile data with user-specific keys
      const storedName = localStorage.getItem(`${userId}:userName`) || localStorage.getItem("userName") || "";
      const storedEmail = localStorage.getItem(`${userId}:userEmail`) || localStorage.getItem("userEmail") || "";
      const storedPhone = localStorage.getItem(`${userId}:userPhone`) || "";
      const storedJobTitle = localStorage.getItem(`${userId}:userJobTitle`) || "";
      const storedBio = localStorage.getItem(`${userId}:userBio`) || "";
      const storedAvatarUrl = localStorage.getItem(`${userId}:userAvatar`) || "";
      
      setName(storedName);
      setEmail(storedEmail);
      setPhone(storedPhone);
      setJobTitle(storedJobTitle);
      setBio(storedBio);
      setAvatarUrl(storedAvatarUrl);
      
      setUnsavedChanges(false);
    }
  }, [userId]);
  
  const handleChange = () => {
    setUnsavedChanges(true);
  };
  
  const handleSave = () => {
    if (!userId) return;
    
    // Save with user-specific keys
    localStorage.setItem(`${userId}:userName`, name);
    localStorage.setItem(`${userId}:userEmail`, email);
    localStorage.setItem(`${userId}:userPhone`, phone);
    localStorage.setItem(`${userId}:userJobTitle`, jobTitle);
    localStorage.setItem(`${userId}:userBio`, bio);
    if (avatarUrl) localStorage.setItem(`${userId}:userAvatar`, avatarUrl);
    
    // Also update the global keys for current session
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    
    // Emit event to notify other components about the profile update
    emitEvent(EventTypes.USER_PROFILE_UPDATED, { userId, name });
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
    
    setUnsavedChanges(false);
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string;
        setAvatarUrl(imageUrl);
        setUnsavedChanges(true);
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-lg bg-primary/10 dark:bg-primary/20 text-primary">
              {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="rounded-full bg-primary p-2 text-white hover:bg-primary/80 transition-colors">
                <Camera className="h-4 w-4" />
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-medium">{name || "Your Name"}</h3>
          <p className="text-muted-foreground dark:text-gray-300">{jobTitle || "Job Title"}</p>
          <p className="text-muted-foreground dark:text-gray-300">{email}</p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground dark:text-white">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleChange();
            }}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground dark:text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleChange();
            }}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground dark:text-white">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              handleChange();
            }}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="job-title" className="text-foreground dark:text-white">Job Title</Label>
          <Input
            id="job-title"
            value={jobTitle}
            onChange={(e) => {
              setJobTitle(e.target.value);
              handleChange();
            }}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-foreground dark:text-white">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              handleChange();
            }}
            className="min-h-[100px] dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={!unsavedChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
