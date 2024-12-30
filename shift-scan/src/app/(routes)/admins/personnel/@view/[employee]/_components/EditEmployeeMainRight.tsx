"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { UserProfile, EmployeeContactInfo } from "@/lib/types";
import { Permission } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

export function EditEmployeeMainRight({
  editedData,
  setEditedData,
  formRef,
  user,
  userId,
  permission,
}: {
  initialEmployeeProfile: UserProfile | null;
  setRenderedData: Dispatch<SetStateAction<UserProfile | null>>;
  initialEmployeeContactInfo: EmployeeContactInfo | null;
  editedData: UserProfile | null;
  editedData1: EmployeeContactInfo | null;
  setEditedData: Dispatch<SetStateAction<UserProfile | null>>;
  setEditedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  formRef: React.RefObject<HTMLFormElement>;
  user: string;
  setRenderedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  userId: string | undefined;
  signatureBase64String: string;
  setPersonalSignature: Dispatch<SetStateAction<boolean>>;
  reloadEmployeeData: () => void;
  reloadSignature: () => void;
  permission: string | undefined;
}) {
  const [restrictions, setRestrictions] = useState<boolean>(false);
  const t = useTranslations("Admins");
  // Handle changes in form inputs

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

  return (
    <Holds
      background={"white"}
      className="col-span-2 my-auto h-full w-full px-2 overflow-hidden overflow-y-auto no-scrollbar"
    >
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="w-full h-full my-10"
      >
        {/* This section is for the permission level to display, the user will be able to change the permission level differently based on roles*/}
        {/*Super admin can change the permission level of anyone */}
        <Holds>
          <Labels size={"p4"}>{t("PermissionLevel")}</Labels>
          <Selects
            value={editedData?.permission || "USER"} // Default to "USER" if no value
            onChange={(e) =>
              setEditedData((prevData) =>
                prevData
                  ? {
                      ...prevData,
                      permission: e.target.value as Permission, // Ensure it's a valid value
                    }
                  : null
              )
            }
            className="h-[50px]"
            name="permission"
            disabled={restrictions}
          >
            <Options value="SUPERADMIN">Super Admin</Options>
            <Options value="ADMIN">Admin</Options>
            <Options value="MANAGER">Manager</Options>
            <Options value="USER">User</Options>
          </Selects>
        </Holds>

        {/* Individual views with separate state bindings */}
        <Labels size={"p4"}>{t("TruckView")}</Labels>
        <Selects
          name="truckView"
          className="h-[50px]"
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

        <Labels size={"p4"}>{t("TascoView")}</Labels>
        <Selects
          name="tascoView"
          className="h-[50px]"
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

        <Labels size={"p4"}>{t("LaborView")}</Labels>
        <Selects
          name="laborView"
          className="h-[50px]"
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

        <Labels size={"p4"}>{t("MechanicView")}</Labels>
        <Selects
          name="mechanicView"
          className="h-[50px]"
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
}
