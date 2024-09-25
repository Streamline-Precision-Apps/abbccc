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
        <Holds size={"titleBox"}>
            <TitleBoxes
              title={`${employee?.firstName} ${employee?.lastName}`}
              titleImg={employee?.image ?? "/johnDoe.webp"}
              titleImgAlt="Team"
              variant={"default"}
              size={"default"}
              type="profilePic"
            />
        </Holds>
        <Holds size={"dynamic"}>
          <Forms>
            <Labels variant="default">{t("PhoneNumber")}</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.phoneNumber}></Inputs>
            <Labels variant="default">{t("Email")}</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.email}></Inputs>
            <Labels variant="default">{t("EmergencyContact")}</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.emergencyContact}></Inputs>
            <Labels variant="default">{t("EmergencyContactNumber")}</Labels>
            <Inputs variant="default" type="default" state="disabled" data={contacts?.emergencyContactNumber}></Inputs>
            <Labels variant="default">{t("DOB")}</Labels>
            <Inputs variant="default" type="default" state="disabled" data={employee?.DOB}></Inputs>
          </Forms>
        </Holds>
    </Contents>
  );
}
