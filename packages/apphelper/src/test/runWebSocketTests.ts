/**
 * Quick WebSocket test runner for command line usage
 * Run this in the browser console to test WebSocket functionality
 */

import { WebSocketTest } from './WebSocketTest';
import { UserContextInterface } from '@churchapps/helpers';

// Example function to run tests with mock context
export const runQuickWebSocketTest = async (userContext?: UserContextInterface) => {
  console.log('🚀 Running quick WebSocket tests...');
  
  // Create a mock user context if none provided
  const mockContext = userContext || {
    person: { id: 'test-person-123' },
    userChurch: { church: { id: 'test-church-456' } }
  } as UserContextInterface;

  const testConversationId = 'test-conversation-' + Date.now();
  
  await WebSocketTest.runAllTests(mockContext, testConversationId);
};

// Export for browser console access
if (typeof window !== 'undefined') {
  (window as any).runQuickWebSocketTest = runQuickWebSocketTest;
  console.log('✅ WebSocket test runner loaded. Use window.runQuickWebSocketTest() to run tests.');
}