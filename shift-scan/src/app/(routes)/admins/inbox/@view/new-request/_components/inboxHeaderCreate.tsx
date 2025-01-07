"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LeaveRequest, SearchUser } from "@/lib/types";
import { NModals } from "@/components/(reusable)/newmodals";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";

export function RequestHeaderCreate({
  leaveRequest,
  setLeaveRequest,
  setUserModelOpen,
  userModalOpen,
}: {
  leaveRequest: LeaveRequest;
  setLeaveRequest: Dispatch<SetStateAction<LeaveRequest>>;
  setUserModelOpen: Dispatch<SetStateAction<boolean>>;
  userModalOpen: boolean;
}) {
  const t = useTranslations("Admins");
  const [employees, setEmployees] = useState<SearchUser[]>([]);
  const [term, setTerm] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [userPicture, setUserPicture] = useState<string>("");

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesRes = await fetch("/api/getAllEmployees?filter=all");
        const employeesData = await employeesRes.json();
        // const validatedEmployees = employeesSchema.parse(employeesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeesData")}`, error);
      }
    };

    fetchEmployees();
  }, [t]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectEmployee = (employee: SearchUser) => {
    setTerm(employee.firstName + " " + employee.lastName);
    setEmployeeId(employee.id);
    setFirstName(employee.firstName);
    setLastName(employee.lastName);
    setUserPicture(employee.image || "");
  };
  const confirmSelectedEmployee = () => {
    setLeaveRequest({
      ...leaveRequest,
      employee: {
        ...leaveRequest.employee,
        id: employeeId,
        firstName: firstName,
        lastName: lastName,
        image: userPicture,
      },
    });
  };

  return (
    <Holds
      background={"white"}
      className={`h-full w-full col-span-2 rounded-[10px] row-span-2
        }`}
    >
      <Grids cols={"10"} rows={"2"} gap={"5"} className="w-full h-full p-3 ">
        {/* Image for employee*/}
        <Holds className="row-start-1 row-end-3 col-start-1 col-end-3 w-full h-full ">
          <Images
            className={`w-full h-full rounded-full bg-cover bg-center ${
              leaveRequest.employee.image.length > 0
                ? "border-[3px] border-black"
                : ""
            }`}
            titleImg={
              leaveRequest.employee.image.length > 0
                ? leaveRequest.employee.image
                : "/person.svg"
            }
            titleImgAlt={"Employee Image"}
          />
        </Holds>
        {/* Input for employee name*/}
        <Holds
          position={"row"}
          className="row-start-1 row-end-3 col-start-3 col-end-8 "
        >
          <Grids
            cols={"5"}
            rows={"1"}
            gap={"2"}
            className="w-full h-1/2  border-[3px] border-black rounded-[10px]"
          >
            <Holds className="w-full h-full col-span-1">
              <Images
                className="w-full h-full rounded-full bg-cover bg-center"
                titleImg={"/magnifyingGlass.svg"}
                titleImgAlt={"Employee Image"}
                size={"50"}
              />
            </Holds>
            <Inputs
              type="text"
              placeholder={t("SelectEmployee")}
              value={
                leaveRequest.employee.firstName &&
                leaveRequest.employee.lastName
                  ? `${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName}`
                  : ""
              }
              readOnly={true}
              className="w-full h-full text-[22px] font-bold text-black border-none col-span-3 focus-visible:outline-none"
              onClick={() => setUserModelOpen(true)}
            />
            <Holds className="w-full h-full col-span-1">
              <Images
                className="w-full h-full rounded-full bg-cover bg-center"
                titleImg={"/x.svg"}
                titleImgAlt={"Employee Image"}
                size={"40"}
                onClick={() => {
                  console.log("click");
                  setLeaveRequest({
                    ...leaveRequest,
                    employee: {
                      ...leaveRequest.employee,
                      firstName: "",
                      lastName: "",
                      image: "",
                    },
                  });
                }}
              />
            </Holds>
          </Grids>
        </Holds>

        {/* Request status*/}
        <Holds className="row-start-1 row-end-3 col-start-9 col-end-11">
          <Selects
            name="status"
            value={leaveRequest.status}
            className={`${
              leaveRequest.status === "PENDING"
                ? "bg-app-orange"
                : leaveRequest.status === "APPROVED"
                ? "bg-app-green"
                : "bg-app-red"
            } w-full h-16 px-5 text-[20px] font-bold`}
          >
            <Options value="PENDING">{t("Pending")}</Options>
          </Selects>
        </Holds>
      </Grids>
      <NModals
        size={"medH"}
        background={"default"}
        isOpen={userModalOpen}
        handleClose={() => setUserModelOpen(false)}
      >
        <Grids rows={"10"} cols={"1"} gap={"5"}>
          <Holds>
            <Titles>{t("SelectEmployee")}</Titles>
          </Holds>
          <Holds className="row-start-2 row-end-9 h-full border-[3px] border-black rounded-t-[10px]">
            <>
              <Holds
                position={"row"}
                className="py-2 border-b-[3px] border-black"
              >
                <Holds className="h-full w-[20%]">
                  <Images
                    titleImg="/magnifyingGlass.svg"
                    titleImgAlt="search"
                  />
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
          </Holds>

          <Holds className="row-start-9 row-end-10 h-full">
            <Buttons
              background={"green"}
              className="w-full h-full rounded-b-[10px] text-black"
              onClick={() => {
                setUserModelOpen(false);
                confirmSelectedEmployee();
                setTerm("");
              }}
            >
              {t("Submit")}
            </Buttons>
          </Holds>
          <Holds className="row-start-10 row-end-11 h-full">
            <Buttons
              className="w-full h-full rounded-b-[10px] text-black"
              onClick={() => {
                setUserModelOpen(false);
                setTerm("");
              }}
            >
              {t("Cancel")}
            </Buttons>
          </Holds>
        </Grids>
      </NModals>
    </Holds>
  );
}
