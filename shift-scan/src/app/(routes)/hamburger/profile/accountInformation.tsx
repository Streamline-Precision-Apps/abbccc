import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { EditableFields } from "@/components/(reusable)/EditableField";
import Signature from "@/app/(routes)/dashboard/clock-out/(components)/injury-verification/Signature";
import { NModals } from "@/components/(reusable)/newmodals";
import SignOutModal from "@/app/(routes)/admins/_pages/sidebar/SignOutModal";
import { Dispatch, SetStateAction, useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  signature?: string | null;
  image: string | null;
  imageUrl?: string | null;
  Contact: {
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactNumber: string;
  };
};

export default function AccountInformation({
  employee,
  signatureBase64String,
  setSignatureBase64String,
}: {
  employee?: Employee;
  signatureBase64String: string;
  setSignatureBase64String: Dispatch<SetStateAction<string>>;
}) {
  const t = useTranslations("Hamburger");
  const [isOpen2, setIsOpen2] = useState(false);
  const [editSignatureModalOpen, setEditSignatureModalOpen] = useState(false);

  return (
    <Grids rows={"7"} className="w-full h-full">
      <Holds className="w-full h-full row-start-1 row-end-7 ">
        <Contents width={"section"}>
          <Holds className="">
            <Labels size={"p6"}>{t("PhoneNumber")}</Labels>
            <EditableFields
              value={employee?.Contact?.phoneNumber || ""}
              isChanged={false}
              onChange={() => {}}
            />
          </Holds>
          <Holds>
            <Labels size={"p6"}>{t("Email")}</Labels>
            <EditableFields
              value={employee?.email || ""}
              isChanged={false}
              onChange={() => {}}
            />
          </Holds>
          <Holds>
            <Labels size={"p6"}>{t("EmergencyContactName")}</Labels>
            <EditableFields
              value={employee?.Contact?.emergencyContact || ""}
              isChanged={false}
              onChange={() => {}}
            />
          </Holds>
          <Holds>
            <Labels size={"p6"}>{t("EmergencyContact")}</Labels>
            <EditableFields
              value={employee?.Contact?.emergencyContactNumber || ""}
              isChanged={false}
              onChange={() => {}}
            />
          </Holds>
          <Holds className="w-full h-full py-5 ">
            <Holds className="w-full h-fit rounded-[10px] border-[3px] border-black justify-center items-center relative ">
              <Images
                titleImg={signatureBase64String}
                titleImgAlt={t("Signature")}
                className="justify-center items-center "
                size={"50"}
              />
              <Holds
                background={"orange"}
                className="absolute top-1 right-1 w-fit h-fit rounded-full border-[3px] border-black p-2"
                onClick={() => setEditSignatureModalOpen(true)}
              >
                <Images
                  titleImg="/edit-form.svg"
                  titleImgAlt={"Edit"}
                  className="max-w-5 h-auto object-contain"
                />
              </Holds>
            </Holds>
          </Holds>
        </Contents>
      </Holds>

      <Holds className="row-start-7 row-end-8 ">
        <Contents width="section">
          <Buttons
            onClick={() => setIsOpen2(true)}
            background={"red"}
            size={"full"}
            className="py-2"
          >
            <Titles size={"h4"}>{t("SignOut")}</Titles>
          </Buttons>
        </Contents>
      </Holds>

      <NModals
        handleClose={() => setEditSignatureModalOpen(false)}
        size={"xlWS"}
        isOpen={editSignatureModalOpen}
      >
        <Holds className="w-full h-full justify-center items-center">
          <Signature
            setBase64String={setSignatureBase64String}
            closeModal={() => setEditSignatureModalOpen(false)}
          />
        </Holds>
      </NModals>

      <NModals
        size={"xlWS"}
        isOpen={isOpen2}
        handleClose={() => setIsOpen2(false)}
      >
        <SignOutModal setIsOpenSignOut={() => setIsOpen2(false)} />
      </NModals>
    </Grids>
  );
}
