import {
  createFormSubmission,
  deleteFormSubmission,
} from "@/actions/hamburgerActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Form = {
  id: string;
  name: string;
};
type DraftForm = {
  id: string;
  title: string;
  formTemplateId: string;
  status: FormStatus;
  createdAt: string;
  data: Record<string, string>;
  FormTemplate: {
    name: string;
  };
};

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}
export default function FormSelection({
  loading,
  setLoading,
  setActiveTab,
  activeTab,
  isManager,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  activeTab: number;
  isManager: boolean;
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
      `/hamburger/inbox/formSubmission/${selectedForm}?submissionId=${submissionId}&status=DRAFT
        `
    );
  };
  return (
    <Holds className="h-full w-full">
      <Grids rows={"7"} gap={"5"}>
        <Holds
          className={` row-start-1 row-end-3 h-full ${
            loading && "animate-pulse"
          } `}
        >
          <Holds position={"row"} className="gap-x-1 h-10">
            <NewTab
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={true}
              titleImage={"/formSelection.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Form Selection</Titles>
            </NewTab>
            <NewTab
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={true}
              titleImage={"/submittedForms.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Submitted Forms</Titles>
            </NewTab>
            {isManager && (
              <NewTab
                onClick={() => setActiveTab(3)}
                isActive={activeTab === 3}
                isComplete={true}
                titleImage={"/pendingForms.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h5"}>Pending Forms</Titles>
              </NewTab>
            )}

            <NewTab
              onClick={() => setActiveTab(4)}
              isActive={activeTab === 4}
              isComplete={true}
              titleImage={"/pendingForms.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Company Documents</Titles>
            </NewTab>
          </Holds>
          <Holds
            background={"white"}
            className={`h-full row-start-2 row-end-4 rounded-t-none py-3 ${
              loading && "animate-pulse"
            } `}
          >
            <Contents width={"section"}>
              {loading ? (
                <Selects
                  value={""}
                  disabled
                  className="text-center text-xs disabled:bg-white"
                >
                  <option value={""}>Loading...</option>
                </Selects>
              ) : (
                <Selects
                  value={selectedForm}
                  onChange={(e) => setSelectedForm(e.target.value)}
                  className="text-center text-xs"
                >
                  <option value={""}>Select A Form</option>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </Selects>
              )}
              <Holds>
                <Buttons
                  onClick={() => {
                    setFormPage();
                  }}
                  background={"green"}
                  disabled={!selectedForm}
                  className="py-1"
                >
                  <Titles size={"h5"}>Start Form</Titles>
                </Buttons>
              </Holds>
            </Contents>
          </Holds>
        </Holds>
        <Holds
          background={"white"}
          className={`row-span-6 h-full ${loading && "animate-pulse"} `}
        >
          <Contents width={"section"} className="py-5">
            <Titles position={"left"} size={"h3"}>
              Drafts
            </Titles>
            <Holds className="h-full overflow-y-scroll no-scrollbar ">
              {formDrafts &&
                formDrafts.map((form) => {
                  const title = form.title || form.FormTemplate.name;
                  return (
                    <Holds key={form.id} className="pt-2">
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
                          className="py-1"
                          onClick={() => {
                            router.push(
                              `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}&status=${form.status}`
                            );
                          }}
                        >
                          <Titles size={"h4"}>{title}</Titles>
                          <Titles size={"h6"}>
                            {" "}
                            {`Created  ${format(
                              new Date(form.createdAt).toISOString(),
                              "M/dd/yy"
                            )}`}
                          </Titles>
                        </Buttons>
                      </SlidingDiv>
                    </Holds>
                  );
                })}
            </Holds>
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
