import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export default function ReviewYourTeam({
  handleClick,
  prevStep,
  loading,
  manager,
}: {
  loading: boolean;
  handleClick: () => void;
  prevStep: () => void;
  manager: boolean;
}) {
  const t = useTranslations("Clock");
  return (
    <Bases>
      <Contents>
        <Holds background={"white"} className="row-span-1 h-full">
          <Holds className="h-full w-full">
            <Grids rows={"8"} gap={"5"}>
              <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
                <TitleBoxes onClick={prevStep}>
                  <Holds className="h-full justify-end">
                    <Titles size={"h2"}>{t("ReviewYourTeam")}</Titles>
                  </Holds>
                </TitleBoxes>
              </Holds>
              <Holds className="row-start-2 row-end-9 h-full w-full "></Holds>
            </Grids>
          </Holds>
        </Holds>
      </Contents>
    </Bases>
  );
}
