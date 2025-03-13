import {
  createFormSubmission,
  deleteFormSubmission,
} from "@/actions/hamburgerActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Form = {
  id: string;
  name: string;
};
type DraftForm = {
  id: string;
  formTemplateId: string;
  formTemplate: {
    name: string;
  };
};
export default function FormSelection({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [formDrafts, setFormDrafts] = useState<DraftForm[]>([]);
  const { data: session } = useSession();
  const userId = session?.user.id;

  const router = useRouter();
  // Fetch forms from the database on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/forms");
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  useEffect(() => {
    const fetchFormDrafts = async () => {
      const drafts = await fetch("/api/formDrafts");
      const res = await drafts.json();
      setFormDrafts(res);
    };
    fetchFormDrafts();
  }, []);

  const setFormPage = async () => {
    // create a form that isn't submitted
    const formData = new FormData();
    formData.append("formTemplateId", selectedForm);
    userId && formData.append("userId", userId);

    const submissionId = await createFormSubmission(formData);

    if (!submissionId) {
      console.log("no data returned");
      return;
    }
    router.push(
      `/hamburger/inbox/formSubmission/${selectedForm}?submissionId=${submissionId}
        `
    );
  };
  return (
    <Holds className="h-full row-span-9">
      <Grids rows={"9"} gap={"5"}>
        <Holds
          background={"white"}
          className={`rounded-t-none row-span-3 h-full ${
            loading && "animate-pulse"
          } `}
        >
          <Contents width={"section"} className="py-5">
            <Grids rows={"2"} gap={"3"}>
              {loading ? (
                <Selects
                  value={""}
                  disabled
                  className="text-center disabled:bg-white"
                >
                  <option value={""}>Loading...</option>
                </Selects>
              ) : (
                <Selects
                  value={selectedForm}
                  onChange={(e) => setSelectedForm(e.target.value)}
                  className="text-center"
                >
                  <option value={""}>Select A Form</option>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </Selects>
              )}
              <Holds className="flex justify-center items-center">
                <Buttons
                  onClick={() => {
                    setFormPage();
                  }}
                  background={"green"}
                  className="p-3"
                >
                  <Titles size={"h4"}>Start Form</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
        <Holds
          background={"white"}
          className={`row-span-6 h-full ${loading && "animate-pulse"} `}
        >
          <Contents width={"section"} className="py-5">
            <Titles position={"left"} size={"h3"}>
              Drafts
            </Titles>
            <Holds className="h-full mt-5 overflow-y-scroll no-scrollbar ">
              {formDrafts &&
                formDrafts.map((form) => (
                  <Holds key={form.id} className="pb-2">
                    <SlidingDiv
                      onSwipeLeft={async () => {
                        try {
                          await deleteFormSubmission(form.id);
                          // Remove the deleted form from the list
                          setFormDrafts((prevDrafts) =>
                            prevDrafts.filter((draft) => draft.id !== form.id)
                          );
                        } catch (error) {
                          console.error("Error deleting form draft:", error);
                        }
                      }}
                    >
                      <Buttons
                        className="py-2"
                        onClick={() => {
                          router.push(
                            `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}`
                          );
                        }}
                      >
                        <Titles size={"h5"}>{form.formTemplate.name}</Titles>
                      </Buttons>
                    </SlidingDiv>
                  </Holds>
                ))}
            </Holds>
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
