import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Form = {
  id: string;
  name: string;
  slug: string;
};
export default function FormSelection() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>("");
  const router = useRouter();
  // Fetch forms from the database on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("/api/forms");
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []);

  return (
    <Holds className="h-full row-span-9">
      <Grids rows={"9"} gap={"5"}>
        <Holds
          background={"white"}
          className="rounded-t-none row-span-3 h-full"
        >
          <Contents width={"section"} className="py-5">
            <Grids rows={"2"} gap={"3"}>
              <Selects
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="text-center"
              >
                <option value={""}>Select A Form</option>
                {forms.map((form) => (
                  <option key={form.id} value={form.slug}>
                    {form.name}
                  </option>
                ))}
              </Selects>
              <Holds className="flex justify-center items-center">
                <Buttons
                  onClick={() =>
                    router.push(`/hamburger/inbox/[${selectedForm}]`)
                  }
                  background={"green"}
                  className="p-3"
                >
                  <Titles size={"h4"}>Start Form</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
        <Holds background={"white"} className="row-span-6 h-full ">
          <Contents width={"section"} className="py-5">
            <Titles position={"left"} size={"h3"}>
              Drafts
            </Titles>
            <Holds
              background={"lightGray"}
              className="h-full my-2 overflow-y-scroll no-scrollbar "
            >
              {}
            </Holds>
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
