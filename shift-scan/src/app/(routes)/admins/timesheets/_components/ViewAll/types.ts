// Define custom meta types for the table
export interface TimesheetTableMeta {
  searchTerm: string;
}

// This will allow TypeScript to recognize our custom meta properties
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    searchTerm?: string;
  }
}
