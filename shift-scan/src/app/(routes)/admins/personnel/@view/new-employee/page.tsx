"use client";
import { adminCreateUser } from "@/actions/userActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { hash } from "bcryptjs";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { z } from "zod";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  DOB: z.string(),
  phoneNumber: z.string().optional(),
  permission: z.string(),
});

export default function NewEmployee() {
  const t = useTranslations("Admins");
  const { data: session } = useSession();
  const permission = session?.user.permission;
  const CreateFormRef = useRef<HTMLFormElement>(null);
  const { setNotification } = useNotification();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Convert FormData to a plain object
    const plainData: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    );

    // Validate data using Zod schema
    const result = employeeSchema.safeParse(plainData);
    if (!result.success) {
      console.error(`${t("ValidationFailed")}`, result.error.errors);
      return;
    }

    // Create a validated FormData object
    const validatedData = new FormData();
    Object.entries(result.data).forEach(([key, value]) => {
      validatedData.append(key, value.toString());
    });

    // Additional processing for password and username
    try {
      const password = result.data.password;
      const hashedPassword = await hash(password, 10);
      validatedData.set("password", hashedPassword);

      const random = Math.floor(Math.random() * 100) + 1; // Generate random username suffix
      const userName = `${result.data.firstName}${result.data.lastName}${random}`;
      validatedData.set("username", userName);

      // Call the server action
      await adminCreateUser(validatedData);
      setNotification(t("EmployeeCreatedSuccessfully"), "success");
      // Redirect on success
      if (CreateFormRef.current) {
        CreateFormRef.current.reset();
      }
    } catch (error) {
      console.error(t("FailedToCreateEmployee"), error);
      setNotification(t("FailedToCreateEmployee"), "error");
    }
  };

  return (
    <Holds className="w-full h-full">
      <form
        ref={CreateFormRef}
        onSubmit={handleSubmit}
        className="w-full h-full"
      >
        <Grids rows="10" gap="5">
          <Holds className="row-span-2 w-full h-full">
            <Grids rows="3" cols="8" className="w-full h-full my-2 ">
              <Holds
                position="left"
                className="row-start-1 row-end-2 col-start-1 col-end-3 h-full cursor-pointer"
              >
                <Images
                  titleImg={"/person.svg"}
                  titleImgAlt="personnel"
                  className="rounded-full my-auto p-4"
                  size="70"
                />
              </Holds>

              <Holds className="row-start-2 row-end-3 col-start-3 col-end-5 h-full">
                <Titles size="h2" position="left">
                  {t("NewEmployee")}
                </Titles>
              </Holds>

              <Holds className="row-start-1 row-end-2  col-start-7 col-end-9 my-auto pr-4">
                <Buttons background="green" type="submit" className="p-1">
                  <Titles size="h4">{t("CreateEmployee")}</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Holds>

          <Holds className="row-span-8 w-full h-full">
            <Grids rows={"1"} className="w-full h-full p-5 ">
              <Holds position="row" className="w-full h-full row-span-1 ">
                <Holds className="w-2/3 h-full ">
                  <Inputs
                    className="h-10"
                    type="hidden"
                    name="image"
                    value=""
                  />
                  <Titles size={"h3"}>{t("EmployeeInformation")}</Titles>
                  <Holds className="w-full flex-wrap h-full   ">
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("FirstName")} <span className="text-red-500">*</span>
                      </Labels>
                      <Inputs
                        className="h-10"
                        type="text"
                        name="firstName"
                        required
                      />
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("LastName")} <span className="text-red-500">*</span>
                      </Labels>
                      <Inputs
                        className="h-10"
                        type="text"
                        name="lastName"
                        required
                      />
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>{t("Username")}</Labels>
                      <Inputs
                        className="h-10"
                        type="text"
                        name="username"
                        disabled
                      />
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("Email")} <span className="text-red-500">*</span>
                      </Labels>
                      <Inputs
                        className="h-10"
                        type="text"
                        name="email"
                        required
                      />
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("DateOfBirth")}{" "}
                        <span className="text-red-500">*</span>
                      </Labels>
                      <Inputs
                        className="h-10"
                        type="date"
                        name="DOB"
                        required
                      />
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("PhoneNumber")}{" "}
                        <span className="text-red-500">*</span>
                      </Labels>
                      <Inputs
                        className="h-10"
                        type="tel"
                        name="phoneNumber"
                        required
                      />
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("EmergencyContact")}
                        <Inputs
                          className="h-10"
                          type="text"
                          name="emergencyContact"
                        />
                      </Labels>
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("EmergencyContactNumber")}
                        <Inputs
                          className="h-10"
                          type="tel"
                          name="emergencyContactNumber"
                        />
                      </Labels>
                    </Holds>
                    <Holds className="w-[45%] px-2">
                      <Labels size={"p6"}>
                        {t("TemporaryPassword")}
                        <span className="text-red-500">*</span>
                        <Inputs
                          className="h-10"
                          type="text"
                          name="password"
                          required
                        />
                      </Labels>
                    </Holds>
                  </Holds>
                </Holds>

                <Holds className="w-[2px] h-full bg-black mx-5 border-none"></Holds>
                {/* This section is for the permission level to display, the user will be able to change the permission level differently based on roles*/}
                {/*Super admin can change the permission level of anyone */}
                <Grids className="w-1/3 h-full">
                  <Titles size={"h3"}>{t("EmployeePermissions")}</Titles>
                  {permission === "SUPERADMIN" ? (
                    <Holds className="w-full h-full">
                      <Labels size={"p6"}>
                        {t("PermissionLevel")}{" "}
                        <span className="text-red-500">*</span>
                      </Labels>
                      <Selects className="" name="permission">
                        <option value="SUPERADMIN">{t("SuperAdmin")}</option>
                        <option value="ADMIN">{t("Admin")}</option>
                        <option value="MANAGER">{t("Manager")}</option>
                        <option value="USER">{t("User")}</option>
                      </Selects>
                    </Holds>
                  ) : (
                    //the other cannt change the permission level
                    <Holds className="w-full h-full">
                      <Labels size={"p6"}>
                        {t("PermissionLevel")}{" "}
                        <span className="text-red-500">*</span>
                      </Labels>
                      <Selects name="permission">
                        <option value="SUPERADMIN">{t("SuperAdmin")}</option>
                        <option value="ADMIN">{t("Admin")}</option>
                        <option value="MANAGER">{t("Manager")}</option>
                        <option value="USER"> {t("User")}</option>
                      </Selects>
                    </Holds>
                  )}
                  <Holds className="w-full h-full">
                    <Labels size={"p6"}>
                      {t("TruckView")} <span className="text-red-500">*</span>
                    </Labels>
                    <Selects name="truckView">
                      <option value="false">{t("False")}</option>
                      <option value="true">{t("True")}</option>
                    </Selects>
                  </Holds>
                  <Holds className="w-full h-full">
                    <Labels size={"p6"}>
                      {t("TascoView")} <span className="text-red-500">*</span>
                    </Labels>
                    <Selects name="tascoView">
                      <option value="false">{t("False")}</option>
                      <option value="true">{t("True")}</option>
                    </Selects>
                  </Holds>
                  <Holds className="w-full h-full">
                    <Labels size={"p6"}>
                      {t("LaborView")} <span className="text-red-500">*</span>
                    </Labels>
                    <Selects name="laborView">
                      <option value="false">{t("False")}</option>
                      <option value="true">{t("True")}</option>
                    </Selects>
                  </Holds>
                  <Labels size={"p6"}>
                    {t("MechanicView")} <span className="text-red-500">*</span>
                  </Labels>
                  <Selects name="mechanicView">
                    <option value="false">{t("False")}</option>
                    <option value="true">{t("True")}</option>
                  </Selects>
                </Grids>
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      </form>
    </Holds>
  );
}
