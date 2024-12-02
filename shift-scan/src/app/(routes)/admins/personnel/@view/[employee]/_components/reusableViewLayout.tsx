"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type ReusableViewLayoutProps = {
  header?: ReactNode; // Custom header content
  mainLeft?: ReactNode; // Main section content
  main?: ReactNode;
  mainRight?: ReactNode; // Optional sidebar content
  footer?: ReactNode; // Footer content
  commentText?: string;
  editedItem?: string;
  editCommentFunction?: Dispatch<SetStateAction<string>>;
  editFunction?: Dispatch<SetStateAction<string>>;
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
}: ReusableViewLayoutProps) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const openComment = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

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
                        placeholder={"Enter your Crew Name"}
                        variant={"titleFont"}
                        className=" my-auto"
                      />
                    </Holds>
                    <Holds
                      position={"row"}
                      className="h-full w-full my-1 row-start-2 row-end-3 col-start-1 col-end-2 "
                    >
                      <Texts size={"p6"} className="mr-2">
                        {"Comment"}
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
                        placeholder="Enter your comment"
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
                      placeholder={"Enter your Crew Name"}
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
                      Comment
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
              <Texts size={"p6"}>
                Must specify either main, or both mainLeft and mainRight
              </Texts>
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
