"use client";
import "@/app/globals.css";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { InjuryReportContent } from "./injuryReportContent";
export default function InjuryReport() {
  return (
    <div className=" h-screen block m-auto">
      <div className="bg-app-dark-blue h-auto  flex flex-col items-center rounded-t-2xl">
        <TitleBoxes
          title="My Team"
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
        <div className=" mt-5 bg-white h-full w-11/12 flex justify-center items-center rounded-2xl overflow-y-auto">
          <InjuryReportContent />
        </div>
      </div>
    </div>
  );
}
