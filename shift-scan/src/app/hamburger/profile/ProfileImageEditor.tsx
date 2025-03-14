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

export default function ProfileImageEditor({
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
        <Images titleImg="/camera.svg" titleImgAlt="camera" />
      </Holds>

      {/* Modal for Image Editing */}
      <NModals
        size={"screen"}
        background={"white"}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      >
        {!editImg ? (
          <Holds background={"white"} className="p-5 h-full">
            <Contents width={"section"} className="h-full w-full">
              <Grids rows={"10"} className="h-full w-full">
                <Holds className="row-start-1 row-end-2 h-full w-full">
                  <Grids
                    rows={"2"}
                    cols={"6"}
                    gap={"3"}
                    className="h-full w-full"
                  >
                    <Holds className="col-start-1 col-end-2 row-span-1 h-full w-full">
                      <Images
                        titleImg="/turnBack.svg"
                        titleImgAlt="back"
                        onClick={() => setIsOpen(false)}
                      />
                    </Holds>
                    <Holds className="row-start-2 row-end-3 col-start-1 col-end-7 w-full">
                      <Titles size={"h1"}>Change Profile Picture</Titles>
                    </Holds>
                  </Grids>
                </Holds>

                <Holds className="row-start-3 row-end-9 h-full w-full justify-center items-center">
                  <img
                    src={employee?.image || "/profile.svg"}
                    alt="Profile"
                    className="w-full  object-cover rounded-full border-[3px] border-black"
                  />
                </Holds>
                <Holds className="row-start-10 row-end-11 h-full w-full">
                  <Buttons onClick={() => setEditImg(true)}>
                    <Texts>Change Profile Picture</Texts>
                  </Buttons>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        ) : (
          <Holds size={"full"} background={"white"} className="my-5">
            <Base64Encoder
              base64String={base64String}
              setBase64String={setBase64String}
              setIsOpen={setEditImg}
              employee={employee}
              reloadEmployeeData={reloadEmployee}
            />
          </Holds>
        )}
      </NModals>
    </Holds>
  );
}
