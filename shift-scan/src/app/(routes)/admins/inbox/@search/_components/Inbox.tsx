"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { TimeRequest } from "../default";

type Props = {
  employees: TimeRequest[];
  setFilter: (filter: string) => void;
};

export const InboxContent = ({ employees, setFilter }: Props) => {
  const [term, setTerm] = useState<string>("");
  const t = useTranslations("Admins");
  // const [page, setPage] = useState(true);
  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) {
      return [...employees].sort((a, b) =>
        a.employee.lastName.localeCompare(b.employee.lastName)
      );
    } // Return the full list if no term is entered

    return employees
      .filter((employee) => {
        const name =
          `${employee.employee.firstName} ${employee.employee.lastName}`.toLowerCase();
        return name.includes(term.toLowerCase());
      })
      .sort((a, b) => a.employee.lastName.localeCompare(b.employee.lastName));
  }, [term, employees]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectEmployee = (employee: TimeRequest) => {
    setTerm("");
    router.push(`/admins/inbox/${employee.id}`);
  };

  const createEmployee = () => {
    router.push(`/admins/personnel/new-employee`);
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className=" bg-white h-full w-full  ">
          <Selects
            defaultValue={"pending"}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-0 py-2 text-center"
          >
            <option value="pending">{t("Pending")}</option>
            <option value="denied">{t("Denied")}</option>
            <option value="approved">{t("Approved")}</option>
            <option value="archived-denied">{t("ArchivedDenied")}</option>
            <option value="archived-approved">{t("ArchivedApproved")}</option>
            <option value="all">{t("AllRecent")}</option>
            <option value="all-archived">{t("AllArchived")}</option>
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
                  placeholder={t("PersonalSearchPlaceholder")}
                  value={term}
                  onChange={handleSearchChange}
                  className="border-none outline-none"
                />
              </Holds>
            </Holds>
            <Holds className=" h-full mb-4  overflow-y-auto no-scrollbar ">
              <Holds>
                {filteredList.length > 0 ? (
                  filteredList.map((employee) => (
                    <Holds
                      position={"row"}
                      key={employee.id}
                      className={`py-2 border-b-[3px] border-black ${
                        employee.status === "DENIED"
                          ? "bg-app-red"
                          : employee.status === "APPROVED"
                          ? "bg-app-green"
                          : "bg-app-orange"
                      }`}
                      onClick={() => selectEmployee(employee)}
                    >
                      <Grids cols="6" rows={"3"} className="w-full ">
                        <Holds className="col-span-1 row-span-3">
                          <Images
                            titleImg={
                              employee.employee.image || "/profile-sm.svg"
                            }
                            titleImgAlt="employee"
                            className={`w-12 h-12 rounded-full ${
                              employee.employee.image &&
                              "border-[3px] border-black"
                            }`}
                          />
                        </Holds>
                        <Holds className="col-span-3 row-span-3">
                          <Texts position={"left"} size="p5" className="pl-2">
                            {employee.employee.firstName}{" "}
                            {employee.employee.lastName}
                          </Texts>
                        </Holds>
                        <Holds className="col-span-2 row-span-1 pr-2">
                          <Texts
                            position={"right"}
                            size="p7"
                            className="text-[5pt]"
                          >
                            {`${new Date(
                              employee.requestedStartDate
                            ).toLocaleDateString()} - ${new Date(
                              employee.requestedEndDate
                            ).toLocaleDateString()}`}
                          </Texts>
                        </Holds>
                      </Grids>
                    </Holds>
                  ))
                ) : (
                  <Texts size="p6" className="text-center">
                    {t("NoRequestsFound")}
                  </Texts>
                )}
              </Holds>
            </Holds>
          </>
        </Holds>

        {/* Create New Employee Button */}
        <Buttons
          background="green"
          className="row-span-1 h-full"
          onClick={createEmployee}
        >
          <Texts size="p6">{t("CreateNewRequest")}</Texts>
        </Buttons>
      </Grids>
    </Holds>
  );
};
