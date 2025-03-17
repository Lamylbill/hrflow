
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, RefreshCw, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDeletedItems, restoreDeletedItem } from "@/utils/localStorage";
import { DeletedItem } from "@/types/activity";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const DeletedItemsManager = () => {
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  const fetchDeletedItems = async () => {
    try {
      setIsLoading(true);
      const items = await getDeletedItems();
      setDeletedItems(items);
    } catch (error) {
      console.error("Error fetching deleted items:", error);
      toast({
        title: "Error",
        description: "Failed to load deleted items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const success = await restoreDeletedItem(id);
      if (success) {
        toast({
          title: "Item Restored",
          description: "The deleted item has been successfully restored.",
        });
        await fetchDeletedItems(); // Refresh the list
      } else {
        toast({
          title: "Restore Failed",
          description: "Unable to restore the item. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error restoring item:", error);
      toast({
        title: "Error",
        description: "An error occurred while restoring the item.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy h:mm a');
  };

  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEntityDescription = (item: DeletedItem) => {
    const entityData = item.entityData;
    switch (item.entityType) {
      case 'employee':
        return `${entityData.name || 'Unknown Employee'} (${entityData.position || 'No Position'})`;
      case 'payroll':
        return `Payroll for ${entityData.employeeName || 'Unknown Employee'} - ${entityData.period || 'No Period'}`;
      case 'leave':
        return `Leave request by ${entityData.employeeName || 'Unknown Employee'} (${entityData.leaveType || 'No Type'})`;
      default:
        return 'Unknown item';
    }
  };

  return (
    <Card className="border dark:border-gray-700 dark:bg-gray-800 mb-6">
      <CardHeader className="dark:text-white">
        <CardTitle>Deleted Items</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Items are automatically removed after 15 days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : deletedItems.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No deleted items to display
          </div>
        ) : (
          <div className="space-y-4">
            {deletedItems.map((item) => (
              <div key={item.id} className="border rounded-md p-4 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium dark:text-white">
                      {getEntityDescription(item)}
                    </h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" /> Deleted on {formatDate(item.deletedAt)}
                    </div>
                  </div>
                  <Badge variant={getDaysRemaining(item.expiryDate) < 3 ? "destructive" : "secondary"}>
                    {getDaysRemaining(item.expiryDate)} days left
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(item.id)}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeletedItemsManager;
