"use client";
import EmptyView from "@/app/(routes)/admins/_pages/EmptyView";
import Spinner from "@/components/(animations)/spinner";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type ReusableViewLayoutProps = {
  header?: ReactNode; // Custom header content
  mainLeft?: ReactNode; // Main section content
  main?: ReactNode;
  mainRight?: ReactNode; // Optional sidebar content
  mainHolds?: string; // used for main section grid really only required for left and right
  footer?: ReactNode; // Footer content
  commentText?: string;
  editedItem?: string;
  editCommentFunction?: Dispatch<SetStateAction<string>>;
  editFunction?: Dispatch<SetStateAction<string>>;
  custom?: boolean;
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | null | undefined;
};

export const ReusableViewLayout = ({
  header,
  main,
  mainLeft,
  mainRight,
  footer,
  commentText,
  editFunction,
  editCommentFunction,
  editedItem,
  custom,
  mainHolds,
  gap = "2",
}: ReusableViewLayoutProps) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("Admins");
  const openComment = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Holds className="w-full h-full">
        <EmptyView Children={<Spinner />} />
      </Holds>
    );
  }

  if (custom === true) {
    return (
      <Holds
        background={"darkBlue"}
        className="h-full w-full  border-[3px] border-black"
      >
        <Grids rows={"8"} cols={"2"} gap={gap} className="h-full w-full ">
          {/* Header Section */}

          {header}

          {main && <Holds className={mainHolds}>{main}</Holds>}
          {!main && mainLeft && mainRight && (
            <Holds className={mainHolds}>
              {mainLeft}
              {mainRight}
            </Holds>
          )}
          {!main && (!mainLeft || !mainRight) && (
            <Holds background={"white"} className="h-full w-full">
              <Texts size={"p6"}>{t("MustSpecify")}</Texts>
            </Holds>
          )}

          {/* Footer Section */}

          {footer}
        </Grids>
      </Holds>
    );
  }

  return (
    <Holds className="h-full w-full">
      <Grids rows={"12"} cols={"2"} className="h-full w-full ">
        {/* Header Section */}
        <Holds
          className={
            isCommentSectionOpen
              ? `row-span-4 col-span-2 h-full`
              : `row-span-1 col-span-2 h-full`
          }
        >
          {header || (
            <Holds position={"row"} className="h-full w-full">
              {isCommentSectionOpen ? (
                <Contents width={"95"} position={"row"}>
                  <Grids
                    rows={"5"}
                    cols={"5"}
                    gap={"2"}
                    className=" h-full w-full py-4"
                  >
                    <Holds className="w-full row-start-1 row-end-2 col-start-1 col-end-4">
                      <Inputs
                        type="text"
                        value={editedItem}
                        onChange={(e) => {
                          editFunction?.(e.target.value);
                        }}
                        placeholder={t("NewCrewName")}
                        variant={"titleFont"}
                        className=" my-auto"
                      />
                    </Holds>
                    <Holds
                      position={"row"}
                      className="h-full w-full my-1 row-start-2 row-end-3 col-start-1 col-end-2 "
                    >
                      <Texts size={"p6"} className="mr-2">
                        {t("Comment")}
                      </Texts>
                      <Images
                        titleImg="/comment.svg"
                        titleImgAlt="comment"
                        size={"30"}
                        onClick={openComment}
                        className="cursor-pointer hover:shadow-black hover:shadow-md"
                      />
                    </Holds>

                    <Holds className="w-full h-full row-start-3 row-end-6 col-start-1 col-end-6">
                      <TextAreas
                        placeholder={t("EnterYourComment")}
                        value={commentText ? commentText : ""}
                        onChange={(e) => {
                          editCommentFunction?.(e.target.value);
                        }}
                        maxLength={40}
                        rows={4}
                        style={{ resize: "none" }}
                      />
                    </Holds>
                  </Grids>
                </Contents>
              ) : (
                <Grids rows={"2"} cols={"5"} className=" h-full w-full p-4">
                  <Holds className="w-full row-start-1 row-end-3 col-start-1 col-end-4 ">
                    <Inputs
                      type="text"
                      value={editedItem}
                      placeholder={""}
                      onChange={(e) => {
                        editFunction?.(e.target.value);
                      }}
                      variant={"titleFont"}
                      className=" my-auto"
                    />
                  </Holds>
                  <Holds
                    position={"row"}
                    className="h-full w-full row-start-2 row-end-3 col-start-6 col-end-7 "
                  >
                    <Texts size={"p6"} className="mr-2">
                      {t("Comment")}
                    </Texts>
                    <Images
                      titleImg="/comment.svg"
                      titleImgAlt="comment"
                      size={"40"}
                      onClick={openComment}
                      className="cursor-pointer hover:shadow-black hover:shadow-md"
                    />
                  </Holds>
                </Grids>
              )}
            </Holds>
          )}
        </Holds>

        {/* Main Content Section */}
        <Holds
          position={"row"}
          background={"darkBlue"}
          className="row-span-10 col-span-2 h-full rounded-none w-full"
        >
          {main && (
            <Holds className="h-full w-full flex flex-col">{main}</Holds>
          )}
          {!main && mainLeft && mainRight && (
            <>
              {mainLeft}
              {mainRight}
            </>
          )}
          {!main && (!mainLeft || !mainRight) && (
            <Holds background={"white"} className="h-full w-full">
              <Texts size={"p6"}>{t("MustSpecify")}</Texts>
            </Holds>
          )}
        </Holds>

        {/* Footer Section */}
        <Holds className="row-span-1 col-span-2 h-full">
          {footer || <Texts size={"p6"}></Texts>}
        </Holds>
      </Grids>
    </Holds>
  );
};
