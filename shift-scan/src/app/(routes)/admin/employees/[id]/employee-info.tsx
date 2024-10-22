"use server";
import prisma from "@/lib/prisma";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
type Params = Promise<{ id: string }>;
export default async function employeeInfo({ params }: { params: Params }) {
  const id = (await params).id;
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
      <Holds>
        <TitleBoxes
          title={`${employee?.firstName} ${employee?.lastName}`}
          titleImg={employee?.image ?? "/profile-default.svg"}
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
          type="profilePic"
        />
      </Holds>
      <Holds>
        <Forms>
          <Labels>Phone Number</Labels>
          <Inputs
            type="default"
            state="disabled"
            data={contacts?.phoneNumber ?? ""}
          ></Inputs>
          <Labels>Email</Labels>
          <Inputs
            type="default"
            state="disabled"
            data={contacts?.email ?? ""}
          ></Inputs>
          <Labels>Emergency Contact</Labels>
          <Inputs
            type="default"
            state="disabled"
            data={contacts?.emergencyContact ?? ""}
          ></Inputs>
          <Labels>Emergency Contact Number</Labels>
          <Inputs
            type="default"
            state="disabled"
            data={contacts?.emergencyContactNumber ?? ""}
          ></Inputs>
          <Labels>Date of Birth</Labels>
          <Inputs
            type="default"
            state="disabled"
            data={employee?.DOB ?? ""}
          ></Inputs>
        </Forms>
      </Holds>
    </Contents>
  );
}
