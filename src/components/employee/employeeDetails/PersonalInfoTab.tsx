
import React from "react";
import { User, Mail, Phone, Calendar, Globe, MapPin, Contact } from "lucide-react";
import { Employee } from "@/types/employee";

interface PersonalInfoTabProps {
  employee: Employee;
}

const PersonalInfoTab = ({ employee }: PersonalInfoTabProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-2">Personal Information</h4>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <User className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Full Name</p>
          <p className="text-sm text-muted-foreground">{employee.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Phone className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Phone</p>
          <p className="text-sm text-muted-foreground">{employee.phone || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Date of Birth</p>
          <p className="text-sm text-muted-foreground">{employee.dateOfBirth || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <User className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Gender</p>
          <p className="text-sm text-muted-foreground">{employee.gender || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Nationality</p>
          <p className="text-sm text-muted-foreground">{employee.nationality || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <MapPin className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Address</p>
          <p className="text-sm text-muted-foreground">{employee.address || 'Not provided'}</p>
        </div>
      </div>
      
      <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-6">Emergency Contact</h4>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Contact className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Emergency Contact</p>
          <p className="text-sm text-muted-foreground">
            {employee.emergencyContactName ? 
              `${employee.emergencyContactName} (${employee.emergencyContactRelationship || 'Not specified'})` : 
              'Not provided'}
          </p>
          {employee.emergencyContactPhone && (
            <p className="text-xs text-muted-foreground">{employee.emergencyContactPhone}</p>
          )}
          {employee.emergencyContactEmail && (
            <p className="text-xs text-muted-foreground">{employee.emergencyContactEmail}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
