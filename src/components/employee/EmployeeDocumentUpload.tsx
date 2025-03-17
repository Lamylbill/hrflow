
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Document categories and types
const documentTypes = {
  "Compliance & Records": [
    "Employment Contract",
    "Identification Documents",
    "Work Pass / Employment Pass",
    "Bank Account Details",
    "Tax Forms",
    "Emergency Contact Details"
  ],
  "HR & Payroll Documents": [
    "Payslips & Salary History",
    "Leave & Medical Certificates",
    "Performance Reviews",
    "Bonus / Incentive Documents"
  ],
  "Regulatory & Compliance": [
    "CPF Contribution Records",
    "Insurance Policies",
    "Training & Certification Documents"
  ],
  "Additional & Optional Documents": [
    "Resignation / Termination Letters",
    "Company Asset Agreements",
    "Non-Disclosure Agreement (NDA)"
  ]
};

const MAX_FILE_SIZE_KB = 200; // 200KB max file size

interface EmployeeDocumentUploadProps {
  employeeId: string;
  onDocumentUploaded: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  category: string;
  type: string;
  uploadDate: Date;
}

const EmployeeDocumentUpload = ({ employeeId, onDocumentUploaded }: EmployeeDocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const availableTypes = selectedCategory ? documentTypes[selectedCategory as keyof typeof documentTypes] || [] : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError("");
    
    if (!file) return;
    
    if (!selectedCategory || !selectedType) {
      setUploadError("Please select a document category and type first");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Check file size (convert to KB)
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > MAX_FILE_SIZE_KB) {
        setUploadError(`Document too large. Maximum size is ${MAX_FILE_SIZE_KB}KB.`);
        setIsUploading(false);
        return;
      }
      
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        // Here we'd normally upload to Supabase storage, but for now we'll simulate it
        // Mock successful upload with timeout
        setTimeout(() => {
          const newDocument: UploadedDocument = {
            id: Date.now().toString(),
            name: file.name,
            size: fileSizeKB,
            category: selectedCategory,
            type: selectedType,
            uploadDate: new Date()
          };
          
          setUploadedDocuments(prev => [...prev, newDocument]);
          
          toast({
            title: "Document uploaded",
            description: `${selectedType} document has been uploaded successfully.`,
          });
          
          setIsUploading(false);
          onDocumentUploaded();
        }, 1000);
      };
      
      reader.onerror = () => {
        setUploadError("Failed to read the file");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred during upload");
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document removed",
      description: "Document has been removed successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="document-category" className="text-sm font-medium dark:text-gray-200">Document Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full mt-1.5 dark:bg-gray-700 dark:text-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              {Object.keys(documentTypes).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="document-type" className="text-sm font-medium dark:text-gray-200">Document Type</Label>
          <Select 
            value={selectedType} 
            onValueChange={setSelectedType}
            disabled={!selectedCategory}
          >
            <SelectTrigger className="w-full mt-1.5 dark:bg-gray-700 dark:text-white">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              {availableTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full dark:bg-gray-700 dark:text-white"
            disabled={isUploading || !selectedCategory || !selectedType}
            type="button"
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileChange}
              disabled={isUploading || !selectedCategory || !selectedType}
            />
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Document
          </Button>
        </div>
        
        {uploadError && (
          <div className="text-xs text-destructive flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {uploadError}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground dark:text-gray-400">
          Maximum file size: {MAX_FILE_SIZE_KB}KB
        </div>
      </div>

      {uploadedDocuments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
          <div className="space-y-2">
            {uploadedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size.toFixed(1)} KB • {doc.uploadDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocumentUpload;
