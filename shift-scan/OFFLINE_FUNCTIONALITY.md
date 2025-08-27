# Offline Functionality Documentation

## Overview

The app now includes comprehensive offline functionality that allows users to continue working when internet connectivity is unavailable. All timesheet actions are automatically saved locally and synchronized when the connection is restored.

## Key Features

### 1. Offline-First Architecture

- **Automatic Detection**: The app automatically detects online/offline status
- **Local Storage**: Actions are saved locally when offline using localStorage
- **Seamless Operation**: Users can continue working without interruption
- **Automatic Sync**: Actions sync automatically when connection is restored

### 2. Enhanced User Experience

- **Visual Indicators**: Clear offline status indicators throughout the UI
- **Smart Button Labels**: Buttons change to "Save Offline" when offline
- **Status Notifications**: Real-time feedback for sync operations
- **Retry Mechanism**: Failed sync attempts are automatically retried

### 3. Robust Error Handling

- **Retry Logic**: Failed actions are retried up to 3 times
- **Error Tracking**: Detailed error information is stored and displayed
- **Manual Retry**: Users can manually retry failed operations
- **Graceful Degradation**: App remains functional even with sync failures

## Components

### Core Files

1. **`/utils/offlineFirstWrapper.ts`**
   - Main offline functionality wrapper
   - Handles action storage and synchronization
   - Provides hooks for status monitoring

2. **`/hooks/useEnhancedOfflineStatus.ts`**
   - React hook for managing offline state
   - Provides notification system
   - Handles sync operations

3. **`/components/(offline)/offline-notification.tsx`**
   - Displays connection status and notifications
   - Shows sync progress and results
   - Provides manual sync controls

4. **`/components/(offline)/offline-status.tsx`**
   - Comprehensive offline status dashboard
   - Shows all pending, syncing, and failed actions
   - Provides management controls

### Integration

The offline functionality is integrated into:

- **Verification Step**: Shows offline indicators and changes button text
- **Timesheet Actions**: All timesheet operations support offline mode
- **Equipment Actions**: Equipment logging works offline
- **User Interface**: Consistent offline indicators across the app

## How It Works

### 1. Action Execution Flow

```
User Action → Online Check → Store Locally (if offline) → Execute Normally (if online)
                ↓                    ↓                           ↓
           Return Mock ID    Store in Queue              Sync Pending Actions
```

### 2. Data Storage Structure

Each offline action is stored with:

- **ID**: Unique identifier (prefixed with "offline\_")
- **Action Name**: Type of server action to execute
- **Form Data**: All form data converted to JSON
- **Timestamp**: When the action was created
- **Status**: pending, syncing, synced, or failed
- **Retry Count**: Number of retry attempts
- **Last Error**: Details of the last error (if any)

### 3. Synchronization Process

When the app comes back online:

1. Detect online status change
2. Get all pending actions from queue
3. Process actions sequentially
4. Mark successful actions as synced
5. Retry failed actions (up to 3 times)
6. Update UI with results

## Usage Examples

### 1. Basic Integration

```tsx
import { executeOfflineFirstAction } from "@/utils/offlineFirstWrapper";
import { myServerAction } from "@/actions/myActions";

const handleSubmit = async (formData: FormData) => {
  const result = await executeOfflineFirstAction(
    "myServerAction",
    myServerAction,
    formData,
  );

  // Handle result (could be offline ID or actual server response)
  console.log("Action result:", result);
};
```

### 2. Status Monitoring

```tsx
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";

const MyComponent = () => {
  const { isOnline, summary, performSync, notification } =
    useEnhancedOfflineStatus();

  return (
    <div>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>
      {summary.hasPending && (
        <button onClick={performSync}>
          Sync {summary.totalActions} actions
        </button>
      )}
    </div>
  );
};
```

### 3. Adding Offline Notifications

```tsx
import OfflineNotification from "@/components/(offline)/offline-notification";

const Layout = ({ children }) => (
  <div>
    <OfflineNotification />
    {children}
  </div>
);
```

## Development Tools

### 1. Debug Utilities

