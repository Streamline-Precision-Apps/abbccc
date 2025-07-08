import { Input } from "@/components/ui/input";
import { fieldTypes, FormField, FormSettings } from "./FormBuilder";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function FormBuilderPanelLeft({
  formFields,
  formSettings,
  updateFormSettings,
}: {
  formFields: FormField[];
  formSettings: FormSettings;
  updateFormSettings: (
    key: keyof FormSettings,
    value: string | boolean
  ) => void;
}) {
  return (
    <ScrollArea className="w-full h-full bg-white bg-opacity-40 rounded-tl-lg rounded-bl-lg  relative">
      <Tabs defaultValue="settings" className="w-full h-full p-4 ">
        <TabsList className="w-full">
          <TabsTrigger
            value="settings"
            className="w-full text-xs data-[state=active]:bg-sky-400 py-2 "
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="w-full text-xs data-[state=active]:bg-sky-400 py-2 "
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <div className="flex flex-col mt-4">
            <Label htmlFor="name" className="text-xs">
              Form Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formSettings.name}
              onChange={(e) => updateFormSettings("name", e.target.value)}
              placeholder="Enter Form Name"
              className="bg-white rounded-lg text-xs"
            />
            {!formSettings.name.trim() && (
              <span className="mt-1 text-xs text-red-500">Required</span>
            )}
          </div>
          <div className=" w-full mt-4">
            <Label htmlFor="description" className="text-xs">
              Description
            </Label>
            <Textarea
              placeholder="Describe the purpose of this form"
              id="description"
              value={formSettings.description}
              onChange={(e) =>
                updateFormSettings("description", e.target.value)
              }
              rows={5}
              maxLength={200}
              className="bg-white rounded-lg text-xs "
            />
          </div>
          <div className=" w-full mt-4">
            <Label htmlFor="category" className="text-xs">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              name="category"
              value={formSettings.formType}
              onValueChange={(value) => updateFormSettings("formType", value)}
            >
              <SelectTrigger className="w-full bg-white rounded-lg text-xs">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAFETY">Safety</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="INSPECTION">Inspection</SelectItem>
                <SelectItem value="INCIDENT">Incident Report</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {!formSettings.formType && (
              <span className="mt-1 text-xs text-red-500">Required</span>
            )}
          </div>
          <div className=" w-full mt-4">
            <Label htmlFor="status" className="text-xs">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              name="status"
              value={formSettings.isActive}
              onValueChange={(value) => updateFormSettings("isActive", value)}
            >
              <SelectTrigger className="w-full bg-white rounded-lg text-xs">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
            {!formSettings.isActive && (
              <span className="mt-1 text-xs text-red-500">Required</span>
            )}
          </div>
          <div className="mt-4 w-full flex flex-row justify-between items-center ">
            <Label htmlFor="airplane-mode" className="text-xs">
              Require Signature
            </Label>
            <Switch
              id="airplane-mode"
              name="airplane-mode"
              checked={formSettings.requireSignature}
              onCheckedChange={(checked) =>
                updateFormSettings("requireSignature", checked)
              }
              className="bg-white  data-[state=unchecked]:bg-neutral-500 data-[state=checked]:bg-sky-400 w-10"
            />
          </div>
        </TabsContent>
        <TabsContent
          value="preview"
          className="w-full h-full flex flex-col gap-5 overflow-auto"
        >
          <div className="w-full h-fit justify-between mt-4 flex flex-row gap-5">
            <div className="w-full h-full px-2 py-1 bg-white flex flex-col justify-center items-center rounded-lg">
              <p>{formFields.length}</p>
              <p className="text-xs">Questions</p>
            </div>
            <div className="w-full h-full px-2 py-1 bg-white flex flex-col justify-center items-center rounded-lg">
              <p>{formFields.filter((f) => f.required).length}</p>
              <p className="text-xs">Required</p>
            </div>
          </div>
          {formFields.length === 0 ? (
            <div className="w-full h-full  justify-center items-center flex flex-col rounded-lg p-4 mt-6">
              <img
                src="/formInspect.svg"
                alt="Form Preview Placeholder"
                className="w-full h-6 mb-2"
              />
              <p className="text-xs text-gray-500">No questions added yet</p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <p className="text-sm font-bold">Form Structure</p>
              {formFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-row items-center gap-2 rounded-lg"
                >
                  <p className="text-xs font-semibold">{index + 1}.</p>

                  <Button
                    size={"icon"}
                    variant="default"
                    className={`w-8 h-auto p-1 justify-start ${(() => {
                      const typeDef = fieldTypes.find(
                        (t) => t.name === field.type
                      );
                      return typeDef
                        ? `${typeDef.color} hover:${typeDef.color
                            .replace("bg-", "bg-")
                            .replace("400", "300")
                            .replace("500", "400")
                            .replace("200", "100")}`
                        : "bg-gray-400 hover:bg-gray-300";
                    })()} `}
                  >
                    <img
                      src={fieldTypes.find((t) => t.name === field.type)?.icon}
                      alt={field.type}
                      className="w-4 h-4 "
                    />
                  </Button>

                  <div className="flex flex-col w-full">
                    {field.type !== "header" && field.type !== "paragraph" && (
                      <p className="text-xs font-medium text-gray-700">
                        {field.label || "Untitled Field"}
                      </p>
                    )}
                  </div>
                  {field.type === "dropdown" ||
                    (field.type === "multiselect" && (
                      <p className="w-fit text-xs text-gray-500">
                        {`${field.Options?.length || 0}`}
                      </p>
                    ))}
                  {field.required && (
                    <span className="text-xs text-red-500 ml-1">*</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
}
