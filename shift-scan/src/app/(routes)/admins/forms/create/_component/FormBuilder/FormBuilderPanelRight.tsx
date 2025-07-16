import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fieldTypes } from "./FormBuilder";

export function FormBuilderPanelRight({
  addField,
}: {
  addField: (fieldType: string) => void;
}) {
  return (
    <ScrollArea className="w-full h-full bg-white bg-opacity-40 rounded-tr-lg rounded-br-lg ">
      {/* Field Types */}
      <div className="flex flex-row gap-x-4 h-10 w-full items-center my-3 p-4">
        <Button
          variant={"default"}
          size={"icon"}
          className="bg-emerald-300 hover:bg-emerald-200"
        >
          <img src="/plus.svg" alt="Add Field Icon" className="w-4 h-4" />
        </Button>
        <div className="flex flex-col">
          <p className="text-sm font-bold">Field types</p>
          <p className="text-xs">Click to add field</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-3 py-2 bg-white">
        {[...fieldTypes]
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((fieldType) => (
            <button
              key={fieldType.name}
              onClick={() => addField(fieldType.name)}
              className="flex flex-row items-center p-2 rounded-md hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
            >
              <div
                className={`w-8 h-8 mr-3 rounded-sm ${fieldType.color} flex items-center justify-center`}
              >
                <img
                  src={fieldType.icon}
                  alt={fieldType.label}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-sm font-semibold">{fieldType.label}</p>
                <p className="text-xs text-gray-400">{fieldType.description}</p>
              </div>
            </button>
          ))}
      </div>
    </ScrollArea>
  );
}
