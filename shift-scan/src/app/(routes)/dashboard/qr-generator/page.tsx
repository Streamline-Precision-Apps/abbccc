"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import QRGeneratorContent from "./content";

export default async function QrGeneratorDashboard() {
  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"}>
          <QRGeneratorContent />
        </Grids>
      </Contents>
    </Bases>
  );
}
