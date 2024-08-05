import prisma from "@/lib/prisma";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Image from "next/image";
import { Sections } from "@/components/(reusable)/sections";

export default async function employeeInfo({ params }: Params) {
  const id = params.id;
  const employee = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      timeSheet: true, // we want there hours to perform CRUD operations.
    },
  });

  const contacts = await prisma.contact.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return (
    <div className=" h-auto w-full lg:w-1/2 m-auto">
      {/* <div className=" h-full w-11/12 flex flex-col items-center mx-auto rounded-2xl"> */}
        <Sections size={"titleBox"}>
          <TitleBoxes
            title={`${employee?.firstName} ${employee?.lastName}`}
            titleImg="/profile.svg"
            titleImgAlt="Team"
            variant={"default"}
            size={"default"}
          />
        </Sections>
        <div className="mt-12 mb-3 bg-white h-full w-full flex flex-col   p-5 rounded-2xl overflow-y-auto">
          <TitleBoxes title="Phone" titleImg="/phone.svg" titleImgAlt="Phone" type="titleOnly" variant={"default"} size={"default"}>
            {contacts?.phone_number}
          </TitleBoxes>
          <TitleBoxes title="Email" titleImg="/email.svg" titleImgAlt="Email" type="titleOnly" variant={"default"} size={"default"}>
            {contacts?.email}
          </TitleBoxes>
          <TitleBoxes title="Emergency Contact" titleImg="/emergency.svg" titleImgAlt="Emergency Contact" type="titleOnly" variant={"default"} size={"default"}>
            {contacts?.emergency_contact}
          </TitleBoxes>
          <TitleBoxes title="Emergency Contact Number" titleImg="/phone.svg" titleImgAlt="Emergency Contact Number" type="titleOnly" variant={"default"} size={"default"}>
            {contacts?.emergency_contact_no}
          </TitleBoxes>
          <TitleBoxes title="Date of Birth" titleImg="/dob.svg" titleImgAlt="Date of Birth" type="titleOnly" variant={"default"} size={"default"}>
            {employee?.DOB}
          </TitleBoxes>
        {/* </div> */}
      </div>
    </div>
  );
}
