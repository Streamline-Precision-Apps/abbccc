import prisma from "@/lib/prisma";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";

export default async function employeeInfo({ params }: Params) {
  const id = params.id;
  const employee = await prisma.user.findUnique({
    where: {
      id: id.toString(),
    },
    include: {
      timeSheet: true, // we want there hours to perform CRUD operations.
    },
  });

  const contacts = await prisma.contact.findUnique({
    where: {
      employee_id: id,
    },
  });

  return (
<Contents>
        <Sections size={"titleBox"}>
            <TitleBoxes
              title={`${employee?.firstName} ${employee?.lastName}`}
              titleImg={employee?.image ?? "/johnDoe.webp"}
              titleImgAlt="Team"
              variant={"default"}
              size={"default"}
              type="profilePic"
            />
        </Sections>
        <Sections size={"dynamic"}>
          <Forms>
            <Labels variant="default">Phone Number</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.phone_number}></Inputs>
            <Labels variant="default">Email</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.email}></Inputs>
            <Labels variant="default">Emergency Contact</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.emergency_contact}></Inputs>
            <Labels variant="default">Emergency Contact Number</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.emergency_contact_no}></Inputs>
            <Labels variant="default">Date of Birth</Labels>
            <Inputs variant="default" type="default" state="disabled" data={employee?.DOB}></Inputs>
          </Forms>
        </Sections>
    </Contents>
  );
}
