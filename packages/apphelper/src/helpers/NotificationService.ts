import { SocketHelper } from "./SocketHelper";
import { ApiHelper, UserContextInterface } from "@churchapps/helpers";

export interface NotificationCounts {
  notificationCount: number;
  pmCount: number;
}

export class NotificationService {
  private static instance: NotificationService;
  private counts: NotificationCounts = { notificationCount: 0, pmCount: 0 };
  private listeners: Array<(counts: NotificationCounts) => void> = [];
  private isInitialized: boolean = false;
  private currentPersonId: string | null = null;
  private loadTimeout: any | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize the notification service with user context
   */
  async initialize(context: UserContextInterface): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Store current person ID for conversation counting
      this.currentPersonId = context?.person?.id || null;
      
      // Initialize WebSocket connection
      await SocketHelper.init();

      // Set person/church context for websocket
      if (context?.person?.id && context?.userChurch?.church?.id) {
        SocketHelper.setPersonChurch({
          personId: context.person.id,
          churchId: context.userChurch.church.id
        });
      }

      // Register handlers for notification updates
      this.registerWebSocketHandlers();

      // Load initial notification counts
      await this.loadNotificationCounts();

      this.isInitialized = true;

    } catch (error) {
      console.error("❌ Failed to initialize NotificationService:", error);
      throw error;
    }
  }

  /**
   * Register websocket handlers for real-time notification updates
   */
  private registerWebSocketHandlers(): void {
    // Handler for new private messages
    SocketHelper.addHandler("privateMessage", "NotificationService-PM", (data: any) => {
      console.log('🔔 NotificationService: New private message received, updating counts');
      this.debouncedLoadNotificationCounts();
    });

    // Handler for general notifications
    SocketHelper.addHandler("notification", "NotificationService-Notification", (data: any) => {
      console.log('🔔 NotificationService: New notification received, updating counts');
      this.debouncedLoadNotificationCounts();
    });

    // Handler for message updates that could affect notification counts
    SocketHelper.addHandler("message", "NotificationService-MessageUpdate", (data: any) => {
      // Only update counts if the message update involves the current person
      if (data?.message?.personId === this.currentPersonId || 
          data?.notifyPersonId === this.currentPersonId) {
        console.log('🔔 NotificationService: Message update affecting current user, updating counts');
        this.debouncedLoadNotificationCounts();
      }
    });

    // Handler for reconnect events
    SocketHelper.addHandler("reconnect", "NotificationService-Reconnect", (data: any) => {
      console.log('🔔 NotificationService: WebSocket reconnected, refreshing counts');
      this.loadNotificationCounts(); // Don't debounce reconnect - need immediate update
    });
  }

  /**
   * Load notification counts from the API with debouncing
   */
  private debouncedLoadNotificationCounts(): void {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
    
    this.loadTimeout = setTimeout(() => {
      this.loadNotificationCounts();
    }, 300); // 300ms debounce
  }

  /**
   * Load notification counts from the API
   */
  async loadNotificationCounts(): Promise<void> {
    try {
      // Load private message count (count unique conversations, not individual messages)
      const privateMessages = await ApiHelper.get("/privateMessages", "MessagingApi");
      let pmCount = 0;
      
      if (Array.isArray(privateMessages)) {
        // Count unique conversations with unread messages only
        const uniqueUnreadPeople = new Set<string>();
        const currentPersonId = this.currentPersonId;
        
        privateMessages.forEach((pm: any) => {
          if (currentPersonId && pm.notifyPersonId === currentPersonId) {
            const personId = (pm.fromPersonId === currentPersonId) ? pm.toPersonId : pm.fromPersonId;
            uniqueUnreadPeople.add(personId);
          }
        });
        
        pmCount = uniqueUnreadPeople.size;
      }

      // Load general notification count
      let notificationCount = 0;
      try {
        const notifications = await ApiHelper.get("/notifications", "MessagingApi");
        notificationCount = Array.isArray(notifications) ? notifications.length : 0;
      } catch (error) {
        // Notifications endpoint not available, default to 0
        notificationCount = 0;
      }

      const newCounts = { notificationCount, pmCount };

      // Update counts and notify listeners
      this.updateCounts(newCounts);

    } catch (error) {
      console.error("❌ Failed to load notification counts:", error);
      // Don't throw - just log the error and keep existing counts
    }
  }

  /**
   * Update counts and notify all listeners
   */
  private updateCounts(newCounts: NotificationCounts): void {
    const countsChanged = 
      this.counts.notificationCount !== newCounts.notificationCount ||
      this.counts.pmCount !== newCounts.pmCount;

    if (countsChanged) {
      this.counts = { ...newCounts };
      
      // Notify all listeners
      this.listeners.forEach(listener => {
        try {
          listener(this.counts);
        } catch (error) {
          console.error("❌ Error in notification listener:", error);
        }
      });
    }
  }

  /**
   * Subscribe to notification count changes
   */
  subscribe(listener: (counts: NotificationCounts) => void): () => void {
    this.listeners.push(listener);

    // Immediately call with current counts
    listener(this.counts);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get current notification counts
   */
  getCounts(): NotificationCounts {
    return { ...this.counts };
  }

  /**
   * Manually refresh notification counts
   */
  async refresh(): Promise<void> {
    await this.loadNotificationCounts();
  }

  /**
   * Cleanup the service
   */
  cleanup(): void {
    // Clear any pending timeout
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }

    // Remove websocket handlers
    SocketHelper.removeHandler("NotificationService-PM");
    SocketHelper.removeHandler("NotificationService-Notification");
    SocketHelper.removeHandler("NotificationService-MessageUpdate");
    SocketHelper.removeHandler("NotificationService-Reconnect");

    // Clear listeners
    this.listeners = [];
    
    // Reset state
    this.counts = { notificationCount: 0, pmCount: 0 };
    this.currentPersonId = null;
    this.isInitialized = false;
  }

  /**
   * Check if service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && SocketHelper.isConnected();
  }
}