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
  /**
   * Initialize the notification service with user context
   */
  async initialize(context: UserContextInterface): Promise<void> {
    if (this.isInitialized) {
      console.log('🔔 NotificationService: Already initialized, skipping');
      return;
    }

    console.log('🔔 NotificationService: Starting initialization with context:', {
      hasUser: !!context?.user,
      hasPerson: !!context?.person,
      hasUserChurch: !!context?.userChurch,
      personId: context?.person?.id,
      churchId: context?.userChurch?.church?.id
    });

    try {
      // Store current person ID for conversation counting
      this.currentPersonId = context?.person?.id || null;
      console.log('👤 NotificationService: Set current person ID:', this.currentPersonId);
      
      // Initialize WebSocket connection
      console.log('🔌 NotificationService: Initializing SocketHelper...');
      await SocketHelper.init();

      // Set person/church context for websocket
      if (context?.person?.id && context?.userChurch?.church?.id) {
        console.log('🔗 NotificationService: Setting person/church context in SocketHelper');
        SocketHelper.setPersonChurch({
          personId: context.person.id,
          churchId: context.userChurch.church.id
        });
      } else {
        console.warn('⚠️ NotificationService: Missing person/church IDs, cannot set socket context');
      }

      // Register handlers for notification updates
      console.log('📋 NotificationService: Registering WebSocket handlers');
      this.registerWebSocketHandlers();

      // Load initial notification counts
      console.log('📊 NotificationService: Loading initial notification counts');
      await this.loadNotificationCounts();

      this.isInitialized = true;
      console.log('✅ NotificationService: Initialization complete');

    } catch (error) {
      console.error("❌ Failed to initialize NotificationService:", error);
      throw error;
    }
  }

  /**
   * Register websocket handlers for real-time notification updates
   */
  /**
   * Register websocket handlers for real-time notification updates
   */
  /**
   * Register websocket handlers for real-time notification updates
   */
  private registerWebSocketHandlers(): void {
    // Handler for new private messages
    SocketHelper.addHandler("privateMessage", "NotificationService-PM", (data: any) => {
      console.log('🔔 NotificationService: New private message received, updating counts');
      console.log('📨 Private message data:', data);
      console.log('🔄 NotificationService: About to call debouncedLoadNotificationCounts...');
      try {
        this.debouncedLoadNotificationCounts();
        console.log('✅ NotificationService: debouncedLoadNotificationCounts called successfully');
      } catch (error) {
        console.error('❌ NotificationService: Error calling debouncedLoadNotificationCounts:', error);
      }
    });

    // Handler for general notifications
    SocketHelper.addHandler("notification", "NotificationService-Notification", (data: any) => {
      console.log('🔔 NotificationService: New notification received, updating counts');
      console.log('📨 Notification data:', data);
      console.log('🔄 NotificationService: About to call debouncedLoadNotificationCounts...');
      try {
        this.debouncedLoadNotificationCounts();
        console.log('✅ NotificationService: debouncedLoadNotificationCounts called successfully');
      } catch (error) {
        console.error('❌ NotificationService: Error calling debouncedLoadNotificationCounts:', error);
      }
    });

    // Handler for message updates that could affect notification counts
    SocketHelper.addHandler("message", "NotificationService-MessageUpdate", (data: any) => {
      // Only update counts if the message update involves the current person
      if (data?.message?.personId === this.currentPersonId || 
          data?.notifyPersonId === this.currentPersonId) {
        console.log('🔔 NotificationService: Message update affecting current user, updating counts');
        console.log('📨 Message update data:', data);
        console.log('🔄 NotificationService: About to call debouncedLoadNotificationCounts...');
        try {
          this.debouncedLoadNotificationCounts();
          console.log('✅ NotificationService: debouncedLoadNotificationCounts called successfully');
        } catch (error) {
          console.error('❌ NotificationService: Error calling debouncedLoadNotificationCounts:', error);
        }
      } else {
        console.log('🔕 NotificationService: Message update not for current user, ignoring');
        console.log('📨 Message personId:', data?.message?.personId, 'Current personId:', this.currentPersonId);
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
  /**
   * Load notification counts from the API with debouncing
   */
  private debouncedLoadNotificationCounts(): void {
    console.log('⏰ NotificationService: Debounced load triggered');
    
    if (this.loadTimeout) {
      console.log('⏰ NotificationService: Clearing existing timeout');
      clearTimeout(this.loadTimeout);
    }
    
    this.loadTimeout = setTimeout(() => {
      console.log('⏰ NotificationService: Timeout expired, loading counts...');
      this.loadNotificationCounts();
    }, 300); // 300ms debounce
  }

  /**
   * Load notification counts from the API
   */
  /**
   * Load notification counts from the API
   */
  async loadNotificationCounts(): Promise<void> {
    console.log('📊 NotificationService: Loading notification counts from API...');
    
    try {
      // Use the unreadCount endpoint which returns both notification and PM counts
      console.log('🌐 NotificationService: Making API call to /notifications/unreadCount');
      const counts = await ApiHelper.get("/notifications/unreadCount", "MessagingApi");
      console.log('📊 NotificationService: API response:', counts);
      
      const newCounts = { 
        notificationCount: counts?.notificationCount || 0, 
        pmCount: counts?.pmCount || 0
      };

      console.log('🔄 NotificationService: Updating counts:', newCounts);
      
      // Update counts and notify listeners
      this.updateCounts(newCounts);

    } catch (error) {
      console.error("❌ Failed to load notification counts:", error);
      console.error("❌ Error details:", {
        message: error.message,
        status: error.status,
        response: error.response
      });
      // Don't throw - just log the error and keep existing counts
    }
  }

  /**
   * Update counts and notify all listeners
   */
  /**
   * Update counts and notify all listeners
   */
  private updateCounts(newCounts: NotificationCounts): void {
    console.log('🔔 NotificationService: updateCounts called with:', newCounts);
    console.log('🔔 NotificationService: Current counts:', this.counts);
    console.log('🔔 NotificationService: Number of listeners:', this.listeners.length);
    
    const countsChanged = 
      this.counts.notificationCount !== newCounts.notificationCount ||
      this.counts.pmCount !== newCounts.pmCount;

    console.log('🔄 NotificationService: Counts changed?', countsChanged);

    if (countsChanged) {
      this.counts = { ...newCounts };
      console.log('✅ NotificationService: Counts updated, notifying listeners...');
      
      // Notify all listeners
      this.listeners.forEach((listener, index) => {
        try {
          console.log(`📢 NotificationService: Calling listener ${index + 1}/${this.listeners.length}`);
          listener(this.counts);
        } catch (error) {
          console.error(`❌ Error in notification listener ${index}:`, error);
        }
      });
    } else {
      console.log('⚪ NotificationService: Counts unchanged, not notifying listeners');
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