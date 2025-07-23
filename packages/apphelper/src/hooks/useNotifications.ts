import React, { useState, useEffect, useCallback } from 'react';
import { NotificationService, NotificationCounts } from '../helpers/NotificationService';
import { UserContextInterface } from '@churchapps/helpers';

export interface UseNotificationsResult {
  counts: NotificationCounts;
  isLoading: boolean;
  isReady: boolean;
  refresh: () => Promise<void>;
  error: string | null;
}

/**
 * Custom hook for managing real-time notifications
 * 
 * @param context - User context containing person and church information
 * @returns Object containing notification counts and management functions
 * 
 * @example
 * ```tsx
 * const { counts, isLoading, refresh } = useNotifications(context);
 * 
 * return (
 *   <UserMenu 
 *     notificationCounts={counts}
 *     loadCounts={refresh}
 *     // ... other props
 *   />
 * );
 * ```
 */
export function useNotifications(context: UserContextInterface | null): UseNotificationsResult {
  const [counts, setCounts] = useState<NotificationCounts>({ notificationCount: 0, pmCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the singleton instance only once
  const notificationService = React.useMemo(() => NotificationService.getInstance(), []);

  // Initialize the service when context becomes available
  useEffect(() => {
    console.log('🔍 useNotifications: Initialize effect triggered. Person ID:', context?.person?.id, 'Church ID:', context?.userChurch?.church?.id);
    
    if (!context?.person?.id || !context?.userChurch?.church?.id) {
      console.log('🔍 useNotifications: Missing context, setting loading to false');
      setIsLoading(false);
      return;
    }

    const initializeService = async () => {
      try {
        console.log('🔍 useNotifications: Starting service initialization');
        setIsLoading(true);
        setError(null);
        
        await notificationService.initialize(context);
        console.log('🔍 useNotifications: Service initialization completed');
      } catch (err) {
        console.error("❌ useNotifications: Failed to initialize:", err);
        setError(err instanceof Error ? err.message : 'Failed to initialize notifications');
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, [context?.person?.id, context?.userChurch?.church?.id]);

  // Subscribe to notification count changes
  useEffect(() => {
    console.log('🔍 useNotifications: Setting up subscription');
    const unsubscribe = notificationService.subscribe((newCounts) => {
      console.log('🔍 useNotifications: Received new counts:', newCounts);
      setCounts(newCounts);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔍 useNotifications: Cleaning up subscription');
      unsubscribe();
    };
  }, [notificationService]);

  // Refresh function
  const refresh = useCallback(async () => {
    try {
      setError(null);
      await notificationService.refresh();
    } catch (err) {
      console.error("❌ useNotifications: Refresh failed:", err);
      setError(err instanceof Error ? err.message : 'Failed to refresh notifications');
    }
  }, [notificationService]);

  return {
    counts,
    isLoading,
    isReady: notificationService.isReady(),
    refresh,
    error
  };
}