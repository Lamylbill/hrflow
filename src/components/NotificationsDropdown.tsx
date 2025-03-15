
import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

interface NotificationsDropdownProps {
  showDropdown?: boolean;
  onToggle?: (show: boolean) => void;
  onMouseLeave?: () => void;
}

const NotificationsDropdown = ({ showDropdown, onToggle, onMouseLeave }: NotificationsDropdownProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage or initialize with empty array
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Add some example notifications for UI demonstration
      const demoNotifications: Notification[] = [
        {
          id: "1",
          title: "Leave Request Approved",
          message: "Your leave request has been approved by HR.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          type: "success"
        },
        {
          id: "2",
          title: "New Employee Joined",
          message: "Sarah Johnson has joined the Engineering team.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false,
          type: "info"
        },
        {
          id: "3",
          title: "Payroll Processing",
          message: "Monthly payroll is being processed.",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true,
          type: "info"
        }
      ];
      setNotifications(demoNotifications);
      localStorage.setItem("notifications", JSON.stringify(demoNotifications));
    }
  }, []);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const removeNotification = (id: string) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "info": default: return "bg-blue-100 text-blue-800";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden max-h-[80vh] flex flex-col"
      onMouseLeave={onMouseLeave}
    >
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2 text-primary" />
          <span className="font-medium">Notifications</span>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs text-primary hover:text-primary/80"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
            >
              <div className="flex justify-between">
                <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(notification.type)}`}>
                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                </span>
                <div className="flex space-x-1">
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-primary"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="font-medium text-sm mt-1">{notification.title}</div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <div className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 text-center border-t border-gray-200">
        <button className="text-sm text-primary hover:text-primary/80">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
