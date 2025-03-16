
import { useEffect } from 'react';
import { EventTypes, onEvent } from '@/utils/eventBus';

interface ProfileUpdateListenerProps {
  onProfileUpdate?: (data: any) => void;
}

/**
 * Component that listens for profile updates across the application
 * and triggers a refresh when needed
 */
const ProfileUpdateListener = ({ onProfileUpdate }: ProfileUpdateListenerProps) => {
  useEffect(() => {
    console.log("ProfileUpdateListener mounted, setting up listener");
    
    // Listen for profile updates using the event bus
    const cleanup = onEvent(EventTypes.USER_PROFILE_UPDATED, (data) => {
      console.log("Profile update detected via event bus", data);
      if (onProfileUpdate) {
        onProfileUpdate(data);
      }
    });
    
    return () => {
      console.log("ProfileUpdateListener unmounting, cleaning up listener");
      cleanup();
    };
  }, [onProfileUpdate]);

  // This component doesn't render anything visible
  return null;
};

export default ProfileUpdateListener;
