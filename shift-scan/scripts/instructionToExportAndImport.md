# Exporting and Importing Data

This document provides instructions on how to export and import data for jobsites, cost codes, and CC tags in the ShiftScan application.

## Exporting Data

The export functionality allows you to create backup JSON files of your data that can be used for migration, backup, or testing purposes.

### How to Export Data

1. Navigate to the project root directory in your terminal:

   ```bash
   cd /path/to/shift-scan
   ```

2. Run the export script:

   ```bash
   node scripts/exportJobsiteCostCodeTags.js
   ```

3. The script will:
   - Connect to your database using Prisma
   - Export all jobsites, cost codes, and CC tags with their relevant relations
   - Save the data as timestamped JSON files in the `prisma/data-backup` directory
   - Display the number of records exported for each entity type

4. After completion, you'll find three JSON files in the backup directory:
   - `jobsites-[timestamp].json`
   - `costcodes-[timestamp].json`
   - `cctags-[timestamp].json`

Note: The export script excludes large data collections like TimeSheets to keep file sizes manageable.

## Importing Data

The import functionality allows you to restore previously exported data or migrate data between environments.

### How to Import Data

1. Navigate to the project root directory in your terminal:

   ```bash
   cd /path/to/shift-scan
   ```

2. Run the import script:

   ```bash
   node scripts/importJobsiteCostCodeTags.js
   ```

3. The script will prompt you for:
   - The path to each JSON file you want to import (CC tags, cost codes, and jobsites)
   - Confirmation before importing each entity type

4. For each file, the script will:
   - Display the number of records found
   - Show an estimated import time
   - Ask for confirmation before proceeding
   - Show progress updates during import
   - Display the actual time taken to complete the import

5. The import follows a specific order to maintain data integrity:
   - CC tags are imported first
   - Cost codes are imported second (with connections to CC tags)
   - Jobsites are imported last (with connections to CC tags)

### Example Import Session

```
Starting import of jobsites, cost codes, and tags data...
Enter the path to the CC Tags JSON file: /Users/username/shift-scan/prisma/migrations/data-backup/cctags-2025-08-29T10-45-32-567Z.json
Found 25 CC tags to import
Estimated import time: approximately 3 second(s)
Proceed with importing CC tags? (y/n): y
Processed 10/25 CC tags...
Processed 20/25 CC tags...
CC tags import completed in 2.85 seconds

Enter the path to the Cost Codes JSON file: /Users/username/shift-scan/prisma/migrations/data-backup/costcodes-2025-08-29T10-45-32-567Z.json
Found 42 cost codes to import
Estimated import time: approximately 8 second(s)
Proceed with importing cost codes? (y/n): y
Processed 10/42 cost codes...
Processed 20/42 cost codes...
Processed 30/42 cost codes...
Processed 40/42 cost codes...
Cost codes import completed in 7.21 seconds

Enter the path to the Jobsites JSON file: /Users/username/shift-scan/prisma/migrations/data-backup/jobsites-2025-08-29T10-45-32-567Z.json
Found 37 jobsites to import
Estimated import time: approximately 9 second(s)
Proceed with importing jobsites? (y/n): y
Processed 10/37 jobsites...
Processed 20/37 jobsites...
Processed 30/37 jobsites...
Jobsites import completed in 8.64 seconds

Import process completed successfully
```

## Important Notes

1. **Database Integrity**: The import process uses `upsert` operations, which means it will:
   - Update existing records if they have the same ID
   - Create new records if no matching ID is found

2. **Order Matters**: Always import in the order prompted by the script (CC tags → cost codes → jobsites) to maintain proper relationships.

3. **Backup First**: Always create a backup of your current database before performing imports, especially in production environments.

4. **Environment Consistency**: For best results, export and import between environments with the same schema version.

5. **Large Datasets**: For very large datasets, the import process may take some time. The script provides progress updates to keep you informed.

## Troubleshooting

If you encounter errors during import:

1. Check that the JSON files are valid and properly formatted
2. Ensure that related entities exist in the database (e.g., addresses referenced by jobsites)
3. Verify database permissions and connections
4. Check for schema changes between export and import environments
