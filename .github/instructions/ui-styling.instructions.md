# UI Styling Instructions

This file contains comprehensive styling guidelines for ensuring visual consistency across the application. Following these guidelines will maintain a uniform look and feel in all UI components.

## Core Design System

### Typography

- **Headers:**
  - Main headers: `text-xl font-bold`
  - Section headers: `font-semibold text-sm mb-2`
  - Form labels: `text-xs font-semibold mb-1`
- **Body Text:**
  - Standard text: `text-sm`
  - Description text: `text-xs text-gray-600`
  - Error messages: `text-xs text-red-600`
  - Disabled/placeholder: `text-gray-500`
  - Emphasized: `font-semibold`

### Colors

- **Backgrounds:**
  - Main application: `bg-white`
  - Log entry containers: `bg-slate-50`
  - Modals overlay: `bg-black bg-opacity-40`
  - Form fields: `bg-white` (for contrast against container backgrounds)
  - Error backgrounds: `bg-red-400 bg-opacity-20`
- **Borders:**
  - Standard borders: `border` (default gray)
  - Focused fields: `border-blue-500`
  - Error states: `border-red-300`
- **Text Colors:**
  - Primary text: default (dark)
  - Secondary text: `text-gray-600`
  - Error text: `text-red-600`
  - Success text: `text-green-800`

## Container Styling

### Modal Containers

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
  <div className="bg-white rounded-lg shadow-lg min-w-[700px] max-h-[80vh] overflow-y-auto no-scrollbar">
    <div className="px-6 py-4">{/* Modal content */}</div>
  </div>
</div>
```

### Section Containers

- **Standard section container:**

  ```jsx
  <div className="bg-slate-50 flex flex-col gap-4 mb-2 border p-2 rounded relative">
    {/* Section content */}
  </div>
  ```

- **Form sections:**
  ```jsx
  <div className="border rounded-lg p-4 bg-gray-50 mt-4">
    <h3 className="font-semibold text-sm mb-2">{sectionTitle}</h3>
    <p className="text-xs text-gray-600 mb-2">{sectionDescription}</p>
    {/* Form content */}
  </div>
  ```

### Spacing Guidelines

- **Vertical spacing:**
  - Between major sections: `mt-4` or `mb-4`
  - Between form groups: `gap-4`
  - Between related elements: `mb-2` or `gap-2`
- **Horizontal spacing:**
  - Between inline elements: `gap-1` or `gap-2`
  - Container padding: `p-2` for log entries, `p-4` for major sections
  - Form padding: `px-6 py-4`

## Form Elements

### Input Fields

```jsx
<div className="flex flex-col">
  <Label htmlFor="fieldName" className="text-xs">
    Field Label
  </Label>
  <Input
    name="fieldName"
    type="text"
    placeholder="Placeholder text"
    value={value}
    onChange={handler}
    className="bg-white w-[350px] text-xs"
  />
</div>
```

### Select Components

```jsx
<div className="flex flex-col">
  <Label htmlFor="selectField" className="text-xs">
    Select Label
  </Label>
  <Select onValueChange={handler} value={value}>
    <SelectTrigger className="bg-white w-[350px] text-xs">
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

### Combobox

```jsx
<SingleCombobox
  label="Field Label"
  options={optionsArray}
  value={selectedValue}
  onChange={handleChange}
  className="bg-white w-[350px] text-xs"
/>
```

### Form Layout

- **Row arrangement:**

  ```jsx
  <div className="flex flex-row items-end gap-2">{/* Input fields */}</div>
  ```

- **Column arrangement:**
  ```jsx
  <div className="flex flex-col gap-4">{/* Form groups */}</div>
  ```

## Button Styling

### Standard Buttons

- **Primary action:**

  ```jsx
  <Button
    type="submit"
    className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded"
  >
    Submit
  </Button>
  ```

- **Secondary action:**
  ```jsx
  <Button
    type="button"
    variant="outline"
    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
  >
    Cancel
  </Button>
  ```

### Special Purpose Buttons

- **Delete button:**

  ```jsx
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={deleteHandler}
    className="absolute top-0 right-0"
  >
    <X className="w-4 h-4" color="red" />
  </Button>
  ```

- **Add button:**

  ```jsx
  <Button
    type="button"
    onClick={addHandler}
    disabled={isDisabled}
    className={isDisabled ? "opacity-50" : ""}
  >
    <Plus className="h-8 w-8" color="white" />
  </Button>
  ```

