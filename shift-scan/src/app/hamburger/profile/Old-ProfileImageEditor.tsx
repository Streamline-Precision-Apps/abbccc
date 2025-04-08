import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import Base64Encoder from "@/components/(camera)/Base64Encoder";
import { useState } from "react";
import { Employee } from "@/lib/types";
import { NModals } from "@/components/(reusable)/newmodals";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";

export default function OldsProfileImageEditor({
  employee,
  reloadEmployee,
  loading,
}: {
  employee?: Employee;
  reloadEmployee: () => Promise<void>;
  loading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [base64String, setBase64String] = useState<string>("");

  return (
    <Holds className="w-[90px] h-[90px]  relative ">
      {loading ? (
        <Images
          titleImg={"/person.svg"}
          titleImgAlt="image"
          onClick={() => setIsOpen(true)}
          className="w-full h-full  object-cover rounded-full "
        />
      ) : (
        <Images
          titleImg={employee?.image || "/profile.svg"}
          titleImgAlt="image"
          onClick={() => setIsOpen(true)}
          className="w-full h-full rounded-full object-cover border-black border-[3px]"
        />
      )}

      {/* Camera Icon */}
      <Holds className="absolute bottom-3 right-0 translate-x-1/4 translate-y-1/4 rounded-full h-9 w-9 border-[3px] p-1 justify-center items-center border-black bg-app-gray">
        <Images
          titleImg="/camera.svg"
          titleImgAlt="camera"
          onClick={() => setIsOpen(true)}
        />
      </Holds>

      {/* Modal for Image Editing */}
      <NModals
        size={"screen"}
        background={"takeABreak"}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      >
        <Holds background={"white"} className="p-5 h-full ">
          <Holds>
            <Images
              position={"left"}
              onClick={() => {
                setIsOpen(false);
                setEditImg(false);
              }}
              titleImg="/turnBack.svg"
              titleImgAlt="backArrow"
              className=" w-10 h-10"
            />
          </Holds>

          <Contents width={"section"} className="h-full w-full">
            <Grids rows={"10"} className="h-full w-full">
              <Holds className="row-start-1 row-end-2 col-start-1 col-end-7 w-full">
                <Titles size={"h4"}>Change Profile Picture</Titles>
              </Holds>

              <Holds className="row-start-2 row-end-6 h-full w-full justify-center items-center">
                <img
                  src={employee?.image || "/person.svg"}
                  alt="Profile"
                  className={`w-full object-cover rounded-full ${
                    employee?.image ? "border-[3px] border-black" : ""
                  }`}
                />
              </Holds>
              {!editImg ? (
                <Holds className="row-start-10 row-end-11 w-full">
                  <Buttons className="py-2" onClick={() => setEditImg(true)}>
                    <Titles size={"h4"}>Change Profile Picture</Titles>
                  </Buttons>
                </Holds>
              ) : (
                <>
                  <Holds className="row-start-7 row-end-11 w-full">
                    <Base64Encoder
                      base64String={base64String}
                      setBase64String={setBase64String}
                      setIsOpen={setEditImg}
                      employee={employee}
                      reloadEmployeeData={reloadEmployee}
                    />
                    <Buttons
                      background={"red"}
                      className="py-2"
                      onClick={() => setEditImg(false)}
                    >
                      <Titles size={"h4"}>Cancel</Titles>
                    </Buttons>
                  </Holds>
                </>
              )}
            </Grids>
          </Contents>
        </Holds>
      </NModals>
    </Holds>
  );
}
