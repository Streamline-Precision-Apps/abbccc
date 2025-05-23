"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { SearchUser } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
type Props = {
  employees: SearchUser[];
  setFilter: (filter: string) => void;
};

export const Timesheets = ({ employees, setFilter }: Props) => {
  const t = useTranslations("Admins");
  const [term, setTerm] = useState<string>("");
  const [page, setPage] = useState(true);

  const router = useRouter();

  // Memoize the filtered list to avoid re-filtering on every render
  const filteredList = useMemo(() => {
    if (!term.trim()) {
      return [...employees].sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      );
    } // Return the full list if no term is entered

    return employees
      .filter((employee) => {
        const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return name.includes(term.toLowerCase());
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [term, employees]);

  // Debounce handler to avoid rapid state updates on each keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectEmployee = (employee: SearchUser) => {
    setTerm(employee.firstName + " " + employee.lastName);

    router.push(`/admins/personnel/timesheets/${employee.id}`);
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows="10" gap="5" className="h-full py-5">
        <Holds className=" bg-white row-span-1 h-full w-full gap-4 ">
          <Selects
            defaultValue={"all"}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-0 py-2 text-center"
            onClick={() => setPage(!page)}
          >
            <option value="all">{t("SelectFilter")}</option>
            <option value="all">{t("All")}</option>
            <option value="active">{t("Active")}</option>
            <option value="admins">{t("Admins")}</option>
            <option value="inactive">{t("Inactive")}</option>
            <option value="laborers">{t("Laborers")}</option>
            <option value="managers">{t("Managers")}</option>
            <option value="mechanics">{t("Mechanics")}</option>
            <option value="recentlyHired">{t("RecentlyHired")}</option>
            <option value="superAdmins">{t("SuperAdmins")}</option>
            <option value="tasco">{t("Tasco")}</option>
            <option value="truckers">{t("TruckDrivers")}</option>
          </Selects>
        </Holds>
        {/* Search Input Section */}
        <Holds className="row-span-9 h-full border-[3px]  border-black rounded-t-[10px]">
          {page && (
            <>
              <Holds
                position={"row"}
                className="py-2 border-b-[3px] border-black"
              >
                <Holds className="h-full w-[20%]">
                  <Images
                    titleImg="/searchLeft.svg"
                    titleImgAlt="search"
                  />
                </Holds>
                <Holds className="w-[80%]">
                  <Inputs
                    type="search"
                    placeholder={t("TimeSheetsSearchPlaceholder")}
                    value={term}
                    onChange={handleSearchChange}
                    className="border-none outline-none"
                  />
                </Holds>
              </Holds>
              <Holds className="h-full mb-4 overflow-y-auto no-scrollbar ">
                <Holds>
                  {filteredList.length > 0 ? (
                    filteredList.map((employee) => (
                      <Holds
                        key={employee.id}
                        className="py-2 border-b"
                        onClick={() => selectEmployee(employee)}
                      >
                        <Texts position={"left"} size="p6" className="pl-4">
                          {employee.firstName} {employee.lastName}
                        </Texts>
                      </Holds>
                    ))
                  ) : (
                    <Texts size="p6" className="text-center">
                      {t("NoEmployeesFound")}
                    </Texts>
                  )}
                </Holds>
              </Holds>
            </>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
};
