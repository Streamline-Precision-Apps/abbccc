# Comprehensive Offline Functionality

This implementation provides complete offline support for your Next.js application, including server action interception, offline entity creation, and automatic synchronization when connectivity is restored.

## Overview

The offline system consists of several key components:

1. **Enhanced Service Worker** - Intercepts server actions and manages offline data
2. **Offline Manager Utility** - Client-side interface for managing offline state
3. **React Hooks** - Easy-to-use hooks for React components
4. **React Components** - Pre-built components for offline status and controls

## Features

- ✅ **Server Action Interception** - All specified server actions work offline
- ✅ **Offline Entity Creation** - Create timesheets, equipment logs, etc. while offline
- ✅ **Automatic Synchronization** - Sync offline data when connectivity returns
- ✅ **Background Sync** - Uses Service Worker background sync when supported
- ✅ **Conflict Resolution** - Handles data conflicts gracefully
- ✅ **Real-time Status** - Shows offline status and pending actions
- ✅ **Persistent Storage** - Uses localStorage for reliable offline storage

## Supported Pages and Actions

The following pages now work completely offline:

- `/` (Home/Clock-in page)
- `/clock` (Clock in/out)
- `/dashboard` (Main dashboard)
- `/dashboard/switch-jobs` (Job switching)
- `/dashboard/equipment` (Equipment management)
- `/dashboard/equipment/log-new` (New equipment logs)
- `/dashboard/clock-out` (Clock out)

## Supported Server Actions

The following server actions are intercepted and work offline:

- `handleGeneralTimeSheet` - General labor timesheets
- `handleMechanicTimeSheet` - Mechanic timesheets
- `handleTascoTimeSheet` - Tasco timesheets
- `handleTruckTimeSheet` - Truck driver timesheets
- `CreateEmployeeEquipmentLog` - Equipment logging
- `updateTimeSheetBySwitch` - Job switching for general workers
- `updateTruckDriverTSBySwitch` - Job switching for truck drivers
- `breakOutTimeSheet` - Break time management
- `updateTimeSheet` - Timesheet updates

## Usage

### 1. Basic Offline Status

```tsx
import { useOnlineStatus } from "@/hooks/use-offline";

function MyComponent() {
  const isOnline = useOnlineStatus();

  return <div>Status: {isOnline ? "Online" : "Offline"}</div>;
}
```

### 2. Complete Offline Management

```tsx
import { useOffline } from "@/hooks/use-offline";

function MyComponent() {
  const {
    isOnline,
    status,
    syncOfflineActions,
    pendingActions,
    offlineTimesheet,
  } = useOffline();

  const handleSync = async () => {
    const success = await syncOfflineActions();
    if (success) {
      alert("Sync completed!");
    }
  };

  return (
    <div>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>
      <p>Pending Actions: {status.pendingActions}</p>
      {status.pendingActions > 0 && (
        <button onClick={handleSync}>Sync Now</button>
      )}
    </div>
  );
}
```

### 3. Offline Status Component

```tsx
import {
  OfflineStatusComponent,
  OfflineIndicator,
} from "@/components/offline-status";

function Dashboard() {
  return (
    <div>
      {/* Simple indicator */}
      <OfflineIndicator />

      {/* Full status component */}
      <OfflineStatusComponent showDetails={true} showControls={true} />
    </div>
  );
}
```

### 4. Form with Offline Support

```tsx
import { useOffline } from "@/hooks/use-offline";

function TimesheetForm() {
  const { isOnline } = useOffline();

  const handleSubmit = async (formData: FormData) => {
    // The service worker automatically handles offline
    const response = await fetch("/", {
      method: "POST",
      headers: { "Next-Action": "handleGeneralTimeSheet" },
      body: formData,
    });

    if (response.headers.get("X-Offline") === "true") {
      alert("Saved offline - will sync when online");
    } else {
      alert("Submitted successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit">{isOnline ? "Submit" : "Save Offline"}</button>
    </form>
  );
}
```

## Service Worker Communication

The service worker supports several message types for advanced control:

