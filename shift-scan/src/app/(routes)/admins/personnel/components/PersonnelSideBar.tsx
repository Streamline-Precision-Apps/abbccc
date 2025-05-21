import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Spinner } from "@nextui-org/react";
import { view } from "framer-motion";
import { BaseUser, PersonnelView, UserEditState } from "./types/personnel";
import { SearchCrew } from "@/lib/types";
import { Dispatch, SetStateAction, use } from "react";
import { useTranslations } from "next-intl";

export default function PersonnelSideBar({
  view,
  setView,
  crew,
  loading,
  term,
  setTerm,
  handleSearchChange,
  filteredList,
  userEditStates,
}: {
  view: PersonnelView;
  setView: (view: PersonnelView) => void;
  crew: SearchCrew[];
  loading: boolean;
  term: string;
  setTerm: Dispatch<SetStateAction<string>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredList: BaseUser[];
  userEditStates: Record<string, UserEditState>;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds className="w-full h-full col-start-1 col-end-3">
      <Grids className="w-full h-full grid-rows-[40px_40px_1fr] gap-2">
        <Holds className="w-full h-full">
          <Selects
            onChange={(e) => {
              const crewId = e.target.value;
              if (crewId) {
                if (view.mode === "user" && "userId" in view) {
                  setView({
                    mode: "user+crew",
                    userId: view.userId,
                    crewId,
                  });
                } else {
                  setView({ mode: "crew", crewId });
                }
              } else {
                setView({ mode: "default" });
              }
            }}
            value={
              view.mode === "crew"
                ? view.crewId
                : view.mode === "user+crew"
                ? view.crewId
                : ""
            }
            className="w-full text-center text-base h-full border-2 "
          >
            <option value="">Select a Crew</option>
            {crew.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Selects>
        </Holds>
        <Holds background={"white"} position={"row"} className="w-full h-full ">
          <Holds size={"10"}>
            <Images titleImg="/searchLeft.svg" titleImgAlt="search" />
          </Holds>
          <Inputs
            type="search"
            placeholder={t("PersonalSearchPlaceholder")}
            value={term}
            onChange={handleSearchChange}
            className="border-none outline-none text-sm text-left w-full h-full rounded-md bg-white"
          />
        </Holds>

        <Holds
          background={"white"}
          className="w-full h-full overflow-y-auto no-scrollbar"
        >
          {loading ? (
            <Holds className="flex justify-center items-center w-full h-full">
              <Spinner />
            </Holds>
          ) : (
            <div className="w-full h-full flex flex-col p-3 space-y-2">
              {filteredList.map((employee) => {
                // Highlight logic for all user-related modes
                const isSelected =
                  (view.mode === "user" && view.userId === employee.id) ||
                  (view.mode === "user+crew" && view.userId === employee.id) ||
                  (view.mode === "registerCrew+user" &&
                    view.userId === employee.id);

                const hasUnsavedChanges =
                  userEditStates &&
                  userEditStates[employee.id] &&
                  !userEditStates[employee.id].successfullyUpdated &&
                  JSON.stringify(userEditStates[employee.id].user) !==
                    JSON.stringify(userEditStates[employee.id].originalUser);

                return (
                  <Holds
                    key={employee.id}
                    onClick={() => {
                      if (view.mode === "crew" && "crewId" in view) {
                        setView({
                          mode: "user+crew",
                          userId: employee.id,
                          crewId: view.crewId,
                        });
                      } else if (
                        (view.mode === "user" && view.userId === employee.id) ||
                        (view.mode === "registerCrew+user" &&
                          view.userId === employee.id)
                      ) {
                        setView({ mode: "default" });
                      } else {
                        setView({ mode: "user", userId: employee.id });
                      }
                    }}
                    className={`p-1 pl-2 flex-shrink-0 hover:bg-gray-100 relative ${
                      isSelected
                        ? "border-[3px] border-black"
                        : hasUnsavedChanges
                        ? "border-[3px] border-app-orange"
                        : ""
                    }  rounded-[10px]`}
                  >
                    <Texts position={"left"} size={"p7"}>
                      {`${employee.firstName} ${employee.lastName}`}
                    </Texts>

                    {hasUnsavedChanges && (
                      <Holds className="absolute top-1/2 right-1 transform -translate-y-1/2  w-6 h-6 rounded-full">
                        <img src="/statusOngoingFilled.svg" alt="edit icon" />
                      </Holds>
                    )}
                  </Holds>
                );
              })}
            </div>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
