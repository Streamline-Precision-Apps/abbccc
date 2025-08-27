# Offline Timesheet Testing Guide

## Overview

This guide will help you test the offline timesheet creation and navigation functionality from `/clock` to `/dashboard`.

## Key Improvements Made

### 1. Enhanced Service Worker

- **Better Navigation Caching**: Improved offline navigation handling for `/clock` and `/dashboard` routes
- **Enhanced API Fallbacks**: Better offline responses for `/api/getRecentTimecard` and other critical APIs
- **Intelligent Route Fallbacks**: Service worker now tries multiple cache strategies for failed navigation

### 2. Improved Offline Data Storage

- **Comprehensive Timesheet Storage**: Enhanced storage includes jobsite labels, cost code labels, and work role info
- **Multiple Storage Layers**: Data stored in `current_offline_timesheet`, `offline_dashboard_data`, and `cached_recent_timecard`
- **Better Data Retrieval**: Improved fallback chain for accessing offline timesheet data

### 3. New Offline API Wrapper

- **Smart Caching**: New `/utils/offlineApiWrapper.ts` provides intelligent API caching with fallbacks
- **Better Error Handling**: Graceful degradation when offline with meaningful fallback data
- **Data Persistence**: Successful API calls are cached for offline use

### 4. Debug Tools

- **Offline Debugger**: New component shows real-time offline status and data availability
- **Enhanced Logging**: Better console logging for debugging offline flows

## Testing Steps

### Step 1: Initial Setup

1. Open your browser Developer Tools (F12)
2. Go to the Network tab
3. Navigate to `http://localhost:3000` (or your development URL)
4. Make sure you're logged in

### Step 2: Test Online Clock-In (Baseline)

1. Navigate to `/clock`
2. Complete the clock-in process normally
3. Verify navigation to `/dashboard` works
4. Note the timesheet data in the dashboard
5. Log out or end the timesheet

### Step 3: Test Offline Clock-In

1. In Developer Tools, go to **Network** tab
2. Check **"Offline"** checkbox to simulate being offline
3. Navigate to `/clock`
4. Complete the clock-in process:
   - Select work role (if multiple available)
   - Scan or select jobsite
   - Select cost code
   - Verify the information
   - Click **"Save Offline"** or **"Start Day"** button

### Step 4: Verify Offline Navigation

1. **Check Console**: Look for logs like:

   ```
   [OFFLINE] Timesheet created offline: offline_1234567890_abc123
   [OFFLINE] Stored comprehensive offline timesheet data
   [NAVIGATION] Redirecting to dashboard with timesheet: offline_1234567890_abc123
   ```

2. **Verify Navigation**: You should be redirected to `/dashboard`

3. **Check Offline Debugger**: Click "Show Offline Debug" button in bottom-right
   - Should show "Status: Offline" with red indicator
   - Should show "Has Offline Data: Yes"
   - Should display offline timesheet details

### Step 5: Verify Dashboard Functionality

1. **Dashboard Loading**: Dashboard should load successfully
2. **Offline Indicator**: Should show offline status in top-right
3. **Timesheet Data**: Should display the offline timesheet information
4. **Widgets**: All dashboard widgets should function properly

### Step 6: Test Coming Back Online

1. Uncheck **"Offline"** in Developer Tools
2. **Check Auto-Sync**: Watch console for sync messages:
   ```
   [SYNC] Syncing offline actions...
   [SYNC] Successfully synced handleGeneralTimeSheet
   ```
3. **Verify Data**: Timesheet should sync to server

## Troubleshooting

### Issue: Navigation Fails After Clock-In

**Symptoms**: Clock-in completes but doesn't navigate to dashboard

**Debug Steps**:

1. Check browser console for error messages
2. Look for "[NAVIGATION]" log entries
3. Verify offline data storage in Local Storage:
   - `current_offline_timesheet`
   - `offline_dashboard_data`

**Solutions**:

- Clear browser cache and try again
- Check if service worker is registered
- Verify localStorage isn't full

### Issue: Dashboard Shows No Data

**Symptoms**: Dashboard loads but shows no timesheet information

**Debug Steps**:

1. Check Offline Debugger for "Has Offline Data"
2. Check Local Storage for offline data
3. Look for API fallback messages in console

**Solutions**:

- Clear all offline data and restart process
- Check if `generateMockTimesheet` is working correctly

### Issue: Service Worker Not Caching

**Symptoms**: Pages don't load when offline

**Debug Steps**:

1. Go to Application tab in DevTools
2. Check Service Workers section
3. Verify cache storage has entries

**Solutions**:

- Hard refresh (Ctrl+Shift+R) to update service worker
- Unregister and re-register service worker

## Expected Console Output

### During Offline Clock-In:

```
[OFFLINE] Stored handleGeneralTimeSheet locally with ID: offline_1234567890_abc123
[OFFLINE] Stored comprehensive offline timesheet data: {timesheetId: "offline_...", jobsite: "Test Site", ...}
[NAVIGATION] Redirecting to dashboard with timesheet: offline_1234567890_abc123
```

### During Dashboard Load:

```
[OFFLINE] Found current offline timesheet: offline_1234567890_abc123
[OFFLINE] Using offline/mock logs data
[API CACHE] Using cached data for cached_recent_timecard
```

### When Coming Back Online:

```
[SYNC] Syncing 1 offline actions...
[SYNC] Successfully synced handleGeneralTimeSheet: [server response]
```

## Key Files Modified

1. **Service Worker** (`public/service-worker.js`):
   - Enhanced navigation caching
   - Better API fallbacks
   - Offline timecard response generation

2. **Verification Step** (`src/components/(clock)/verification-step.tsx`):
   - Improved offline data storage
   - Better error handling
   - Enhanced logging

3. **Offline Utilities**:
   - `src/utils/offlineApiWrapper.ts` (new)
   - `src/hooks/useOfflineAwareData.ts` (enhanced)
   - `src/components/(offline)/offline-debugger.tsx` (new)

## Notes

- The system now has multiple fallback layers for offline data
- Debug tools are only visible in development mode
- Service worker changes may require a hard refresh to take effect
- All offline data is stored in localStorage and will persist across browser sessions

## Success Criteria

✅ **Clock-in works offline** - User can complete clock-in process without internet
✅ **Navigation works** - Automatic redirect from `/clock` to `/dashboard`
✅ **Dashboard functional** - All dashboard features work with offline data
✅ **Data persistence** - Offline timesheet data is properly stored and retrieved
✅ **Sync on reconnect** - Data syncs to server when connection is restored
