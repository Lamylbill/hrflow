
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Camera, X } from "lucide-react";

const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Load user details on component mount
  useEffect(() => {
    setName(localStorage.getItem("userName") || "");
    setEmail(localStorage.getItem("userEmail") || "");
    setPosition(localStorage.getItem("userPosition") || "");
    setDepartment(localStorage.getItem("userDepartment") || "");
    setAvatarUrl(localStorage.getItem("userAvatar") || "");
  }, []);

  const handleSaveProfile = () => {
    // Save to localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPosition", position);
    localStorage.setItem("userDepartment", department);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Convert to base64 for storage in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem("userAvatar", base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeAvatar = () => {
    setAvatarUrl("");
    localStorage.removeItem("userAvatar");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information and profile picture.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full opacity-0 cursor-pointer" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <Camera className="mr-2 h-4 w-4" />
              Change
            </Button>
            {avatarUrl && (
              <Button variant="outline" size="sm" onClick={removeAvatar}>
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Recommended: Square JPG, PNG. Max 1MB.
          </p>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="HR Manager"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Human Resources"
                />
              </div>
            </div>
          </div>
          
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
