# WebSocket Notification System - Manual Testing Guide

## Quick Test Setup

1. **Start the playground server:**
   ```bash
   cd E:\LCS\Packages\AppHelper\playground
   npm run dev
   ```

2. **Navigate to test page:**
   - Open browser to `http://localhost:3008`
   - Click "🔧 WebSocket & Private Message Testing"
   - Or go directly to `http://localhost:3008/private-message-test`

## Test Scenarios

### 1. Basic WebSocket Connection Test
1. Open the WebSocket test panel
2. Click **"Run All Tests"** button
3. **Expected Result:** All connection tests should pass
4. Check console logs for detailed WebSocket activity

### 2. Notification Count Update Test
1. Click **"Simulate Private Message"** button
2. **Expected Result:** 
   - Log shows "New private message received"
   - PM Count chip should update (if NotificationService is running)
   - Console shows debounced API call after 300ms

### 3. Real-time Message Update Test
1. Set a test conversation ID (or use default)
2. Click **"Simulate Message Update"** button  
3. **Expected Result:**
   - Log shows "Message update received" 
   - Any open Notes components for that conversation should reload

### 4. WebSocket State Monitoring
1. Click **"Debug WebSocket"** button
2. **Expected Result:** Console shows current WebSocket state:
   - Connection State: OPEN/CLOSED/CONNECTING
   - Socket ID
   - Active handler count
   - NotificationService status

## Browser Console Testing

Open browser console and run:

```javascript
// Quick WebSocket test
window.runQuickWebSocketTest();

// Manual WebSocket debugging  
window.WebSocketTest.debugWebSocketState();

// Test specific functionality
window.WebSocketTest.testWebSocketConnection();
```

## What to Look For

### ✅ **Success Indicators:**
- WebSocket connection state shows "OPEN"
- Test logs show "✅ PASS" for all tests
- PM Count and Notification Count chips update in real-time
- No TypeScript errors in console
- Smooth log output without errors

### ❌ **Failure Indicators:**
- Connection state shows "CLOSED" or "CONNECTING" persistently
- Test logs show "❌ FAIL" 
- Error messages about missing handlers
- TypeScript compilation errors
- API calls failing (check network tab)

## Real-World Testing

### With Actual Server:
1. **Setup:** Ensure MessagingApi WebSocket server is running
2. **Test 1:** Send actual private message from another account
3. **Test 2:** Verify notification badge updates instantly
4. **Test 3:** Open conversation and verify messages appear in real-time
5. **Test 4:** Check modal doesn't close when notifications clear

### Performance Monitoring:
- Monitor Network tab for API call frequency
- Verify debouncing is working (max 1 call per 300ms)
- Check for memory leaks in WebSocket handlers
- Verify proper cleanup when components unmount

## Troubleshooting

### Common Issues:

**"WebSocket connection failed"**
- Check if MessagingApi server is running
- Verify `CommonEnvironmentHelper.MessagingApiSocket` URL
- Check browser console for CORS errors

**"Handler not receiving events"**
- Verify handler IDs are unique
- Check if handlers are properly registered
- Ensure cleanup isn't removing active handlers

**"Notification counts not updating"**
- Check NotificationService initialization
- Verify user context is properly set
- Check API endpoints are responding

**"TypeScript errors"**
- Ensure all action types use valid `SocketPayloadAction` values
- Check imports are correct
- Verify type definitions are up to date

## Expected Log Output

Successful test run should show:
```
🧪 Testing WebSocket connection and handler registration...
📡 WebSocket connection state: OPEN
📡 WebSocket is connected: true
✅ Test handler called with data: {test: true}
✅ WebSocket handler registration/removal test PASSED

🧪 Testing notification count updates via WebSocket...
📨 Simulating new private message WebSocket event...
🔔 NotificationService: New private message received, updating counts
✅ Notification counts updated: {notificationCount: 0, pmCount: 1}
✅ Notification count update test PASSED

📊 WebSocket Test Results Summary:
=================================
🔌 WebSocket Connection: ✅ PASS
🔔 NotificationService: ✅ PASS  
📊 Notification Counts: ✅ PASS
💬 Real-time Messages: ✅ PASS

🎯 Overall: 4/4 tests passed
```