# Instructions for Updating Table Loading States in Admin Tables

## Overview

The goal is to standardize the loading state appearance across all tables in the `/admins` folder while maintaining unique skeletons that represent the actual data format of each table.

## General Requirements

1. **Consistent Styling**

   - All table loading states should follow the same basic patterns
   - Header skeletons should be consistent in appearance and sizing
   - Row skeletons should alternate backgrounds (odd:bg-white even:bg-gray-100)
   - All cells should have border-r border-gray-200 as a standard

2. **Common Structure**

   - Create a consistent number of skeleton rows based on expected page size (preferably 10 rows)
   - Use appropriate skeleton widths to represent actual data in each column
   - Headers should use skeletons of w-3/4 or w-2/3 width with mx-auto
   - Cell skeletons should use appropriate width to represent data length (w-3/4, w-1/2, w-full, etc.)

3. **Standardized Components**
   - For complex cells (user info, combined data, etc.), use consistent skeleton patterns
   - Action buttons should be represented as rounded-full skeletons of size h-6 w-6
   - Status indicators should have appropriate width and rounded corners

## Implementation Guidelines

### 1. Create Reusable Skeleton Components

Create shared skeleton components for common data types:

- **TableHeaderSkeleton**

  ```tsx
  <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100 sticky top-0 z-10">
    <Skeleton className="h-4 w-3/4 mx-auto" />
  </TableHead>
  ```

- **ActionButtonsSkeleton**
  ```tsx
  <div className="flex flex-row items-center justify-center gap-2">
    <Skeleton className="h-6 w-6 rounded-full" />
    <Skeleton className="h-6 w-6 rounded-full" />
  </div>
  ```

### 2. Table-Specific Guidelines

#### User/Personnel Tables

- Avatar: `<Skeleton className="h-10 w-10 rounded-full" />`
- User name: Two stacked skeletons with different sizes
  ```tsx
  <div className="flex flex-col">
    <Skeleton className="h-4 w-24 mb-1" />
    <Skeleton className="h-3 w-12" />
  </div>
  ```

#### Equipment Tables

- Equipment name and description: Two stacked skeletons
  ```tsx
  <div className="flex flex-col gap-1">
    <Skeleton className="h-4 w-3/4 mx-auto" />
    <Skeleton className="h-4 w-3/4 mx-auto" />
  </div>
  ```

#### Date/Time Fields

- Use consistent width for date/time fields
  ```tsx
  <Skeleton className="h-4 w-1/2 mx-auto" />
  ```

#### Status Indicators

- For status pills or badges
  ```tsx
  <Skeleton className="h-5 w-16 rounded-md mx-auto" />
  ```

#### Tag/Badge Collections

- For collections of tags or badges
  ```tsx
  <div className="flex flex-row gap-1 justify-center">
    <Skeleton className="h-5 w-8 rounded-md" />
    <Skeleton className="h-5 w-8 rounded-md" />
    <Skeleton className="h-5 w-8 rounded-md" />
  </div>
  ```

### 3. Extract Loading Logic

For tables with complex loading states, consider extracting the loading state to a separate component:

```tsx
const TableLoadingSkeleton = ({ headers, rowCount = 10 }) => {
  return (
    <TableBody className="divide-y divide-gray-200 bg-white">
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <TableRow
          key={rowIdx}
          className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
        >
          {headers.map((header, colIdx) => (
            <TableCell
              key={colIdx}
              className="border-r border-gray-200 text-xs text-center"
            >
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};
```

## Implementation Process

1. **Review Current Tables**:

   - Analyze all table components in the `/admins` folder
   - Identify common patterns and unique features

2. **Create Shared Components**:

   - Build reusable skeleton components for common elements
   - Place in appropriate shared location

3. **Update Tables**:

   - Modify each table to use consistent loading patterns while preserving uniqueness
   - Test loading states to ensure they match the data they represent

4. **Ensure Consistency**:
   - Maintain consistent sizing and styling
   - Ensure consistent number of rows

## Examples

### Basic Table Loading (for simple tables)

```tsx
{loading ? (
  <TableBody className="divide-y divide-gray-200 bg-white">
    {Array.from({ length: 10 }).map((_, rowIdx) => (
      <TableRow
        key={rowIdx}
        className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
      >
        {headers.map((header, colIdx) => (
          <TableCell key={colIdx} className="border-r border-gray-200 text-xs text-center">
            <Skeleton
              className={`h-4 ${colIdx === 0 ? 'w-full' : 'w-3/4 mx-auto'}`}
            />
          </TableCell>
        ))}
        <TableCell className="text-xs text-center">
          <div className="flex flex-row items-center justify-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
) : (
  // Actual table content
)}
```

### Complex Table Loading (for tables with varied cell content)

See implementation in specific table examples above and adapt for each table's unique needs while maintaining consistent styling.
