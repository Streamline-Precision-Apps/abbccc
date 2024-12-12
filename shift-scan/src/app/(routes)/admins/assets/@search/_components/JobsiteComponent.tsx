"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Jobsites } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

type Props = {
  jobsites: Jobsites[];
  setFilter: (filter: string) => void;
};

export const JobsiteComponent = ({ jobsites, setFilter }: Props) => {
  const t = useTranslations("Admins");
  const [term, setTerm] = useState<string>("");
  // const [page, setPage] = useState(true);
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) return jobsites; // Return the full list if no term is entered

    return jobsites.filter((jobsite) => {
      const name = jobsite.name;
      return name.includes(term.toLowerCase());
    });
  }, [term, jobsites]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectJobsite = (jobsite: Jobsites) => {
    setTerm(jobsite.name);
    router.push(`/admins/assets/jobsite/${jobsite.id}`);
  };

  const createJobsite = () => {
    router.push(`/admins/assets/new-jobsite`);
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className=" bg-white h-full w-full  ">
          <Selects
            defaultValue={"all"}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-0 py-2 text-center"
            // onClick={() => setPage(!page)}
          >
            <option value="all">{t("SelectFilter")}</option>
            <option value="all">{t("All")}</option>
            <option value="Temporary">{t("Temporary")}</option>
            <option value="active">{t("Active")}</option>
            <option value="inactive">{t("Inactive")}</option>
          </Selects>
        </Holds>
        {/* Search Input Section */}
        <Holds className="row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
          <>
            <Holds
              position={"row"}
              className="py-2 border-b-[3px] border-black"
            >
              <Holds className="h-full w-[20%]">
                <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
              </Holds>
              <Holds className="w-[80%]">
                <Inputs
                  type="search"
                  placeholder={t("JobsiteSearchPlaceholder")}
                  value={term}
                  onChange={handleSearchChange}
                  className="border-none outline-none"
                />
              </Holds>
            </Holds>
            <Holds className=" h-full mb-4  overflow-y-auto no-scrollbar ">
              <Holds>
                {filteredList.length > 0 ? (
                  filteredList.map((jobsite) => (
                    <Holds
                      key={jobsite.id}
                      className="py-2 border-b"
                      onClick={() => selectJobsite(jobsite)}
                    >
                      <Texts size="p6">
                        {jobsite.qrId} - {jobsite.name}
                      </Texts>
                    </Holds>
                  ))
                ) : (
                  <Texts size="p6" className="text-center">
                    {t("NoJobsiteFound")}
                  </Texts>
                )}
              </Holds>
            </Holds>
          </>
        </Holds>

        {/* Create New Jobsite Button */}
        <Buttons
          background="green"
          className="row-span-1 h-full"
          onClick={createJobsite}
        >
          <Texts size="p6">{t("CreateNewJobsite")}</Texts>
        </Buttons>
      </Grids>
    </Holds>
  );
};
