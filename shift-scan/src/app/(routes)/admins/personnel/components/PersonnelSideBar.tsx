"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Spinner } from "@nextui-org/react";
import { BaseUser, PersonnelView, UserEditState } from "./types/personnel";
import { SearchCrew } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { NModals } from "@/components/(reusable)/newmodals";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";

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
  isUserEditStateDirty,
  discardUserEditChanges,
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
  isUserEditStateDirty: (userId: string) => boolean;
  discardUserEditChanges: (userId: string) => void;
}) {
  const t = useTranslations("Admins");
  const [nextView, setNextView] = useState<PersonnelView | null>(null);
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] =
    useState(false);

  const activeChanges =
    view.mode === "user" && isUserEditStateDirty(view.userId);

  const handleEmployeeClick = (employee: BaseUser) => {
    const targetView: PersonnelView =
      view.mode === "crew"
        ? { mode: "user+crew", userId: employee.id, crewId: view.crewId }
        : { mode: "user", userId: employee.id };

    const isSameUser = view.mode === "user" && view.userId === employee.id;

    if (activeChanges && !isSameUser) {
      setNextView(targetView);
      setIsDiscardChangesModalOpen(true);
    } else {
      setView(isSameUser ? { mode: "default" } : targetView);
    }
  };

  const confirmDiscardChanges = () => {
    if (nextView && view.mode === "user") {
      discardUserEditChanges(view.userId); // <-- discard context state
      setView(nextView);
      setNextView(null);
      setIsDiscardChangesModalOpen(false);
    }
  };

  const cancelDiscard = () => {
    setIsDiscardChangesModalOpen(false);
    setNextView(null);
  };

  return (
    <>
      <Holds className="w-full h-full col-start-1 col-end-3">
        <Grids className="w-full h-full grid-rows-[40px_40px_1fr] gap-4">
          <Holds className="w-full h-full">
            <Selects
              onChange={(e) => {
                const crewId = e.target.value;
                if (crewId) {
                  if (view.mode === "user") {
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
                view.mode === "crew" || view.mode === "user+crew"
                  ? view.crewId
                  : ""
              }
              className="w-full text-center text-base h-full border-2"
            >
              <option value="">Select a Crew</option>
              {crew.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Selects>
          </Holds>

          <Holds background="white" position="row" className="w-full h-full">
            <Holds size="10">
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
            background="white"
            className="w-full h-full overflow-y-auto no-scrollbar"
          >
            {loading ? (
              <Holds className="flex justify-center items-center w-full h-full">
                <Spinner />
              </Holds>
            ) : (
              <div className="w-full h-full flex flex-col p-3 space-y-2">
                {filteredList.map((employee) => {
                  const isSelected =
                    (view.mode === "user" && view.userId === employee.id) ||
                    (view.mode === "user+crew" &&
                      view.userId === employee.id) ||
                    (view.mode === "registerCrew+user" &&
                      view.userId === employee.id);

                  const hasUnsavedChanges =
                    userEditStates[employee.id] &&
                    !userEditStates[employee.id].successfullyUpdated &&
                    JSON.stringify(userEditStates[employee.id].user) !==
                      JSON.stringify(userEditStates[employee.id].originalUser);

                  return (
                    <Holds
                      key={employee.id}
                      onClick={() => handleEmployeeClick(employee)}
                      className={`p-1 pl-2 flex-shrink-0 hover:bg-gray-100 relative ${
                        isSelected
                          ? "border-[3px] border-black"
                          : hasUnsavedChanges
                          ? "border-[3px] border-app-orange"
                          : ""
                      } rounded-[10px]`}
                    >
                      <Texts position="left" size="p7">
                        {`${employee.firstName} ${employee.lastName}`}
                      </Texts>

                      {hasUnsavedChanges && (
                        <Holds className="absolute top-1/2 right-1 transform -translate-y-1/2 w-6 h-6 rounded-full">
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

      <NModals
        isOpen={isDiscardChangesModalOpen}
        handleClose={cancelDiscard}
        size="sm"
        background={"noOpacity"}
      >
        <Holds className="w-full h-full items-center justify-center text-center pt-3">
          <Contents width={"section"} className="h-full">
            <Holds className="flex  h-1/2">
              <Texts size="p5">
                You have unsaved changes. Are you sure you want to discard them?
              </Texts>
            </Holds>
            <Holds className="flex justify-center items-center gap-4 h-1/2">
              <Buttons
                shadow={"none"}
                background={"lightBlue"}
                className="w-full p-2 "
                onClick={confirmDiscardChanges}
              >
                <Titles size="h5">Yes, continue.</Titles>
              </Buttons>
              <Buttons
                background={"red"}
                shadow={"none"}
                className=" w-full p-2"
                onClick={cancelDiscard}
              >
                <Titles size="h5">No, go back!</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>
    </>
  );
}
