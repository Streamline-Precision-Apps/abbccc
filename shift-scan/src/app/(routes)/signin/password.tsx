"use client";
import { useFormStatus } from "react-dom";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { setLocale } from "@/actions/cookieActions";
import { Forms } from "@/components/(reusable)/forms";
import { Holds } from "@/components/(reusable)/holds";

type props = {
    locale: string
}

export default function SignInForm( {locale}: props) {
    const [viewSecret, setViewSecret] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animation, setAnimation] = useState(false);
    const router = useRouter();

    
    const t = useTranslations("PortalLogin");
    
    const viewPasscode = () => {
        setViewSecret(!viewSecret);
    };
    
    const LocaleHandler = async (event: ChangeEvent<HTMLInputElement> ) => {
        await setLocale( event.target.checked );
        router.refresh();
        
    }
    
const handleSubmit = async (event: React.FormEvent) => {
setAnimation(true);
event.preventDefault();
const formData = new FormData(event.currentTarget as HTMLFormElement);

const result = await signIn("credentials", {
    redirect: false,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
});


if (result?.error) {
    setError("Invalid credentials. Please try again.");
    setAnimation(false);
} else {
    router.push("/");
    setAnimation(false);
}
};

return (
<Forms onSubmit={handleSubmit}>
    <Holds>
        <Labels size="default" type="title">{t("Username")}</Labels>
        <Inputs variant="default" name="username" type="text" required />
        <Contents variant="row" size={null} >
            <Labels size="default" type="title">{t("Password")}</Labels>
            <Images
                titleImg={viewSecret ? "/eye.svg" : "/eye-slash.svg"}
                titleImgAlt="eye"
                variant="icon"
                size="password"
                onClick={viewPasscode}
            />
        </Contents>
        <Inputs variant="default" name="password" type={viewSecret ? "text" : "password"} required />
    </Holds>
    {error && <Texts variant="default" size="default">{error}</Texts>}
    <Contents size="container">
        <Buttons variant="link" position="right" size="half" onClick={() => router.push("/login/forgotpassword")}>
            <Texts size={"p4"} variant={"default"}>{t("btn-forgot")}</Texts>
        </Buttons>
    </Contents>
    <Contents variant="row" size="container">
    <Contents size="container">
            <Images titleImg="/new/biometrics.svg" titleImgAlt="biometrics" variant="icon" position="left" size="half" />
        </Contents>
        <Contents size="container">
            <Buttons variant="green" position="center" size="fill" type="submit" >
            {animation && <Images titleImg="/spinner.svg" titleImgAlt="login" variant="icon" size={"password"} className="animate-spin" />}
            {!animation &&<Titles >{t("btn-signIn")}</Titles>}
            </Buttons>
        </Contents>
    </Contents>


    <Contents variant="row" size={null}>
    <Texts size="p1">{t("Spanish")}</Texts>
    <Inputs variant="password" name="locale" type="checkbox" 
        value="true" onChange={(e) => LocaleHandler(e)} 
    />
    </Contents>
</Forms>
);
} 