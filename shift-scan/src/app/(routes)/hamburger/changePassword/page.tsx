"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import ChangePassword from "@/app/(routes)/hamburger/changePassword/changepassword";
import { auth } from "@/auth";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";

export default async function Index() {
  const session = await auth();
  if (!session) return null;
  const userId = session.user.id;

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"}>
          <Holds
            background={"white"}
            size={"full"}
            className="row-start-1 row-end-2 h-full"
          >
            <TitleBoxes>
              <Holds position={"row"} className="w-full justify-center ">
                <Titles size={"h2"}>Change Password</Titles>
                <Images
                  titleImg="/key.svg"
                  titleImgAlt="Change Password Icon"
                  className=" w-8 h-8 pl-2"
                />
              </Holds>
            </TitleBoxes>
          </Holds>
          <Holds className=" row-start-2 row-span-8 h-full ">
            <ChangePassword userId={userId} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
