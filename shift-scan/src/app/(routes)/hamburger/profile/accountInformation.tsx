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
import { updateSettings } from "@/actions/hamburgerActions";


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
  userId,
  reloadEmployee,
}: {
  employee?: Employee;
  signatureBase64String: string;
  setSignatureBase64String: Dispatch<SetStateAction<string>>;
  userId: string;
  reloadEmployee: () => Promise<void>;
}) {
  const t = useTranslations("Hamburger-Profile");

  const [isOpen2, setIsOpen2] = useState(false);
  const [editSignatureModalOpen, setEditSignatureModalOpen] = useState(false);
  const [editContactModalOpen, setEditContactModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    phoneNumber: employee?.Contact?.phoneNumber || '',
    email: employee?.email || '',
    emergencyContact: employee?.Contact?.emergencyContact || '',
    emergencyContactNumber: employee?.Contact?.emergencyContactNumber || '',
  });
  const [formLoading, setFormLoading] = useState(false);


  // Handlers for opening modal
  const openEditContactModal = () => {
    setFormState({
      phoneNumber: employee?.Contact?.phoneNumber || '',
      email: employee?.email || '',
      emergencyContact: employee?.Contact?.emergencyContact || '',
      emergencyContactNumber: employee?.Contact?.emergencyContactNumber || '',
    });
    setEditContactModalOpen(true);
  };

  // Save handler
  const handleSaveContact = async () => {
    setFormLoading(true);
    try {
      await updateSettings({
        userId,
        personalReminders: undefined,
        generalReminders: undefined,
        cameraAccess: undefined,
        locationAccess: undefined,
        language: undefined,
        phoneNumber: formState.phoneNumber,
        email: formState.email,
        emergencyContact: formState.emergencyContact,
        emergencyContactNumber: formState.emergencyContactNumber,
      } as any);
      await reloadEmployee();
      setEditContactModalOpen(false);
    } catch (err) {
      console.error('Failed to save contact info:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Discard handler
  const handleDiscardContact = () => {
    setEditContactModalOpen(false);
    setFormState({
      phoneNumber: employee?.Contact?.phoneNumber || '',
      email: employee?.email || '',
      emergencyContact: employee?.Contact?.emergencyContact || '',
      emergencyContactNumber: employee?.Contact?.emergencyContactNumber || '',
    });
  };

  return (
    <Grids rows={"7"} className="w-full h-full">
      <Holds className="w-full h-full row-start-1 row-end-7 ">
        <Contents width={"section"}>
          {/* Editable fields open modal on click */}
          <Holds className="cursor-pointer" onClick={openEditContactModal}>
            <Labels size={"p6"}>{t("PhoneNumber")}</Labels>
            <EditableFields
              value={employee?.Contact?.phoneNumber || ""}
              isChanged={false}
              onChange={() => {}}
            />
          </Holds>
          <Holds className="cursor-pointer" onClick={openEditContactModal}>
            <Labels size={"p6"}>{t("Email")}</Labels>
            <EditableFields
              value={employee?.email || ""}
              isChanged={false}
              onChange={() => {}}
            />
          </Holds>
          <Holds className="cursor-pointer" onClick={openEditContactModal}>
            <Labels size={"p6"}>{t("EmergencyContact")}</Labels>
            <EditableFields
              value={employee?.Contact?.emergencyContact || ""}
              isChanged={false}
              onChange={() => {}}
            />
          </Holds>
          <Holds className="cursor-pointer" onClick={openEditContactModal}>
            <Labels size={"p6"}>{t("EmergencyContactNumber")}</Labels>
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
                  titleImg="/formEdit.svg"
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

      {/* Modal for editing contact info */}
      <NModals
        handleClose={handleDiscardContact}
        size={"xlWS1"}
        isOpen={editContactModalOpen}
      >
        <Holds className="w-full h-full justify-center items-center">
          <Contents width="section">
            <Labels size={"p6"}>{t("PhoneNumber")}</Labels>
            <EditableFields
              value={formState.phoneNumber}
              isChanged={false}
              onChange={e => setFormState(s => ({ ...s, phoneNumber: e.target.value }))}
            />
            <Labels size={"p6"}>{t("Email")}</Labels>
            <EditableFields
              value={formState.email}
              isChanged={false}
              onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
            />
            <Labels size={"p6"}>{t("EmergencyContact")}</Labels>
            <EditableFields
              value={formState.emergencyContact}
              isChanged={false}
              onChange={e => setFormState(s => ({ ...s, emergencyContact: e.target.value }))}
            />
            <Labels size={"p6"}>{t("EmergencyContactNumber")}</Labels>
            <EditableFields
              value={formState.emergencyContactNumber}
              isChanged={false}
              onChange={e => setFormState(s => ({ ...s, emergencyContactNumber: e.target.value }))}
            />
            <Holds position="row" className="mt-4 gap-2">
              <Buttons background="green" onClick={handleSaveContact} disabled={formLoading}>
                {formLoading ? t("Saving") : t("Save")}
              </Buttons>
              <Buttons background="red" onClick={handleDiscardContact}>
                {t("Discard")}
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>

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
