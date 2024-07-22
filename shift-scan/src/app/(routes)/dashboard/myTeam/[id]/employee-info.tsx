import prisma from "@/lib/prisma";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { TitleContainer } from "@/components/(text)/title_container";
import Image from "next/image";

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
    <div className=" h-auto w-full lg:w-1/2 m-auto border-t-2 border-l-2 border-r-2 p-5 border-black rounded-t-2xl">
      <div className=" h-full w-11/12 flex flex-col items-center mx-auto rounded-2xl">
        <TitleBoxes
          title="My Team"
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
        <div className="mt-12 mb-3 bg-white h-full w-full flex flex-col   p-5 rounded-2xl overflow-y-auto">
          <TitleContainer TitleofContainer="Phone">
            {contacts?.phone_number}
          </TitleContainer>
          <TitleContainer TitleofContainer="Email">
            {contacts?.email}
          </TitleContainer>
          <TitleContainer TitleofContainer="Emergency Contact">
            {contacts?.emergency_contact}
          </TitleContainer>
          <TitleContainer TitleofContainer="Emergency Contact Number">
            {contacts?.emergency_contact_no}
          </TitleContainer>
          <TitleContainer TitleofContainer="Birthdate">
            {employee?.DOB}
          </TitleContainer>
        </div>
      </div>
    </div>
  );
}
