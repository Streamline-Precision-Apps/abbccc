"use server";
import "@/app/globals.css";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

import { Contents } from "@/components/(reusable)/contents";
import { getTranslations } from "next-intl/server";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Tab } from "@/components/(reusable)/tab";
import QRGeneratorContent from "./content";
import { SearchUser } from "@/lib/types";

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
