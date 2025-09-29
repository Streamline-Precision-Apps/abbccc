"use server";
import { Bases } from "@/components/(reusable)/bases";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfilePage from "./accountSettings";
import { Contents } from "@/components/(reusable)/contents";
import { Suspense } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

function ProfileSkeleton() {
  return (
    <Grids rows={"6"} gap={"5"} className="h-full w-full">
      <Holds
        background={"white"}
        size={"full"}
        className="row-start-1 row-end-2 h-full bg-white animate-pulse  "
      >
        <TitleBoxes>
          <div className="w-full flex justify-center relative">
            <div className="w-[80px] h-[80px] relative">
              <Images
                titleImg={"/profileEmpty.svg"}
                titleImgAlt="profile"
                className={`w-full h-full rounded-full object-cover `}
              />
              <Holds className="absolute bottom-2 right-0 translate-x-1/4 translate-y-1/4 rounded-full h-8 w-8 border-[2px] p-0.5 justify-center items-center border-black bg-app-gray">
                <Images titleImg="/camera.svg" titleImgAlt="camera" />
              </Holds>
            </div>
          </div>
        </TitleBoxes>
      </Holds>

      <Holds
        background={"white"}
        className=" row-start-2 row-end-7 h-full  bg-white animate-pulse "
      ></Holds>
    </Grids>
  );
}

export default async function EmployeeProfile() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const userId = session.user.id;
  return (
    <Bases>
      <Contents>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfilePage userId={userId} />
        </Suspense>
      </Contents>
    </Bases>
  );
}
