# Timesheet Filter Implementation Instructions

## Overview

This document provides guidelines for implementing consistent filter logic for data tables and API integration in the admin pages. It is based on the `useAllTimeSheetData` hook and related UI components in the timesheets feature.

---

## 1. Filter State Structure

- Always include `dateRange` and `status` as filter criteria in your filter state.
- Before implementing, decide what additional filters are needed for your page (e.g., jobsite, cost code, user, etc.).
- Define your filter state object to include only the relevant filters for your use case, in addition to `dateRange` and `status`.
- Example:
  ```ts
  // Always include dateRange and status
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    status: [],
    // Add any other filters needed for your page below
    // e.g., jobsiteId: [], costCode: [], userId: []
  });
  ```

> Before starting, ask yourself: What filters does this page need besides dateRange and status?

## 2. Filter UI Pattern

- Use a popover or modal for filter controls (see `TimesheetFilters` component).
- Each filter type (jobsite, cost code, status, etc.) should use a multi-select combobox or appropriate control.
- Date range should use a calendar picker.
- Provide clear and apply buttons.
- Show a badge with the count of active filters.

## 3. Filter Query Construction

- Use a helper function (e.g., `buildFilterQuery`) to convert the filter state into URL query parameters for API requests.
- For array filters, append each value as a separate query param (e.g., `jobsiteId=1&jobsiteId=2`).
- For date range, use ISO strings (e.g., `dateFrom`, `dateTo`).
- Only include params that have values.

## 4. API Integration

- When fetching data, always include the filter query string in the API request URL.
- Example:
  ```ts
  const filterQuery = buildFilterQuery();
  fetch(`/api/endpoint?${filterQuery}`);
  ```
- The API should accept these query params and apply them in the database query (e.g., with Prisma's `where` clause).
- For status toggles (like `showPendingOnly`), pass as a dedicated param (e.g., `status=pending`).
- Pagination params (`page`, `pageSize`) should be included as well.

## 5. Filter Application Flow

- When the user applies filters, update the `filters` state and trigger a data fetch.
- When filters are cleared, reset the `filters` state and fetch unfiltered data.
- Use debounced search input for text search.
- Always keep the UI and API in sync with the current filter state.

## 6. Consistency Checklist

- All filterable pages should:
  - Always include `dateRange` and `status` in the filter state.
  - Ask what other filters are needed for the specific page and add them as needed.
  - Use a single filter state object.
  - Use a helper to build query params.
  - Pass all filters to the API as query params.
  - Use multi-select controls for array filters.
  - Use a calendar for date range.
  - Show active filter count.
  - Support clear/apply actions.

---

_Adhering to these instructions will ensure a consistent, maintainable, and user-friendly filtering experience across all admin data pages._
