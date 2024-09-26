import prisma from "@/lib/prisma";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";

export default async function employeeInfo({ params }: Params) {
  const id = params.id;
  const employee = await prisma.users.findUnique({
    where: {
      id: id.toString(),
    },
    include: {
      timeSheet: true, // we want there hours to perform CRUD operations.
    },
  });

  const contacts = await prisma.contacts.findUnique({
    where: {
      employeeId: id,
    },
  });

  return (
<Contents>
        <Holds 
        background={"white"}
        className="mb-3">
            <TitleBoxes
              title={`${employee?.firstName} ${employee?.lastName}`}
              titleImg={employee?.image ?? "/johnDoe.webp"}
              titleImgAlt="Team"
              type="profilePic"
            />
        </Holds>
        <Holds background={"white"}>
          <Contents width={"section"}>
            <Forms>
              <Labels>Phone Number
                <Inputs state="disabled" data={contacts?.phoneNumber}></Inputs>
              </Labels>
              <Labels>Email
                <Inputs state="disabled" data={contacts?.email}></Inputs>
              </Labels>
              <Labels>Emergency Contact
                <Inputs state="disabled" data={contacts?.emergencyContact}></Inputs>
              </Labels>
              <Labels>Emergency Contact Number
                <Inputs state="disabled" data={contacts?.emergencyContactNumber}></Inputs>
              </Labels>
              <Labels>Date of Birth
                <Inputs state="disabled" data={employee?.DOB}></Inputs>
              </Labels>
            </Forms>
          </Contents>
        </Holds>
    </Contents>
  );
}
