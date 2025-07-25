"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import FormEditor from "./_component/FormEditor";
import { useRouter } from "next/navigation";

export default function FormPage({ params }: { params: { id: string } }) {
  const { setOpen, open } = useSidebar();
  const { id } = params;
  const router = useRouter();

  const handleCancel = () => {
    router.push("/admins/forms");
  };

  return (
    <div className="h-full w-full flex flex-row p-4">
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-row gap-5 mb-4">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20 ${
                open ? "bg-slate-500 bg-opacity-20" : "bg-app-blue "
              }`}
              onClick={() => {
                setOpen(!open);
              }}
            >
              <img
                src={open ? "/condense-white.svg" : "/condense.svg"}
                alt="logo"
                className="w-4 h-auto object-contain "
              />
            </Button>
          </div>
          <div className="flex flex-col">
            <p className="text-left font-bold text-base text-white">
              Form Builder
            </p>
            <p className="text-left font-normal text-xs text-white">
              Design your custom form by adding fields, configuring validation,
              and setting up workflows.
            </p>
          </div>
        </div>
        <FormEditor formId={id} onCancel={handleCancel} />
      </div>
    </div>
  );
}
