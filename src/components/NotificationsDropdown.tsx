
import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";

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
}

const NotificationsDropdown = ({ onToggle }: NotificationsDropdownProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { userId } = useAuth();
  
  useEffect(() => {
    if (!userId) return;
    
    const userSpecificKey = `${userId}:notifications`;
    const storedNotifications = localStorage.getItem(userSpecificKey);
    
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error("Error parsing notifications:", error);
        
        const welcomeNotification = {
          id: Date.now().toString(),
          title: "Welcome to HR Flow",
          message: "Thank you for using HR Flow. Get started by adding employees to your database.",
          timestamp: new Date().toISOString(),
          read: false,
          type: "info" as const
        };
        
        setNotifications([welcomeNotification]);
        localStorage.setItem(userSpecificKey, JSON.stringify([welcomeNotification]));
      }
    } else {
      const welcomeNotification = {
        id: Date.now().toString(),
        title: "Welcome to HR Flow",
        message: "Thank you for using HR Flow. Get started by adding employees to your database.",
        timestamp: new Date().toISOString(),
        read: false,
        type: "info" as const
      };
      
      setNotifications([welcomeNotification]);
      localStorage.setItem(userSpecificKey, JSON.stringify([welcomeNotification]));
    }
  }, [userId]);

  const markAsRead = (id: string) => {
    if (!userId) return;
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    const userSpecificKey = `${userId}:notifications`;
    localStorage.setItem(userSpecificKey, JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    if (!userId) return;
    
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    
    const userSpecificKey = `${userId}:notifications`;
    localStorage.setItem(userSpecificKey, JSON.stringify(updatedNotifications));
  };

  const removeNotification = (id: string) => {
    if (!userId) return;
    
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id
    );
    setNotifications(updatedNotifications);
    
    const userSpecificKey = `${userId}:notifications`;
    localStorage.setItem(userSpecificKey, JSON.stringify(updatedNotifications));
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-xs flex items-center justify-center text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" alignOffset={-5} className="w-80 p-0 mt-2">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center">
            <Bell className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium dark:text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80 dark:text-primary"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/50 ${notification.read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'}`}
              >
                <div className="flex justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(notification.type)} dark:bg-opacity-20`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                  <div className="flex space-x-1">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="font-medium text-sm mt-1 dark:text-white">{notification.title}</div>
                <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">{notification.message}</p>
                <div className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;
