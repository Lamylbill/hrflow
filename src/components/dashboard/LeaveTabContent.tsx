
import { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import { getLeaveRequests } from "@/utils/localStorage";

const LeaveTabContent = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaveRequests = async () => {
      try {
        const data = await getLeaveRequests();
        setLeaveRequests(data);
      } catch (error) {
        console.error("Error loading leave requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaveRequests();
  }, []);

  const pendingCount = leaveRequests.filter(request => request.status === "pending").length;
  const approvedCount = leaveRequests.filter(request => request.status === "approved").length;
  const rejectedCount = leaveRequests.filter(request => request.status === "rejected").length;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const currentMonthLeave = leaveRequests.filter(request => {
    const startDate = new Date(request.startDate);
    return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
  });

  const upcomingLeave = leaveRequests
    .filter(request => request.status === "approved" && new Date(request.startDate) > currentDate)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const daysUntilNextLeave = upcomingLeave 
    ? Math.ceil((new Date(upcomingLeave.startDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected": return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending": default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "vacation": return "bg-blue-100 text-blue-800";
      case "sick": return "bg-red-100 text-red-800";
      case "personal": return "bg-purple-100 text-purple-800";
      case "maternity": case "paternity": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {isLoading ? (
        <div className="text-center py-8">Loading leave data...</div>
      ) : leaveRequests.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No leave requests yet</h3>
          <p className="text-gray-500 mb-4">When employees submit leave requests, they'll appear here</p>
          <Button className="mx-auto">Create Leave Request</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Leave Management</h2>
            <Button>Create Leave Request</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-700 font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2">{pendingCount}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">Approved</p>
              <p className="text-3xl font-bold mt-2">{approvedCount}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-700 font-medium">Rejected</p>
              <p className="text-3xl font-bold mt-2">{rejectedCount}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">This Month</p>
              <p className="text-3xl font-bold mt-2">{currentMonthLeave.length}</p>
            </div>
          </div>

          {upcomingLeave && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-indigo-900">Upcoming Leave</h3>
                  <p className="text-indigo-700 mt-1">
                    {upcomingLeave.employeeName} will be on {upcomingLeave.type.toLowerCase()} leave 
                    {daysUntilNextLeave === 0 ? " today" : 
                     daysUntilNextLeave === 1 ? " tomorrow" : 
                     ` in ${daysUntilNextLeave} days`} 
                    ({new Date(upcomingLeave.startDate).toLocaleDateString()} - {new Date(upcomingLeave.endDate).toLocaleDateString()})
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Recent Leave Requests</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveRequests.slice(0, 5).map((request) => {
                    const startDate = new Date(request.startDate);
                    const endDate = new Date(request.endDate);
                    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    
                    return (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLeaveTypeColor(request.type)}`}>
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                          <span className="ml-1 text-xs text-gray-400">
                            ({days} day{days !== 1 ? 's' : ''})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(request.status)}
                            <span className="ml-1 text-sm capitalize">{request.status}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {leaveRequests.length > 5 && (
                <div className="px-6 py-3 bg-gray-50 text-center">
                  <Button variant="link" size="sm">View all leave requests</Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Leave Calendar</h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Leave calendar view coming soon</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveTabContent;
