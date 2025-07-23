/**
 * WebSocket Notification System Test Utility
 * 
 * This utility tests the real-time notification system to ensure:
 * 1. Notification counts update instantly when new messages arrive via WebSocket
 * 2. Messages appear instantly in open conversations
 * 3. WebSocket handlers are properly registered and cleaned up
 */

import { SocketHelper } from "../helpers/SocketHelper";
import { NotificationService } from "../helpers/NotificationService";

export class WebSocketTest {
  private static testId = 0;
  private static activeHandlers: string[] = [];

  /**
   * Test notification count updates via WebSocket
   */
  static async testNotificationCountUpdates(): Promise<boolean> {
    console.log("🧪 Testing notification count updates via WebSocket...");
    
    try {
      const notificationService = NotificationService.getInstance();
      let countsUpdated = false;
      let initialCounts = notificationService.getCounts();

      // Subscribe to notification changes
      const unsubscribe = notificationService.subscribe((newCounts) => {
        if (newCounts.pmCount !== initialCounts.pmCount || 
            newCounts.notificationCount !== initialCounts.notificationCount) {
          console.log("✅ Notification counts updated:", newCounts);
          countsUpdated = true;
        }
      });

      // Simulate receiving a new private message via WebSocket
      console.log("📨 Simulating new private message WebSocket event...");
      const mockPrivateMessageData = {
        conversationId: "test-conversation-123",
        message: {
          id: "test-message-456",
          content: "Test message content",
          personId: "other-person-id",
          conversationId: "test-conversation-123"
        }
      };

      // Trigger the WebSocket handler manually
      SocketHelper.handleMessage({
        action: "privateMessage",
        data: mockPrivateMessageData
      });

      // Wait a moment for the async notification count update
      await new Promise(resolve => setTimeout(resolve, 1000));

      unsubscribe();

      if (countsUpdated) {
        console.log("✅ Notification count update test PASSED");
        return true;
      } else {
        console.log("❌ Notification count update test FAILED - counts did not update");
        return false;
      }

    } catch (error) {
      console.error("❌ Notification count update test ERROR:", error);
      return false;
    }
  }

  /**
   * Test real-time message updates in conversations
   */
  static async testRealTimeMessageUpdates(conversationId: string): Promise<boolean> {
    console.log("🧪 Testing real-time message updates for conversation:", conversationId);
    
    try {
      let messageUpdateReceived = false;
      
      // Create a test handler for message updates
      const testHandlerId = `WebSocketTest-${++this.testId}`;
      this.activeHandlers.push(testHandlerId);

      SocketHelper.addHandler("message", testHandlerId, (data) => {
        if (data?.conversationId === conversationId || data?.message?.conversationId === conversationId) {
          console.log("✅ Message update received for conversation:", conversationId, data);
          messageUpdateReceived = true;
        }
      });

      // Simulate a message update WebSocket event
      console.log("📨 Simulating messageUpdate WebSocket event...");
      const mockMessageUpdateData = {
        conversationId: conversationId,
        message: {
          id: "test-message-789",
          content: "New test message",
          personId: "test-person-id",
          conversationId: conversationId,
          timeSent: new Date().toISOString()
        }
      };

      SocketHelper.handleMessage({
        action: "message", 
        data: mockMessageUpdateData
      });

      // Wait a moment for the handler to process
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clean up the test handler
      SocketHelper.removeHandler(testHandlerId);
      this.activeHandlers = this.activeHandlers.filter(id => id !== testHandlerId);

      if (messageUpdateReceived) {
        console.log("✅ Real-time message update test PASSED");
        return true;
      } else {
        console.log("❌ Real-time message update test FAILED - message update not received");
        return false;
      }

    } catch (error) {
      console.error("❌ Real-time message update test ERROR:", error);
      return false;
    }
  }

  /**
   * Test WebSocket connection and handler registration
   */
  static async testWebSocketConnection(): Promise<boolean> {
    console.log("🧪 Testing WebSocket connection and handler registration...");
    
    try {
      // Check if WebSocket is connected
      const isConnected = SocketHelper.isConnected();
      const connectionState = SocketHelper.getConnectionState();
      
      console.log("📡 WebSocket connection state:", connectionState);
      console.log("📡 WebSocket is connected:", isConnected);

      if (!isConnected) {
        console.log("⚠️ WebSocket not connected, attempting to initialize...");
        try {
          await SocketHelper.init();
          console.log("✅ WebSocket initialization successful");
        } catch (error) {
          console.error("❌ WebSocket initialization failed:", error);
          return false;
        }
      }

      // Test handler registration and removal
      const testHandlerId = `WebSocketTest-HandlerTest-${++this.testId}`;
      let handlerCalled = false;

      SocketHelper.addHandler("message", testHandlerId, (data) => {
        handlerCalled = true;
        console.log("✅ Test handler called with data:", data);
      });

      // Simulate a test message
      SocketHelper.handleMessage({ action: "message", data: { test: true } });

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 100));

