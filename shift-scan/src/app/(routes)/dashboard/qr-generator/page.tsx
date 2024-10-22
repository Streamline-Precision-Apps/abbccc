"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Contents } from "@/components/(reusable)/contents";
import { getTranslations } from "next-intl/server";
import { Grids } from "@/components/(reusable)/grids";
import QRGeneratorContent from "./content";

export default async function QrGeneratorDashboard() {
  const q = await getTranslations("Generator");

  return (
    <Bases>
      <Contents>
        <Grids rows={"5"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={q("QrGenerator")}
                titleImg="/qr.svg"
                titleImgAlt="Team"
                className="my-auto"
              />
            </Contents>
          </Holds>
          <Holds className="row-span-4 h-full">
            <QRGeneratorContent />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
