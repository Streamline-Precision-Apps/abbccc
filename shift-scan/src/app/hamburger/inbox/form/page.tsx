"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import Content from "@/app/hamburger/inbox/form/content";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

export default async function Form() {
  const session = await auth();
  if (!session) return null;

  return (
    <Bases size={"scroll"}>
      <Contents className="my-5">
        <Grids className="grid-rows-10 gap-5">
          <Holds background={"green"} className="row-span-2 h-full">
            <TitleBoxes
              title="Leave Request Form"
              titleImg="/Inbox.svg"
              titleImgAlt="Inbox"
              type="noIcon"
            />
          </Holds>
          <Holds className="row-span-8 h-full">
            <Content session={session} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
