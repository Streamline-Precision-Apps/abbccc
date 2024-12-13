"use client";
import { CheckBox } from "@/components/(inputs)/checkBox";
import CheckBoxWithImage from "@/components/(inputs)/CheckBoxWithImage";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  permission: string;
  supervisor: boolean;
  image: string;
};

export default function CrewLeft({
  setFilter,
  employees,
  toggledUsers,
  toggleUser,
  toggledManager,
  toggleManager,
  teamLead,
}: {
  setFilter: (filter: string) => void;
  employees: User[];
  addToCrew: (employee: User) => void;
  toggledUsers: Record<string, boolean>;
  toggleUser: (id: string) => void;
  toggledManager: Record<string, boolean>;
  toggleManager: (id: string) => void;
  teamLead: string | null;
}) {
  const [term, setTerm] = useState<string>("");
  const t = useTranslations("Admins");
  const filteredList = useMemo(() => {
    if (!term.trim()) return employees;
    return employees.filter((employee) => {
      const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return name.includes(term.toLowerCase());
    });
  }, [term, employees]);

  return (
    <Holds className="h-full w-full px-4 py-2">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className="bg-white h-full w-full">
          <Selects
            defaultValue="all"
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-0 py-2 text-center"
          >
            <option value="all">{t("SelectFilter")}</option>
            <option value="all">{t("All")}</option>
            <option value="supervisors">{t("Supervisors")}</option>
          </Selects>
        </Holds>
        <Holds className="row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
          <Holds position="row" className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder={t("SearchCrewMembers")}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>
          <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
            {filteredList.map((employee) => (
              <Holds
                key={employee.id}
                className="py-2 border-b cursor-pointer flex items-center"
              >
                <Holds position={"row"} className="justify-between">
                  <Holds className="flex w-2/3">
                    <Texts size="p6">
                      {employee.firstName} {employee.lastName}
                    </Texts>
                  </Holds>
                  <Holds position="row" className="relative flex w-1/3">
                    {!employee.permission.includes("USER") &&
                    toggledUsers[employee.id] ? (
                      <Holds className="relative w-1/2">
                        {!teamLead ? (
                          <CheckBoxWithImage
                            id={employee.id}
                            defaultChecked={!!toggledManager[employee.id]}
                            onChange={() => {
                              toggleManager(employee.id);
                            }}
                            size={2}
                            name={""}
                            type=""
                          />
                        ) : teamLead === employee.id ? (
                          <CheckBoxWithImage
                            id={employee.id}
                            defaultChecked={!!toggledManager[employee.id]}
                            onChange={() => {
                              toggleManager(employee.id);
                            }}
                            size={2}
                            name={""}
                            type="selected"
                          />
                        ) : (
                          <CheckBoxWithImage
                            id={employee.id}
                            size={2}
                            name={""}
                            disabled
                          />
                        )}
                      </Holds>
                    ) : (
                      <Holds className="relative w-1/2"></Holds>
                    )}
                    <CheckBox
                      id={employee.id}
                      defaultChecked={!!toggledUsers[employee.id]}
                      onChange={() => toggleUser(employee.id)}
                      disabled={employee.id === teamLead}
                      size={2}
                      name={""}
                    />
                  </Holds>
                </Holds>
              </Holds>
            ))}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
