"use client";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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

export default function STab() {
  const t = useTranslations("Hamburger-Inbox");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
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

  return (
    <Holds background={"white"} className={`h-full rounded-t-none `}>
      <Grids rows={"10"} className="h-full w-full ">
        <Holds className="row-start-1 row-end-2 h-fit w-full">
          <Contents width={"section"}>
            <Selects
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-center justify-center "
            >
              <option value="all">{t("SelectAFilter")}</option>
              <option value="pending">{t("Pending")}</option>
              <option value="approved">{t("Approved")}</option>
              <option value="denied">{t("Denied")}</option>
            </Selects>
          </Contents>
        </Holds>
        {isInitialLoading ? (
          <Holds className="row-start-2 row-end-9 h-full w-full  border-t-black border-opacity-5 border-t-2">
            <Contents width={"section"}>
              <Holds className="h-full justify-center items-center">
                <Spinner />
              </Holds>
            </Contents>
          </Holds>
        ) : (
          <Holds className="row-start-2 row-end-11 h-full w-full overflow-y-scroll no-scrollbar border-t-black border-opacity-5 border-t-2">
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
                    form.title.charAt(0).toUpperCase() + form.title.slice(1) ||
                    form.FormTemplate?.name;

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
    </Holds>
  );
}