```javascript
// Available in development mode via browser console
OfflineDevUtils.goOffline(); // Simulate offline
OfflineDevUtils.goOnline(); // Simulate online
OfflineDevUtils.getStatus(); // Check current status
OfflineDevUtils.forceSync(); // Force sync
OfflineDevUtils.clearAll(); // Clear all data
```

### 2. Testing Offline Scenarios

1. Use browser dev tools to simulate offline
2. Use the debug utilities above
3. Check localStorage for stored actions
4. Monitor console for sync events

## Configuration

### Environment Variables

No additional environment variables required. The system uses:

- `NODE_ENV` for development mode features
- Browser's `navigator.onLine` for online detection

### Storage Keys

- `offline_timesheet_queue`: Main action queue
- `offline_timesheet_data_<id>`: Individual action data

## Best Practices

### 1. Server Actions

- Keep server actions idempotent when possible
- Handle duplicate submissions gracefully
- Validate data on both client and server

### 2. Error Handling

- Provide meaningful error messages
- Don't rely solely on offline mode for error recovery
- Test edge cases thoroughly

### 3. User Experience

- Show clear offline indicators
- Provide feedback on sync progress
- Allow manual control when needed

## Troubleshooting

### Common Issues

1. **Actions not syncing**
   - Check internet connection
   - Look for JavaScript errors in console
   - Verify server action imports

2. **localStorage full**
   - Clear old offline data
   - Implement data cleanup policies
   - Monitor storage usage

3. **Sync failures**
   - Check server action compatibility
   - Verify FormData serialization
   - Test with smaller data sets

### Debug Commands

```javascript
// Check what's stored
OfflineDevUtils.showStoredData();

// Get current status
OfflineDevUtils.getStatus();

// Force sync
await OfflineDevUtils.forceSync();
```

## Security Considerations

- Offline data is stored in localStorage (not encrypted)
- Sensitive data should be minimized in offline storage
- Server-side validation is still required for all actions
- Consider data retention policies for offline storage

## Performance Notes

- Sync operations are throttled to prevent server overload
- Large form data may impact localStorage limits
- Periodic cleanup of old sync data is recommended
- Monitor localStorage usage in production

## Recent Updates (Dashboard Offline Support)

### Changes Made

1. **Removed Intrusive Notifications**
   - Removed the full-screen offline notification component that was blocking part of the screen
   - Replaced with subtle, non-intrusive indicators

2. **Dashboard Offline Functionality**
   - Updated `DbWidgetSection` to use offline-aware data fetching
   - Created `useOfflineAwareData` hook for handling API calls with offline fallbacks
   - Dashboard now successfully navigates and displays information when offline

3. **New Offline Components**
   - **`OfflineIndicator`**: Small, corner indicator showing connection status
   - **`OfflineStatusWidget`**: Dashboard widget showing current offline timesheet info
   - **`useOfflineAwareData`**: Hook for fetching data with offline fallbacks

4. **Enhanced Data Storage**
   - Verification step now stores timesheet data locally for dashboard use
   - Dashboard can display current timesheet information when offline
   - MechanicBtn component made offline-aware for cookie fetching

5. **Dashboard Integration**
   - All dashboard views (General, Tasco, Truck Driver, Mechanic) now include offline status widgets
   - Dashboard loads and functions properly when clocking in offline
   - Offline timesheet data is displayed with job site and timing information

### Offline Dashboard Flow

1. **Clock In Offline**: User completes clock-in process while offline
2. **Data Storage**: Timesheet data stored locally with all relevant information
3. **Navigation**: Successfully navigates to dashboard
4. **Display**: Dashboard shows offline status widget with current timesheet info
5. **Functionality**: All dashboard buttons and widgets work offline
6. **Sync**: When connectivity returns, data automatically syncs in background

### UI Changes

- **Before**: Intrusive notification bar covering screen content
- **After**: Small corner indicator and contextual status widgets
- **Dashboard**: Now shows offline timesheet information and status
- **Navigation**: Seamless flow from offline clock-in to functional dashboard

The offline functionality now provides a complete, uninterrupted user experience from clock-in to dashboard, with clear but non-intrusive status indicators throughout the interface.