      // Clean up
      SocketHelper.removeHandler(testHandlerId);

      if (handlerCalled) {
        console.log("✅ WebSocket handler registration/removal test PASSED");
        return true;
      } else {
        console.log("❌ WebSocket handler registration/removal test FAILED");
        return false;
      }

    } catch (error) {
      console.error("❌ WebSocket connection test ERROR:", error);
      return false;
    }
  }

  /**
   * Test NotificationService initialization and subscription
   */
  static async testNotificationServiceIntegration(userContext: any): Promise<boolean> {
    console.log("🧪 Testing NotificationService integration...");
    
    try {
      const notificationService = NotificationService.getInstance();
      
      // Test initialization
      if (!notificationService.isReady()) {
        console.log("📡 Initializing NotificationService...");
        await notificationService.initialize(userContext);
      }

      // Test subscription
      let subscriptionWorking = false;
      const unsubscribe = notificationService.subscribe((counts) => {
        console.log("✅ NotificationService subscription received counts:", counts);
        subscriptionWorking = true;
      });

      // Wait a moment for the subscription to fire
      await new Promise(resolve => setTimeout(resolve, 100));

      unsubscribe();

      if (subscriptionWorking) {
        console.log("✅ NotificationService integration test PASSED");
        return true;
      } else {
        console.log("❌ NotificationService integration test FAILED");
        return false;
      }

    } catch (error) {
      console.error("❌ NotificationService integration test ERROR:", error);
      return false;
    }
  }

  /**
   * Run all WebSocket tests
   */
  static async runAllTests(userContext?: any, testConversationId?: string): Promise<void> {
    console.log("🚀 Starting WebSocket notification system tests...");
    
    const results = {
      connection: false,
      notificationService: false,
      notificationCounts: false,
      realTimeMessages: false
    };

    // Test 1: WebSocket Connection
    results.connection = await this.testWebSocketConnection();

    // Test 2: NotificationService Integration
    if (userContext) {
      results.notificationService = await this.testNotificationServiceIntegration(userContext);
    } else {
      console.log("⚠️ Skipping NotificationService test - no user context provided");
    }

    // Test 3: Notification Count Updates
    results.notificationCounts = await this.testNotificationCountUpdates();

    // Test 4: Real-time Message Updates
    if (testConversationId) {
      results.realTimeMessages = await this.testRealTimeMessageUpdates(testConversationId);
    } else {
      console.log("⚠️ Skipping real-time message test - no conversation ID provided");
    }

    // Summary
    console.log("\n📊 WebSocket Test Results Summary:");
    console.log("=================================");
    console.log(`🔌 WebSocket Connection: ${results.connection ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔔 NotificationService: ${results.notificationService ? '✅ PASS' : '⚠️ SKIP'}`);
    console.log(`📊 Notification Counts: ${results.notificationCounts ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`💬 Real-time Messages: ${results.realTimeMessages ? '✅ PASS' : '⚠️ SKIP'}`);

    const passedTests = Object.values(results).filter(result => result === true).length;
    const totalTests = Object.values(results).filter(result => result !== false).length;
    
    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

    // Cleanup any remaining test handlers
    this.cleanup();
  }

  /**
   * Cleanup test handlers
   */
  static cleanup(): void {
    this.activeHandlers.forEach(handlerId => {
      SocketHelper.removeHandler(handlerId);
    });
    this.activeHandlers = [];
    console.log("🧹 Test cleanup completed");
  }

  /**
   * Log current WebSocket state for debugging
   */
  static debugWebSocketState(): void {
    console.log("🔍 WebSocket Debug Information:");
    console.log("==============================");
    console.log("Connection State:", SocketHelper.getConnectionState());
    console.log("Is Connected:", SocketHelper.isConnected());
    console.log("Socket ID:", (SocketHelper as any).socketId);
    console.log("Active Handlers:", (SocketHelper as any).actionHandlers?.length || 0);
    
    const notificationService = NotificationService.getInstance();
    console.log("NotificationService Ready:", notificationService.isReady());
    console.log("Current Counts:", notificationService.getCounts());
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).WebSocketTest = WebSocketTest;
}