- **Undo button:**
  ```jsx
  <Button
    type="button"
    size="default"
    className="w-[50px]"
    onClick={undoHandler}
  >
    <p className="text-xs">Undo</p>
  </Button>
  ```

## Status Indicators

### Badges

```jsx
<Badge
  variant="secondary"
  className="rounded-full px-2 py-1 bg-blue-500 text-white hover:bg-blue-500"
>
  {count}
</Badge>
```

### Status Messages

- **Error message:**

  ```jsx
  <div className="text-xs text-red-600 mb-2 bg-red-400 bg-opacity-20 px-6 py-4 rounded">
    <span className="font-bold">Error:</span> {errorMessage}
  </div>
  ```

- **Loading state:**
  ```jsx
  {
    loading && <div className="text-gray-500">Loading...</div>;
  }
  ```

## Component-Specific Styling

### Export Modal Styles

- **Modal Container:**

  - `fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40`
  - Inner: `bg-white rounded-lg shadow-lg min-w-[700px] max-h-[80vh] overflow-y-auto no-scrollbar`
  - Content: `px-6 py-4 flex flex-col gap-4 items-center w-full relative`

- **Header:**

  - Close button: `absolute top-0 right-0 cursor-pointer`, ghost variant, icon size
  - Title row: `flex flex-row gap-2 mb-2 items-center`
  - Title: `text-xl font-bold`
  - Description: `text-xs text-gray-600`
  - Note: `text-xs text-blue-600 italic`

- **Section Containers:**

  - Date range, export format, and advanced options: `border rounded-lg p-4 bg-gray-50 w-full` (add `mt-4` for spacing between sections)
  - Section header: `font-semibold text-sm mb-2`

- **Field Layout:**

  - Use `flex flex-col gap-3` for vertical field groups
  - Use `flex flex-row gap-4 mb-2` for radio button groups
  - Checkbox grid: `grid grid-cols-2 gap-2 w-full bg-slate-50 rounded-lg p-3 border border-gray-200`
  - Checkbox label: `flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition`
  - Checkbox text: `text-xs`

- **Buttons:**

  - Primary: `bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded disabled:opacity-50`
  - Secondary: `variant="outline" bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded`
  - Export/Cancel row: `flex flex-row gap-3 w-full mb-2 mt-4`

- **Popover/Calendar:**

  - Date picker button: `variant="outline" w-full justify-between font-normal`
  - Calendar popover: `w-auto overflow-hidden p-0` with inner `p-4 flex flex-col items-center`

- **Accordion:**

  - Advanced options: `Accordion type="single" collapsible className="w-full"`
  - Trigger: `flex items-center gap-2 text-base font-semibold`
  - Content: `w-full mb-4 flex items-center gap-2`
  - Badge: `inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold`

- **General:**
  - Maintain consistent spacing and sizing between all modal sections and fields
  - Use section headers and muted descriptions for clarity

### Timesheet Sections

- Use consistent styling for all log entry types (Trucking, Maintenance, Equipment, Tasco)
- Maintain consistent input widths across all similar fields
- Follow the pattern of using `bg-slate-50` for container backgrounds and `bg-white` for input fields

### Modal Header Structure

```jsx
<div className="mb-6 relative">
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onClose}
    className="absolute top-0 right-0 cursor-pointer"
  >
    <X width={20} height={20} />
  </Button>
  <div className="gap-2 flex flex-col">
    <h2 className="text-xl font-bold">{modalTitle}</h2>
    <p className="text-xs text-gray-600">{modalDescription}</p>
  </div>
</div>
```

## Best Practices

1. **Consistency**

   - Use the same styling for similar components across the application
   - Maintain consistent spacing, sizing, and color patterns
   - Match styling between Create and Edit versions of similar components

2. **Accessibility**

   - Ensure adequate color contrast for text elements
   - Include proper labels for all form fields
   - Use appropriate text sizes (minimum `text-xs`) for readability

3. **Responsive Design**

   - Use flexible layouts that adapt to different screen sizes
   - Consider mobile viewports when designing components
   - Test UI on various screen sizes to ensure proper rendering

4. **Visual Hierarchy**

   - Use size, color, and spacing to indicate importance
   - Group related information visually
   - Maintain consistent visual weight across similar components

5. **Error Handling**
   - Clearly mark required fields
   - Provide visible error messages near the relevant fields
   - Use consistent error styling throughout the application