```typescript
// Sync offline actions
navigator.serviceWorker.ready.then((registration) => {
  const messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = (event) => {
    console.log("Sync result:", event.data.success);
  };
  registration.active?.postMessage({ type: "SYNC_OFFLINE_ACTIONS" }, [
    messageChannel.port2,
  ]);
});

// Get offline status
navigator.serviceWorker.ready.then((registration) => {
  const messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = (event) => {
    console.log("Status:", event.data);
  };
  registration.active?.postMessage({ type: "GET_OFFLINE_STATUS" }, [
    messageChannel.port2,
  ]);
});
```

## Implementation Details

### Service Worker

The service worker (`public/service-worker.js`) handles:

1. **Request Interception** - Catches POST requests for server actions
2. **Offline Storage** - Stores actions and entities in localStorage
3. **Background Sync** - Automatically syncs when connection returns
4. **Caching Strategy** - Serves cached content when offline

### Data Storage

Offline data is stored using localStorage with structured keys:

- `offline_action_queue` - Queue of pending actions
- `offline_action_{id}` - Individual action details
- `offline_timesheet_{id}` - Offline timesheet entities
- `offline_equipment_log_{id}` - Offline equipment log entities
- `current_offline_timesheet` - Currently active timesheet
- `offline_dashboard_data` - Dashboard data for offline viewing

### Sync Process

1. **Detection** - Service worker detects when device comes online
2. **Queue Processing** - Processes pending actions in order
3. **Retry Logic** - Retries failed actions with exponential backoff
4. **Cleanup** - Removes successfully synced actions after 24 hours

## Error Handling

The system handles various error scenarios:

- **Network Failures** - Actions are queued for later sync
- **Server Errors** - Actions are marked as failed and retried
- **Storage Limits** - Old data is cleaned up automatically
- **Sync Conflicts** - Duplicate detection prevents data corruption

## Debugging

For debugging offline functionality:

1. **Service Worker Logs** - Check browser DevTools > Application > Service Workers
2. **localStorage Inspection** - Examine stored offline data
3. **Network Tab** - Monitor intercepted requests
4. **Offline Debugger Component** - Use the built-in debugging component

```tsx
import OfflineDebugger from "@/components/(offline)/offline-debugger";

function App() {
  return (
    <div>
      {/* Only show in development */}
      {process.env.NODE_ENV === "development" && <OfflineDebugger />}
    </div>
  );
}
```

## Testing Offline Functionality

1. **Chrome DevTools** - Use Network tab to simulate offline
2. **Service Worker Testing** - Test different network conditions
3. **Data Persistence** - Verify data survives browser restarts
4. **Sync Testing** - Test sync behavior when coming back online

## Browser Support

- ✅ Chrome/Chromium (full support)
- ✅ Firefox (full support)
- ✅ Safari (partial - no background sync)
- ✅ Edge (full support)

## Performance Considerations

- **Storage Limits** - localStorage has ~5-10MB limit per origin
- **Sync Frequency** - Automatic cleanup prevents data buildup
- **Battery Usage** - Background sync is throttled to preserve battery
- **Memory Usage** - Service worker unloads when not needed

## Security

- **Data Validation** - All offline data is validated before sync
- **HTTPS Required** - Service workers require HTTPS in production
- **Same-Origin Policy** - Data is isolated per origin
- **No Sensitive Data** - Avoid storing sensitive information offline

## Troubleshooting

### Common Issues

1. **Service Worker Not Updating**
   - Hard refresh (Ctrl+Shift+R)
   - Unregister and re-register service worker

2. **Offline Data Not Syncing**
   - Check network connectivity
   - Verify service worker is active
   - Check browser console for errors

3. **localStorage Full**
   - Clear offline data manually
   - Implement data pruning strategy

### Debug Commands

```javascript
// Check service worker status
navigator.serviceWorker.ready.then((registration) => {
  console.log("SW active:", registration.active);
});

// Clear all offline data
localStorage.clear();

// Check offline queue
console.log(JSON.parse(localStorage.getItem("offline_action_queue") || "[]"));
```

## Future Enhancements

Potential improvements for the offline system:

- **IndexedDB Migration** - Better storage with larger capacity
- **Conflict Resolution UI** - User interface for resolving data conflicts
- **Offline Analytics** - Track offline usage patterns
- **Progressive Sync** - Prioritize certain types of data
- **Compression** - Compress stored data to save space

This comprehensive offline system ensures your application remains fully functional even without internet connectivity, providing a seamless user experience across all conditions.
