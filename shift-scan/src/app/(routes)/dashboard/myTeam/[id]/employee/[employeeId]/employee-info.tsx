import prisma from "@/lib/prisma";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { getTranslations } from "next-intl/server";

export default async function employeeInfo({ params }: { params: { employeeId: string } }) {
  const t = await getTranslations("MyTeam");
  const id = params.employeeId;
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
              <Labels>{t("PhoneNumber")}
                <Inputs state="disabled" data={contacts?.phoneNumber}></Inputs>
              </Labels>
              <Labels>{t("Email")}
                <Inputs state="disabled" data={contacts?.email}></Inputs>
              </Labels>
              <Labels>{t("EmergencyContact")}
                <Inputs state="disabled" data={contacts?.emergencyContact}></Inputs>
              </Labels>
              <Labels>{t("EmergencyContactNumber")}
                <Inputs state="disabled" data={contacts?.emergencyContactNumber}></Inputs>
              </Labels>
              <Labels>{t("DOB")}
                <Inputs state="disabled" data={employee?.DOB}></Inputs>
              </Labels>
            </Forms>
          </Contents>
        </Holds>
    </Contents>
  );
}
