// This file demonstrates the safe date validation approach

// Test function to validate date handling
function testDateConversion() {
  // Define sample dates including valid and problematic ones
  const dates = [
    "2025-06-04T17:22:36.000Z", // Valid date
    "2025-06-04T17:00:00.000Z", // Valid date
    "Invalid Date String",      // Invalid date
    "",                         // Empty string
    null,                       // Null
    undefined,                  // Undefined
    "2025-99-99T00:00:00.000Z"  // Invalid month/day
  ];
  
  console.log("Testing date conversion with validation:");
  
  // Test each date value with our safe conversion approach
  dates.forEach(dateValue => {
    console.log(`\nTesting date: ${dateValue}`);
    
    try {
      // First approach: Direct conversion
      console.log("Direct conversion attempt:");
      if (dateValue) {
        const date = new Date(dateValue);
        console.log(`  Date object: ${date}`);
        console.log(`  isNaN check: ${isNaN(date.getTime())}`);
          try {
          const iso = date.toISOString();
          console.log(`  toISOString: ${iso}`);
        } catch (e: unknown) {
          console.log(`  toISOString ERROR: ${e instanceof Error ? e.message : String(e)}`);
        }
      } else {
        console.log("  Date value is empty/null/undefined");
      }
      
      // Second approach: Safe conversion with validation
      console.log("\nSafe conversion with validation:");
      const safeIso = safeToISOString(dateValue);
      console.log(`  Result: ${safeIso !== undefined ? safeIso : 'undefined'}`);
        } catch (e: unknown) {
      console.log(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  });
}

// Safe conversion function
function safeToISOString(dateValue: Date | string | number | null | undefined): string | undefined {
  if (!dateValue) return undefined;
  
  try {
    const date = new Date(dateValue);
    // Validate the date is valid before conversion
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    console.log(`  Warning: Invalid date detected: ${dateValue}`);
    return undefined;
  } catch (error) {
    console.log(`  Error processing date: ${dateValue}`, error);
    return undefined;
  }
}

// Run the test
testDateConversion();

// To run this test:
// ts-node src/test-date-conversion.ts
