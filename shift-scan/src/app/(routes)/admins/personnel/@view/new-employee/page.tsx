"use client";
import { createUser } from "@/actions/userActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { hash } from "bcryptjs";
import { useSession } from "next-auth/react";
import { useRef } from "react";

export default function NewEmployee() {
  const { data: session } = useSession();
  const permission = session?.user.permission;
  const createformRef = useRef<HTMLFormElement>(null);

  const handleSubmitClick = () => {
    console.log("clicked");
    createformRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(createformRef.current!);
      const password = formData.get("password") as string;
      const hashedPassword = await hash(password, 10);
      formData.set("password", hashedPassword);

      console.log("Form Data:", Object.fromEntries(formData.entries()));
      const res = await createUser(formData);
      console.log(res);
    } catch (error) {
      console.error("Failed to update employee info:", error);
    }
  };

  return (
    <Holds className="w-full h-full p-2">
      <Grids rows="10" gap="5">
        <Holds position="row" className="row-span-2 h-full px-2">
          <Holds className="w-1/2 h-full items-end">
            <Holds position="row" className="w-2/3 justify-end flex gap-4">
              <Holds>
                <Buttons
                  background="green"
                  type="button"
                  onClick={handleSubmitClick}
                >
                  <Titles size="h5">Create Employee</Titles>
                </Buttons>
              </Holds>
            </Holds>
          </Holds>
        </Holds>

        <form
          ref={createformRef}
          onSubmit={handleSubmit}
          className="row-span-8 h-full"
        >
          <Holds position="row" className="w-full h-full p-4">
            <Holds className="w-2/3 h-full ">
              <Holds position={"row"} className="gap-14 h-full mb-20 ">
                <Holds className="w-1/2 h-full ">
                  <Inputs
                    className="h-10"
                    type="hidden"
                    name="image"
                    value=""
                  />
                  <Labels size={"p6"}>
                    First Name
                    <Inputs className="h-10" type="text" name="firstName" />
                  </Labels>
                  <Labels size={"p6"}>
                    Last Name
                    <Inputs className="h-10" type="text" name="lastName" />
                  </Labels>

                  <Labels size={"p6"}>
                    Username
                    <Inputs className="h-10" type="text" name="username" />
                  </Labels>
                  <Labels size={"p6"}>
                    Temporary Password
                    <Inputs className="h-10" type="text" name="password" />
                  </Labels>

                  <Labels size={"p6"}>
                    Email
                    <Inputs className="h-10" type="text" name="email" />
                  </Labels>
                  <Labels size={"p6"}>
                    Date of Birth
                    <Inputs className="h-10" type="date" name="DOB" />
                  </Labels>
                  <Labels size={"p6"}>
                    Phone Number
                    <Inputs className="h-10" type="tel" name="phoneNumber" />
                  </Labels>
                </Holds>
                <Holds className="w-1/2 h-full">
                  <Holds className="h-full  ">
                    <Holds className="h-full flex justify-start">
                      <Labels size={"p6"}>
                        Emergency Contact
                        <Inputs
                          className="h-10"
                          type="text"
                          name="emergencyContact"
                        />
                      </Labels>
                      <Labels size={"p6"}>
                        Emergency Contact Number
                        <Inputs
                          className="h-10"
                          type="tel"
                          name="emergencyContactNumber"
                        />
                      </Labels>
                    </Holds>
                  </Holds>
                </Holds>
              </Holds>
            </Holds>
            <Holds className="w-[2px] h-full bg-black mx-5 border-none"></Holds>
            <Holds className="w-1/3 h-full">
              {/* This section is for the permission level to display, the user will be able to change the permission level differently based on roles*/}
              {/*Super admin can change the permission level of anyone */}
              {permission === "SUPERADMIN" ? (
                <Labels size={"p6"}>
                  Permission Level
                  <Selects name="permission">
                    <Options value="SUPERADMIN">Super Admin</Options>
                    <Options value="ADMIN">Admin</Options>
                    <Options value="MANAGER">Manager</Options>
                    <Options value="USER"> User</Options>
                  </Selects>
                </Labels>
              ) : (
                //the other cannt change the permission level
                <Labels size={"p6"}>
                  Permission Level
                  <Selects name="permission">
                    <Options value="SUPERADMIN">Super Admin</Options>
                    <Options value="ADMIN">Admin</Options>
                    <Options value="MANAGER">Manager</Options>
                    <Options value=" USER"> User</Options>
                  </Selects>
                </Labels>
              )}

              <Labels size={"p6"}>
                Truck View
                <Selects name="truckView">
                  <Options value="false">False</Options>
                  <Options value="true">True</Options>
                </Selects>
              </Labels>
              <Labels size={"p6"}>
                Tasco View
                <Selects name="tascoView">
                  <Options value="false">False</Options>
                  <Options value="true">True</Options>
                </Selects>
              </Labels>
              <Labels size={"p6"}>
                Labor View
                <Selects name="laborView">
                  <Options value="false">False</Options>
                  <Options value="true">True</Options>
                </Selects>
              </Labels>
              <Labels size={"p6"}>
                Mechanic View
                <Selects name="mechanicView">
                  <Options value="false">False</Options>
                  <Options value="true">True</Options>
                </Selects>
              </Labels>
            </Holds>
          </Holds>
        </form>
      </Grids>
    </Holds>
  );
}
