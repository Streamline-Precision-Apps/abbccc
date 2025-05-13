"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import TimeCardApprover from "./_Components/TimeCardApprover";

export default function TimeCards() {
  const t = useTranslations("TimeCardSwiper");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Bases className="fixed w-full h-full">
      <Contents>
        <Grids
          rows={"7"}
          gap={"5"}
          className={`h-full pb-5 bg-white rounded-[10px] ${
            loading && "animate-pulse"
          }`}
        >
          <Holds className="row-span-1 h-full">
            <TitleBoxes onClick={() => router.push("/dashboard/myTeam")}>
              <Titles size={"h2"}>{t("ReviewYourTeam")}</Titles>
            </TitleBoxes>
          </Holds>

          <TimeCardApprover loading={loading} setLoading={setLoading} />
        </Grids>
      </Contents>
    </Bases>
  );
}
