# Form Designer Component Unification Plan

This document outlines the plan to merge the existing FormBuilder and FormEditor components into a single unified component.

## Current Structure

Currently, we have two nearly identical components:

- `FormBuilder` - For creating new forms (`/src/app/(routes)/admins/forms/create/_component/FormBuilder/FormBuilder.tsx`)
- `FormEditor` - For editing existing forms (`/src/app/(routes)/admins/forms/edit/[id]/_component/FormEditor.tsx`)

## Component Differences Analysis

### 1. Component Props

- **FormBuilder Props:**
  - `onCancel?: () => void` - Callback function when cancellation is requested
- **FormEditor Props:**
  - `onCancel?: () => void` - Same callback function as FormBuilder
  - `formId: string | null` - ID of the form to edit

### 2. State Initialization

Both components initialize similar form state structures:

- `formSettings` - Main form configuration
- `formFields` - Fields in the form
- `formSections` - Sections of the form
- Various UI state variables

Key differences:

- **Loading state**: FormEditor has additional `loading` state for fetching form data

### 3. Data Fetching

- **FormBuilder**: No data fetching logic (creates from scratch)
- **FormEditor**: Uses useEffect to fetch form data from `/api/getForms/${formId}`

### 4. Save/Update Functionality

- **FormBuilder**: Uses `saveFormTemplate` API function to create a new form
- **FormEditor**: Uses `updateFormTemplate` API function with formId to update existing form

### 5. UI Differences

- FormEditor uses `FormEditorPanelLeft` while FormBuilder uses `FormBuilderPanelLeft`
- Button labeling may differ (Save vs Update)
- FormEditor has additional loading state UI

## Unified Component Structure

### New Component: `FormDesigner`

#### Props:

```typescript
interface FormDesignerProps {
  onCancel?: () => void; // Callback function for cancellation
  formId?: string; // Optional form ID for editing mode
  mode: "create" | "edit"; // Explicitly specify component mode
}
```

#### Location:

`/src/app/(routes)/admins/forms/_components/FormDesigner/FormDesigner.tsx`

## Implementation Plan

1. **Create the unified FormDesigner component**

   - Start with FormEditor as the base (since it includes all functionality of FormBuilder plus form fetching)
   - Add the mode prop and conditional logic
   - Rename all component-specific names to be generic (e.g., FormEditorPanelLeft → FormDesignerPanelLeft)

2. **Implement conditional data loading**

   - Make data fetching conditional based on mode="edit" and formId being present
   - Add proper error handling for invalid formId

3. **Create unified save function**

   - Combine saveForm and editForm into a single function that behaves differently based on mode
   - Maintain distinct API calls but unify pre/post processing

4. **Standardize UI elements**

   - Make button text conditional ("Save" vs "Update")
   - Conditionally show loading states

5. **Update the page components**

   - Update create page to use the new component with mode="create"
   - Update edit page to use the new component with mode="edit" and pass formId

6. **Test both flows**
   - Verify create flow works as before
   - Verify edit flow works as before

## Code Structure Example

```typescript
export default function FormDesigner({
  onCancel,
  formId,
  mode
}: FormDesignerProps) {
  // State initialization (same as before)
  const [formSettings, setFormSettings] = useState<FormSettings>({...});
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  // ...other state

  // Conditional data fetching
  useEffect(() => {
    if (mode === "edit" && formId) {
      const fetchForm = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/getForms/${formId}`);
          // Process form data as in FormEditor
        } catch (error) {
          toast.error("Error fetching form");
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    }
  }, [formId, mode]);

  // Unified save function
  const handleSave = async () => {
    if (!formSettings.name.trim()) {
      toast.error("Please enter a form name");
      return;
    }

    setLoadingSave(true);
    try {
      const payload = {
        // Common payload properties
        settings: {...},
        fields: formFields,
        companyId: formSettings.companyId,
      };

      // Conditional API call based on mode
      let result;
      if (mode === "edit" && formId) {
        result = await updateFormTemplate({
          ...payload,
          formId
        });
      } else {
        result = await saveFormTemplate(payload);
      }

      if (result.success) {
        toast.success(`Form ${mode === "edit" ? "updated" : "saved"} successfully!`);
        // Handle success
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(`Error ${mode === "edit" ? "updating" : "saving"} form`);
    } finally {
      setLoadingSave(false);
    }
  };

  // Rest of component with conditional rendering where needed
  return (
    <>
      {/* Action Buttons */}
      <div className="h-fit w-full flex flex-row gap-4 mb-4">
        <Button onClick={openCancelModal}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isValid}
        >
          {mode === "edit" ? "Update" : "Save"}
        </Button>
      </div>

      {/* Form Designer Content */}
      <div className="w-full bg-white h-[85vh] flex flex-row rounded-lg">
        <FormDesignerPanelLeft
          formFields={formFields}
          formSettings={formSettings}
          updateFormSettings={updateFormSettings}
        />
        {/* Main content area */}
        <FormDesignerPanelRight addField={addField} />
      </div>

      {/* Dialogs */}
    </>
  );
}
```

This unified approach will reduce code duplication, make future updates easier, and maintain all existing functionality with clearer separation of concerns.
