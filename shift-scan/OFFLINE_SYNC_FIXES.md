# Offline Sync Functionality Fixes

This document outlines the fixes implemented to resolve offline timesheet synchronization issues.

## Problem Summary

The offline functionality was mostly working, but timesheets created while offline would fail to sync to the database when the user came back online. The console logs showed a Prisma database constraint error:

```
No 'User' record (needed to inline the relationship on 'TimeSheet' during the create)
```

## Root Cause Analysis

1. **User Authentication**: During offline sync, the authentication session was not available, but the sync process still tried to validate the session
2. **FormData Reconstruction**: The conversion from stored offline data back to FormData wasn't handling null/undefined values properly
3. **Database Constraint**: The `userId` from offline data didn't match existing database records, causing foreign key constraint failures
4. **Error Handling**: Failed syncs would retry indefinitely without considering user validation failures

## Implemented Fixes

### 1. Enhanced FormData Reconstruction (`offlineFirstWrapper.ts`)

```typescript
// Before: Basic string conversion
formData.append(key, String(value));

// After: Proper null/undefined handling
if (value instanceof Blob) {
  formData.append(key, value);
} else if (value !== null && value !== undefined) {
  formData.append(key, String(value));
}

// Added offline sync flag
formData.append("isOfflineSync", "true");
```

### 2. User Validation in Server Actions (`timeSheetActions.ts`)

```typescript
// Added before database operations
const userExists = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, firstName: true, lastName: true, clockedIn: true },
});

if (!userExists) {
  console.error(`[TIMESHEET] User ${userId} not found in database during sync`);
  return {
    message: `User account not found (ID: ${userId}). Please log in again.`,
    error: "USER_NOT_FOUND",
  };
}
```

### 3. Enhanced Authentication Handling (`timeSheetActions.ts`)

```typescript
// Allow offline sync to proceed without session
const session = await auth();
const isOfflineSync = formData.get("isOfflineSync") === "true";

if (!session && !isOfflineSync) {
  throw new Error("Unauthorized user");
}
```

### 4. Improved Error Handling (`offlineFirstWrapper.ts`)

```typescript
// Don't retry user validation errors
if (
  action.lastError.includes("USER_NOT_FOUND") ||
  action.lastError.includes("User account not found") ||
  action.lastError.includes("Unauthorized user")
) {
  action.status = "failed";
  console.warn(
    `[SYNC] User validation failed for action ${action.actionName} - marking as failed, no retries`,
  );
  failedCount++;
} else if (action.retryCount >= 3) {
  // Regular retry logic for other errors
  action.status = "failed";
  failedCount++;
} else {
  action.status = "pending";
}
```

### 5. Visual Sync Status Component (`OfflineSyncStatus.tsx`)

- Real-time sync status indicator in the top-right corner
- Shows pending, syncing, and failed actions
- Detailed error messages for failed items
- Special messaging for user authentication issues

## Testing the Fixes

### Manual Testing Steps

1. **Create Offline Timesheet**:
   - Go to `/clock` page
   - Turn off internet connection
   - Create a new timesheet
   - Verify it's stored in localStorage

2. **Test Sync Process**:
   - Turn internet connection back on
   - Wait for automatic sync or manually trigger sync
   - Check browser console for sync logs
   - Verify timesheet appears in database

3. **Monitor Sync Status**:
   - Look for the sync status indicator in top-right corner
   - Check for any failed items and their error messages

### Automated Testing

Run the test script to validate functionality:

```bash
node test-offline-sync.js
```

## Key Improvements

1. **Better Data Integrity**: Proper FormData reconstruction prevents data corruption
2. **User Validation**: Pre-validates users exist before attempting database operations
3. **Smart Error Handling**: Different retry strategies for different error types
4. **User Feedback**: Visual indicators show sync status and issues
5. **Authentication Bypass**: Offline sync can proceed without active session
6. **Debugging Support**: Enhanced logging for troubleshooting

## Files Modified

- `src/utils/offlineFirstWrapper.ts` - Core sync logic improvements
- `src/actions/timeSheetActions.ts` - User validation and auth handling
- `src/components/OfflineSyncStatus.tsx` - New visual status component
- `src/app/layout.tsx` - Added sync status component to layout

## Monitoring and Debugging

The fixes include comprehensive logging:

- `[SYNC]` - Offline sync process logs
- `[TIMESHEET]` - Timesheet action logs
- FormData contents logged during sync
- User validation status
- Error details for failed syncs

Check browser console for these logs when debugging offline sync issues.

## Future Enhancements

Consider these additional improvements:

1. **Conflict Resolution**: Handle cases where offline data conflicts with server data
2. **Partial Sync**: Allow individual item retry from the UI
3. **Data Backup**: Export offline data for manual recovery
4. **Batch Operations**: Optimize sync performance for multiple items
5. **Connection Monitoring**: Better network state detection and handling
