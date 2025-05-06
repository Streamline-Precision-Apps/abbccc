"use client";
import { useTranslations } from "next-intl";
import { breakOutTimeSheet, updateTimeSheet } from "@/actions/timeSheetActions";
import { setCurrentPageView } from "@/actions/cookieActions";
import { useRouter } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { form } from "@nextui-org/theme";
import { auth } from "@/auth";

export default function Comment({
  handleClick,
  setCommentsValue,
  commentsValue,
  checked,
  handleCheckboxChange,
  setLoading,
}: {
  commentsValue: string;
  handleClick: () => void;
  clockInRole: string | undefined;
  setCommentsValue: React.Dispatch<React.SetStateAction<string>>;
  checked: boolean;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const c = useTranslations("Clock");
  const router = useRouter();
  const returnRoute = () => {
    window.history.back();
  };

  const processOne = async () => {
    try {
      // Step 1: Get the recent timecard ID.
      const response = await fetch("/api/getRecentTimecard");
      const tsId = await response.json();
      const timeSheetId = tsId.id;

      if (!timeSheetId) {
        alert("No valid TimeSheet ID was found. Please try again later.");
        return;
      }
      const formData2 = new FormData();

      formData2.append("id", timeSheetId);
      formData2.append("endTime", new Date().toISOString());
      formData2.append("timesheetComments", commentsValue);

      const isUpdated = await breakOutTimeSheet(formData2);
      if (isUpdated) {
        setCurrentPageView("break");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Holds background={"white"} className="h-full w-full">
      <Grids rows={"8"} gap={"5"}>
        <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
          <Grids rows={"1"} cols={"5"} gap={"3"} className=" h-full w-full">
            <Holds
              className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
              onClick={returnRoute}
            >
              <Images
                titleImg="/turnBack.svg"
                titleImgAlt="back"
                position={"left"}
              />
            </Holds>
          </Grids>
        </Holds>

        <Holds className="row-start-2 row-end-4 h-full w-full justify-center relative">
          <Holds className="h-full w-[90%] relative">
            <Labels size={"p4"} htmlFor="comment">
              {c("PreviousJobComment")}
            </Labels>
            <TextAreas
              value={commentsValue}
              onChange={(e) => {
                setCommentsValue(e.target.value);
              }}
              placeholder={c("TodayIDidTheFollowing")}
              className="w-full h-full"
              maxLength={40}
              style={{ resize: "none" }}
            />

            <Texts
              size={"p2"}
              className={`${
                commentsValue.length >= 40
                  ? "text-red-500 absolute bottom-5 right-2"
                  : "absolute bottom-5 right-2"
              }`}
            >
              {commentsValue.length}/40
            </Texts>
          </Holds>
        </Holds>
        <CheckBox
          checked={checked}
          id="end-day"
          name="end-day"
          label={c("EndWorkDay")}
          size={2}
          onChange={handleCheckboxChange}
        />
        <Holds position={"row"} className="row-start-8 row-end-9 h-full ">
          <Buttons
            background={commentsValue.length < 3 ? "darkGray" : "orange"}
            onClick={checked ? handleClick : processOne}
            disabled={commentsValue.length < 3}
            className="w-full h-full py-3"
          >
            <Titles size={"h2"}>
              {checked ? c("Continue") : c("StartBreak")}
            </Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
