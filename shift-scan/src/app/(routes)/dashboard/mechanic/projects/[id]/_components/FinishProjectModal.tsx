"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { NModals } from "@/components/(reusable)/newmodals";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";

export default function FinishProjectModal({
  isOpen,
  onClose,
  title,
  laborHours,
  onSubmit,
  setSolution,
  solution,
  diagnosedProblem,
  setDiagnosedProblem,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  laborHours: string;
  onSubmit: () => void;
  setSolution: Dispatch<SetStateAction<string>>;
  solution: string;
  diagnosedProblem: string;
  setDiagnosedProblem: Dispatch<SetStateAction<string>>;
}) {
  const t = useTranslations("MechanicWidget");

  return (
    <NModals
      isOpen={isOpen}
      handleClose={onClose}
      size="screen"
      background="takeABreak"
    >
      <Holds background="white" className="w-full h-full py-2">
        <Grids rows="8" gap="5">
          {/* Modal Header */}
          <Holds className="row-span-1 h-full justify-center">
            <TitleBoxes
              title={title.slice(0, 20) + "..."}
              titleImg="/mechanic.svg"
              titleImgAlt={t("Mechanic")}
              onClick={onClose}
              type="noIcon-NoHref"
            />
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full">
            <Contents width="section">
              <Holds className="py-1">
                <Labels size="p3">{t("DiagnosedProblem")}</Labels>
                <TextAreas
                  value={diagnosedProblem}
                  onChange={(e) => setDiagnosedProblem(e.target.value)}
                  rows={3}
                />
              </Holds>
              <Holds className="py-1 relative">
                <Labels size="p3">{t("Solution")}</Labels>
                <TextAreas
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={3}
                  maxLength={40}
                />
                <Texts
                  size="p4"
                  className={`absolute bottom-5 right-3 ${
                    solution.length >= 40 ? "text-red-500" : ""
                  }`}
                >
                  {`${solution.length}/40`}
                </Texts>
              </Holds>
              <Holds className="py-1">
                <Labels size="p3">{t("TotalLaborHours")}</Labels>
                <Inputs
                  type="text"
                  placeholder={t("TotalLaborHoursPlaceholder")}
                  value={laborHours}
                  disabled
                  className="py-2"
                />
              </Holds>
            </Contents>
          </Holds>
          <Holds className="row-start-8 row-end-9">
            <Contents width="section">
              <Buttons onClick={onSubmit} background="green" className="py-3">
                <Titles>{t("SubmitProject")}</Titles>
              </Buttons>
            </Contents>
          </Holds>
        </Grids>
      </Holds>
    </NModals>
  );
}
