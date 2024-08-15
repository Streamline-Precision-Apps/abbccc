import { redirect } from "next/navigation";
import { signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { Forms } from "@/components/(reusable)/forms";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { Images } from "@/components/(reusable)/images";
import Password from "./password";

export default function SignInPage() {
  return (
    <Bases>
      <Contents variant="default">
        <Contents variant="default" size="logo">
          <Images titleImg="/logo.svg" titleImgAlt="logo" variant="icon" size="default" />
        </Contents>
        <Sections size="dynamic">
          <Contents variant="center" size="default">
            {Object.values(providerMap).map((provider) => (
             <Password key={provider.id} provider={provider}/>
            ))}
          </Contents>
        </Sections>
      </Contents>
    </Bases>
  );
}