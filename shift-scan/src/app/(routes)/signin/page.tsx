"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import Password from "./password";
import { cookies } from "next/headers";
import { Holds } from "@/components/(reusable)/holds";

export default async function SignInPage() {
  const locale = cookies().get("locale")?.value || "en";
  return (
    <Bases>
      <Contents>
          <Images 
          titleImg="/logo.svg" 
          titleImgAlt="logo" 
          background="white" 
          size="40" 
          className="mb-5 p-3"/>
          <Holds background={"white"}>
            <Password locale={locale}/>
          </Holds>
      </Contents>
    </Bases> 
  );
}