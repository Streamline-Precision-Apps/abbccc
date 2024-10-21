"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import ChangePassword from "@/app/hamburger/changePassword/changepassword";
import { auth } from "@/auth";

export default async function Index() {
  const session = await auth();
  if (!session) return null;
  const userId = session.user.id;

  return (
    <Bases>
      <Contents>
        <Grids rows={"10"} gap={"5"}>
          <Holds
            background={"white"}
            size={"full"}
            className="row-span-2 p-4 h-full"
          >
            <Contents width={"section"}>
              <TitleBoxes
                title="Change Password"
                titleImg="/settings.svg"
                titleImgAlt="Change Password Icon"
              />
            </Contents>
          </Holds>
          <Holds className=" row-span-8 h-full ">
            <ChangePassword userId={userId} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
