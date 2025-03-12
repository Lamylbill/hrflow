
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveCard from "@/components/LeaveCard";
import { LeaveRequest } from "@/types/leave";

interface LeaveTabContentProps {
  filteredLeaveRequests: LeaveRequest[];
  onStatusChange?: () => void;
}

const LeaveTabContent = ({ filteredLeaveRequests, onStatusChange }: LeaveTabContentProps) => {
  // Group leave requests by status
  const pendingRequests = filteredLeaveRequests.filter(
    (leave) => leave.status === "pending"
  );
  const approvedRequests = filteredLeaveRequests.filter(
    (leave) => leave.status === "approved"
  );
  const rejectedRequests = filteredLeaveRequests.filter(
    (leave) => leave.status === "rejected"
  );

  return (
    <Tabs defaultValue="all" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Requests</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaveRequests.length > 0 ? (
            filteredLeaveRequests.map((leave, index) => (
              <div 
                key={leave.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <LeaveCard leave={leave} onStatusChange={onStatusChange} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No leave requests found</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="pending">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((leave, index) => (
              <div 
                key={leave.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <LeaveCard leave={leave} onStatusChange={onStatusChange} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No pending leave requests</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="approved">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedRequests.length > 0 ? (
            approvedRequests.map((leave, index) => (
              <div 
                key={leave.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <LeaveCard leave={leave} onStatusChange={onStatusChange} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No approved leave requests</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="rejected">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map((leave, index) => (
              <div 
                key={leave.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <LeaveCard leave={leave} onStatusChange={onStatusChange} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No rejected leave requests</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default LeaveTabContent;
