"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { use, useEffect, useState } from "react";

export default function employee({ params }: { params: { employee: string } }) {
  const [image, SetImage] = useState("");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, SetLastName] = useState<string>("");
  const [DOB, SetDOB] = useState("");
  const [username, SetUsername] = useState("");
  const [email, SetEmail] = useState("");

  const [signature, SetSignature] = useState("");
  const [truckView, SetTruckView] = useState("");
  const [mechanicView, SetMechanicView] = useState("");
  const [laborView, SetLaborView] = useState("");
  const [tascoView, SetTascoView] = useState("");
  const [permission, SetPermission] = useState("");
  const [activeEmployee, SetActiveEmployee] = useState("");
  const [startDate, SetStartDate] = useState("");
  const [terminationDate, SetTerminationDate] = useState("");

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      const response = await fetch(`/api/employeeInfo/${params.employee}`);
      const data = await response.json();
      console.log(data);
      SetImage(data.image);

      setFirstName(data.firstName);
      SetLastName(data.lastName);
      SetDOB(data.DOB);
      SetUsername(data.username);
      SetEmail(data.email);

      SetSignature(data.signature);
      SetTruckView(data.truckView);
      SetMechanicView(data.mechanicView);
      SetLaborView(data.laborView);
      SetTascoView(data.tascoView);
      SetPermission(data.permission);
      SetActiveEmployee(data.activeEmployee);
      SetStartDate(data.startDate);
      SetTerminationDate(data.terminationDate);
    };
    fetchEmployeeInfo();
  }, [params.employee]);
  return (
    <Holds className="w-full h-full p-2">
      <Grids rows={"10"} gap={"5"}>
        <Holds background={"orange"} className="row-span-3 h-full">
          <Texts>{params.employee}</Texts>
        </Holds>

        <Holds
          position={"row"}
          background={"orange"}
          className=" row-span-7 h-full"
        >
          <Holds>
            <Texts>{params.employee}</Texts>
          </Holds>
          <Holds>
            <Texts>{params.employee}</Texts>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
