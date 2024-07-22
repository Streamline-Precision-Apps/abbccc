"use client";
import "@/app/globals.css";
import { TitleBox } from "@/app/(routes)/dashboard/myTeam/titleBox";
import { InjuryReportContent } from "./injuryReportContent";
export default function InjuryReport() {
  return (
    <div className=" h-screen block m-auto">
      <div className="bg-app-dark-blue h-auto  flex flex-col items-center rounded-t-2xl">
        <TitleBox title="Injury Verification" />
        <div className=" mt-5 bg-white h-full w-11/12 flex justify-center items-center rounded-2xl overflow-y-auto">
          <InjuryReportContent />
        </div>
      </div>
    </div>
  );
}
