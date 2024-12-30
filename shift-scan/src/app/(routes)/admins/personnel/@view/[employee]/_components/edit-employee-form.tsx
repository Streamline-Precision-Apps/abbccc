"use client";
import { editPersonnelInfo } from "@/actions/adminActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { EmployeeContactInfo, Permission, UserProfile } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  formRef: React.RefObject<HTMLFormElement>;
  user: string;
  userId: string | undefined;
  editedData: UserProfile | null;
  setEditedData: Dispatch<SetStateAction<UserProfile | null>>;
  editedData1: EmployeeContactInfo | null;
  setEditedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  initialEmployeeProfile: UserProfile | null;
  initialEmployeeContactInfo: EmployeeContactInfo | null;
  setRenderedData: Dispatch<SetStateAction<UserProfile | null>>;
  setRenderedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  permission: string | undefined;
  setPersonalSignature: Dispatch<SetStateAction<boolean>>;
  signatureBase64String: string;
};

export const EditEmployeeForm = ({
  formRef,
  user,
  editedData,
  setEditedData,
  editedData1,
  setRenderedData,
  setRenderedData1,
  userId,
  permission,
}: Props) => {
  const [restrictions, setRestrictions] = useState<boolean>(false);
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();
  // Handle changes in form inputs
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  // this is for the restrictions on what the user can do when they want to edit there own info
  useEffect(() => {
    if (userId === user && permission !== "SUPERADMIN") {
      setRestrictions(true);
    } else if (permission === "SUPERADMIN" || permission === "ADMIN") {
      setRestrictions(false);
    } else {
      setRestrictions(true);
    }
  }, [userId, user, permission]);

  const handleSubmitEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current!);
      console.log(formData);
      const res = await editPersonnelInfo(formData);
      if (res) {
        setNotification(`${t("EmployeeInfoUpdatedSuccessfully")}`, "success");
        setRenderedData(editedData);
        setRenderedData1(editedData1);
      } else {
        setNotification(`${t("FailedToUpdateEmployeeInfo")}`, "error");
      }
    } catch (error) {
      console.error(`${t("FailedToUpdateEmployeeInfo")}`, error);
      setNotification(`${t("FailedToUpdateEmployeeInfo")}`, "error");
    }
  };

  return (
    <Holds className="row-span-8 my-auto h-full p-3">
      <form
        ref={formRef}
        onSubmit={handleSubmitEdits}
        className="w-full h-full"
      >
        {/* This section is for the permission level to display, the user will be able to change the permission level differently based on roles*/}
        {/*Super admin can change the permission level of anyone */}
        <Holds>
          <Labels size={"p6"}>{t("PermissionLevel")}</Labels>
          {permission === "SUPERADMIN" || permission === "ADMIN" ? (
            <Selects
              value={editedData?.permission || "USER"} // Set default to "USER" if no value
              onChange={(e) =>
                setEditedData((prevData) =>
                  prevData
                    ? {
                        ...prevData,
                        permission: e.target.value as Permission,
                      }
                    : null
                )
              }
              className="h-14"
              name="permission"
              disabled={restrictions}
            >
              <Options
                value="SUPERADMIN"
                disabled={editedData?.permission === "SUPERADMIN"}
              >
                Super Admin
              </Options>
              <Options value="ADMIN">Admin</Options>
              <Options value="MANAGER">Manager</Options>
              <Options value="USER"> User</Options>
            </Selects>
          ) : (
            //the other cannot change the permission level
            <Selects
              value={editedData?.permission}
              onChange={handleInputChange}
              name="permission"
            >
              <Options value="SUPERADMIN">{t("SuperAdmin")}</Options>
              <Options value="ADMIN">{t("Admin")}</Options>
              <Options value="MANAGER">{t("Manager")}</Options>
              <Options value="USER">{t("User")}</Options>
            </Selects>
          )}
        </Holds>

        {/* Individual views with separate state bindings */}
        <Labels size={"p6"}>{t("TruckView")}</Labels>
        <Selects
          name="truckView"
          className="h-14"
          value={editedData?.truckView ? "true" : "false"}
          onChange={(e) =>
            setEditedData((prevData) =>
              prevData
                ? {
                    ...prevData,
                    truckView: e.target.value === "true", // Convert back to boolean
                  }
                : null
            )
          }
        >
          <Options value="true">{t("True")}</Options>
          <Options value="false">{t("False")}</Options>
        </Selects>

        <Labels size={"p6"}>{t("TascoView")}</Labels>
        <Selects
          name="tascoView"
          className="h-14"
          value={editedData?.tascoView ? "true" : "false"}
          onChange={(e) =>
            setEditedData((prevData) =>
              prevData
                ? {
                    ...prevData,
                    tascoView: e.target.value === "true",
                  }
                : null
            )
          }
        >
          <Options value="true">{t("True")}</Options>
          <Options value="false">{t("False")}</Options>
        </Selects>

        <Labels size={"p6"}>{t("LaborView")}</Labels>
        <Selects
          name="laborView"
          className="h-14"
          value={editedData?.laborView ? "true" : "false"}
          onChange={(e) =>
            setEditedData((prevData) =>
              prevData
                ? {
                    ...prevData,
                    laborView: e.target.value === "true",
                  }
                : null
            )
          }
        >
          <Options value="true">{t("True")}</Options>
          <Options value="false">{t("False")}</Options>
        </Selects>

        <Labels size={"p6"}>{t("MechanicView")}</Labels>
        <Selects
          name="mechanicView"
          className="h-14"
          value={editedData?.mechanicView ? "true" : "false"}
          onChange={(e) =>
            setEditedData((prevData) =>
              prevData
                ? {
                    ...prevData,
                    mechanicView: e.target.value === "true",
                  }
                : null
            )
          }
        >
          <Options value="true">{t("True")}</Options>
          <Options value="false">{t("False")}</Options>
        </Selects>
      </form>
    </Holds>
  );
};
