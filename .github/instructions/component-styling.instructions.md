# Component Styling Standards

This document outlines the styling standards for components across the application, particularly for form sections and interactive elements. Following these guidelines ensures visual consistency throughout the application.

## Container Styling

### Section Containers

- Use `bg-slate-50` for all log entry containers
- Add `border` class to provide clear boundaries
- Use `p-2` for internal padding (not `p-4`)
- Include `rounded` for slightly rounded corners
- Use `mb-2` or `mb-3` for proper spacing between entries
- Example: `className="bg-slate-50 flex flex-col gap-4 mb-2 border p-2 rounded relative"`

### Spacing

- Use `gap-4` for vertical spacing between elements within a container
- Use `gap-1` or `gap-2` for horizontal spacing between related elements
- Use `my-2` for vertical margin on section headers

## Form Fields

### Input Fields

- Always add `bg-white` to inputs for proper contrast against container backgrounds
- Use consistent widths:
  - Standard inputs: `w-[350px]`
  - Numeric inputs in pairs: `w-[160px]` or `w-[200px]`
- Always include `text-xs` for smaller text in inputs
- Example: `className="bg-white w-[350px] text-xs"`

### Labels

- Use the `Label` component from UI library
- Add `text-xs` class to all labels for consistent sizing
- Example:
  ```jsx
  <Label htmlFor="fieldName" className="text-xs">
    Field Label
  </Label>
  ```

### Select Components

- Add `bg-white` to select triggers
- Use `text-xs` for select text
- Maintain consistent widths matching inputs
- Example: `<SelectTrigger className="bg-white w-[350px] text-xs">`

## Buttons

### Delete Buttons

- Use `variant="ghost"` (not `variant="destructive"`)
- Position with `className="absolute top-0 right-0"`
- Use Lucide `<X>` icon with red color: `<X className="w-4 h-4" color="red" />`

### Add Buttons

- Use consistent icon sizing of `h-8 w-8` for add buttons (`Plus` icon)
- Use `color="white"` for icon color
- For section add buttons: `<Plus className="h-8 w-8" color="white" />`

## Layout Structure

### Form Groups

- Use flex containers for related input groups:
  ```jsx
  <div className="flex flex-row gap-1 items-end">
    <div className="flex flex-col">{/* Label and input go here */}</div>
  </div>
  ```

### Section Headers

- Use consistent header structure:
  ```jsx
  <div className="flex flex-row justify-between items-center my-2">
    <div className="flex-1">
      <p className="block font-semibold text-sm">{sectionTitle}</p>
      <p className="text-xs text-gray-500 pt-1">{sectionDescription}</p>
    </div>
    <div className="flex justify-end">{/* Add button goes here */}</div>
  </div>
  ```

## Icons

- Use Lucide icons when possible (`Plus`, `X`, etc.)
- Maintain consistent sizing:
  - Small icons: `w-4 h-4`
  - Add buttons: `h-8 w-8`

## Examples

### Log Entry Container

```jsx
<div
  key={idx}
  className="bg-slate-50 flex flex-col gap-4 mb-2 border p-2 rounded relative"
>
  {/* Content */}
</div>
```

### Input with Label

```jsx
<div className="flex flex-col">
  <Label htmlFor="fieldName" className="text-xs">
    Field Label
  </Label>
  <Input
    name="fieldName"
    type="text"
    placeholder="Placeholder"
    value={value}
    onChange={handler}
    className="bg-white w-[350px] text-xs"
  />
</div>
```

### Delete Button

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

### Add Button

```jsx
<Button
  size="icon"
  type="button"
  onClick={addHandler}
  disabled={isDisabled}
  className={isDisabled ? "opacity-50" : ""}
>
  <Plus className="h-8 w-8" color="white" />
</Button>
```

This styling guide ensures visual consistency across all form sections and interactive elements in the application.
