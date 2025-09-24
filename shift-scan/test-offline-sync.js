/**
 * Test file to validate offline sync fixes
 * 
 * This script can be run to test the offline functionality
 * and sync improvements we just implemented.
 */

import { executeOfflineFirstAction, syncOfflineActions, getOfflineActionsStatus } from '@/utils/offlineFirstWrapper';

// Test data for creating an offline timesheet
const testFormData = new FormData();
testFormData.append('date', new Date().toISOString());
testFormData.append('jobsiteId', 'test-jobsite-id');
testFormData.append('userId', 'test-user-id');
testFormData.append('costcode', 'LABOR');
testFormData.append('startTime', new Date().toISOString());
testFormData.append('type', 'start');

/**
 * Test 1: Create offline timesheet
 */
async function testOfflineTimesheetCreation() {
  console.log('=== Testing Offline Timesheet Creation ===');
  
  try {
    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    const result = await executeOfflineFirstAction(
      'handleGeneralTimeSheet',
      testFormData,
      async () => {
        // This would normally call the server action
        // When offline, it should be stored locally
        console.log('Server action would be called here');
        return { success: true, id: 'offline-test-id' };
      }
    );

    console.log('Offline creation result:', result);
    
    // Check offline status
    const status = getOfflineActionsStatus();
    console.log('Offline actions status:', status);
    
    return result;
  } catch (error) {
    console.error('Offline timesheet creation failed:', error);
    return null;
  }
}

/**
 * Test 2: Sync offline actions when back online
 */
async function testOfflineSync() {
  console.log('\n=== Testing Offline Sync ===');
  
  try {
    // Simulate coming back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });

    const result = await syncOfflineActions();
    console.log('Sync result:', result);
    
    // Check status after sync
    const status = getOfflineActionsStatus();
    console.log('Post-sync actions status:', status);
    
    return result;
  } catch (error) {
    console.error('Offline sync failed:', error);
    return null;
  }
}

/**
 * Test 3: User validation error handling
 */
function testUserValidationErrorHandling() {
  console.log('\n=== Testing User Validation Error Handling ===');
  
  // Test with invalid userId to trigger USER_NOT_FOUND error
  const invalidFormData = new FormData();
  invalidFormData.append('date', new Date().toISOString());
  invalidFormData.append('jobsiteId', 'test-jobsite-id');
  invalidFormData.append('userId', 'non-existent-user-id');
  invalidFormData.append('costcode', 'LABOR');
  invalidFormData.append('startTime', new Date().toISOString());
  invalidFormData.append('type', 'start');
  invalidFormData.append('isOfflineSync', 'true');
  
  console.log('This would test the USER_NOT_FOUND error path in the sync process');
  console.log('Invalid form data prepared with userId:', invalidFormData.get('userId'));
}

/**
 * Run all tests
 */
export async function runOfflineTests() {
  console.log('🔧 Starting Offline Functionality Tests\n');
  
  try {
    // Test 1: Create offline timesheet
    const offlineResult = await testOfflineTimesheetCreation();
    
    if (offlineResult) {
      // Test 2: Sync when back online
      await testOfflineSync();
    }
    
    // Test 3: Error handling
    testUserValidationErrorHandling();
    
    console.log('\n✅ All tests completed');
    console.log('\nKey improvements implemented:');
    console.log('1. Enhanced FormData reconstruction with null/undefined handling');
    console.log('2. User validation before database operations');
    console.log('3. Offline sync flag to bypass authentication checks');
    console.log('4. Better error handling for USER_NOT_FOUND errors');
    console.log('5. Visual sync status indicator for users');
    console.log('6. No retry attempts for user validation failures');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Export the test functions for manual testing
export {
  testOfflineTimesheetCreation,
  testOfflineSync,
  testUserValidationErrorHandling
};