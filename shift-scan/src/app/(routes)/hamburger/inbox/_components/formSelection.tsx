import {
  createFormSubmission,
  deleteFormSubmission,
} from "@/actions/hamburgerActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
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

type SentContent = {
  id: string;
  title: string;
  formTemplateId: string;
  data: Record<string, string>;
  FormTemplate: {
    name: string;
    formType: string;
  };
  status: FormStatus;
};

export default function FormSelection({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  activeTab: number;
  isManager: boolean;
}) {
  const t = useTranslations("Hamburger-Inbox");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [formDrafts, setFormDrafts] = useState<DraftForm[]>([]);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  const fetchSentContent = async (skip: number, reset?: boolean) => {
    const response = await fetch(
      `/api/formSubmissions/${selectedFilter}?skip=${skip}&take=10`
    );
    return await response.json();
  };

  const {
    data: sentContent,
    isLoading,
    isInitialLoading,
    lastItemRef,
  } = useInfiniteScroll<SentContent>({
    fetchFn: fetchSentContent,
    dependencies: [selectedFilter],
  });

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
    <Grids rows={"10"} gap={"5"} className="h-full">
      <Holds
        background={"white"}
        className={`w-full h-full row-start-1 row-end-3 rounded-t-none  ${
          loading && "animate-pulse"
        } `}
      >
        <Contents width={"section"} className="">
          <Holds position={"left"} className=" pt-3 pb-1  w-full">
            <Texts
              text={"gray"}
              position={"left"}
              size={"p6"}
              className="italic"
            >
              {t("NewForm")}
            </Texts>
          </Holds>
          <Holds
            position={"row"}
            className="w-full h-full justify-center items-center gap-x-2 pb-3 "
          >
            <Holds>
              {loading ? (
                <Selects
                  value={""}
                  disabled
                  className="text-center text-sm disabled:bg-white h-full p-2"
                >
                  <option value={""}>{t("Loading")}</option>
                </Selects>
              ) : (
                <Selects
                  value={selectedForm}
                  onChange={(e) => setSelectedForm(e.target.value)}
                  className="text-center text-sm h-full p-2 "
                >
                  <option value={""}>{t("SelectAForm")}</option>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </Selects>
              )}
            </Holds>
            <Holds className="w-fit ">
              <Buttons
                shadow={"none"}
                onClick={() => {
                  setFormPage();
                }}
                background={selectedForm === "" ? "darkGray" : "green"}
                disabled={selectedForm === ""}
                className="w-fit h-full p-2"
              >
                <Images
                  titleImgAlt="plus"
                  titleImg="/plus.svg"
                  className="max-w-10 h-auto object-contain m-auto"
                />
              </Buttons>
            </Holds>
          </Holds>
        </Contents>
      </Holds>

      <Holds
        background={"white"}
        className={`row-start-3 row-end-11 h-full  ${
          loading && "animate-pulse"
        } `}
      >
        <Grids rows={"6"} className="h-full w-full ">
          <Holds className="row-start-1 row-end-2 h-fit w-full ">
            <Contents width={"section"}>
              <Holds className="pb-1">
                <Titles position={"left"} size={"h5"}>
                  {t("Submissions")}
                </Titles>
              </Holds>
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center "
              >
                <option value="all">{t("SelectAFilter")}</option>
                <option value="draft">{t("Drafts")}</option>
                <option value="pending">{t("Pending")}</option>
                <option value="approved">{t("Approved")}</option>
                <option value="denied">{t("Denied")}</option>
              </Selects>
            </Contents>
          </Holds>
          {isInitialLoading ? (
            <Holds className="row-start-2 row-end-7 h-full w-full  border-t-black border-opacity-5 border-t-2">
              <Contents width={"section"}>
                <Holds className="h-full justify-center items-center">
                  <Spinner />
                </Holds>
              </Contents>
            </Holds>
          ) : (
            <Holds className="row-start-2 row-end-7 h-full w-full overflow-y-scroll no-scrollbar border-t-black border-opacity-5 border-t-2">
              <Contents width={"section"}>
                {!sentContent ||
                  (sentContent.length === 0 && (
                    <Holds className="h-full">
                      <Texts size={"p5"} className="italic text-gray-500">
                        {selectedFilter === "denied"
                          ? t("NoDeniedFormsSubmitted")
                          : selectedFilter === "pending"
                          ? t("NoPendingFormsSubmitted")
                          : selectedFilter === "approved"
                          ? t("NoApprovedFormsSubmitted")
                          : t("NoFormsSubmitted")}
                      </Texts>
                      <Texts size={"p7"} className="italic text-gray-500">
                        {t("GoToFormsSectionToCreateForms")}
                      </Texts>
                    </Holds>
                  ))}
                <Holds className="gap-y-4 pt-3 pb-5">
                  {sentContent.map((form, index) => {
                    const title =
                      form.title.charAt(0).toUpperCase() +
                        form.title.slice(1) || form.FormTemplate?.name;

                    const isLastItem = index === sentContent.length - 1;

                    return (
                      <Buttons
                        key={form.id}
                        ref={isLastItem ? lastItemRef : null}
                        shadow={"none"}
                        className="py-1 relative"
                        background={
                          form.status === "PENDING"
                            ? "orange"
                            : form.status === "APPROVED"
                            ? "green"
                            : "red"
                        }
                        onClick={() => {
                          router.push(
                            `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}&status=${form.status}`
                          );
                        }}
                        disabled={isLoading}
                      >
                        <Holds className="w-full h-full relative">
                          <Titles size={"h3"}>{title}</Titles>
                          <Titles size={"h7"}>
                            {form.FormTemplate?.formType}
                          </Titles>
                          <Images
                            titleImgAlt={"form Status"}
                            titleImg={
                              form.status === "PENDING"
                                ? "/statusOngoingFilled.svg"
                                : form.status === "APPROVED"
                                ? "/statusApprovedFilled.svg"
                                : "/statusDeniedFilled.svg"
                            }
                            className="absolute max-w-10 h-auto object-contain top-[50%] translate-y-[-50%] right-2"
                          />
                        </Holds>
                      </Buttons>
                    );
                  })}
                  {isLoading && (
                    <Holds className="flex justify-center py-4">
                      <Spinner />
                    </Holds>
                  )}
                </Holds>
              </Contents>
            </Holds>
          )}
        </Grids>
        {/* <Contents width={"section"} className=" pt-3 pb-5">
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
                        shadow={"none"}
                        className="py-1"
                        onClick={() => {
                          router.push(
                            `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}&status=${form.status}`
                          );
                        }}
                      >
                        <Holds>
                          <Titles size={"h4"}>{title}</Titles>
                          <Holds
                            position={"row"}
                            className="space-x-1 justify-center"
                          >
                            <Texts size={"p7"}>{t("Created")}</Texts>
                            <Texts size={"p7"}>
                              {format(
                                new Date(form.createdAt).toISOString(),
                                "Pp"
                              )}
                            </Texts>
                          </Holds>
                        </Holds>
                      </Buttons>
                    </SlidingDiv>
                  </Holds>
                );
              })}
          </Holds> 
        </Contents> */}
      </Holds>
    </Grids>
  );
}
