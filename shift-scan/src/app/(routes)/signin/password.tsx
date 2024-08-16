"use client";

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

type props = {
    locale: string
}
export default function SignInForm( {locale}: props) {
const [viewSecret, setViewSecret] = useState(false);
const [error, setError] = useState<string | null>(null);
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
event.preventDefault();
const formData = new FormData(event.currentTarget as HTMLFormElement);

const result = await signIn("credentials", {
    redirect: false,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
});

if (result?.error) {
    setError("Invalid credentials. Please try again.");
} else {
    router.push("/");
}
};

return (
<form onSubmit={handleSubmit}>
    <Labels size="default" type="title">
    {t("Username")}
    </Labels>
    <Inputs variant="default" name="username" type="text" required />

    <Labels size="default" type="title">
    {t("Password")}
    </Labels>
    <Contents variant="row" size={null}>
    <Inputs variant="default" name="password" type={viewSecret ? "text" : "password"} required />
    <Images
        titleImg={viewSecret ? "/eye.svg" : "/eye-slash.svg"}
        titleImgAlt="eye"
        variant="icon"
        size="password"
        onClick={viewPasscode}
    />
    </Contents>

    {error && <Texts variant="default" size="default">{error}</Texts>}

    <Buttons variant="default" size="default" type="submit">
    {t("btn-signin")}
    </Buttons>

    <Buttons variant="icon" size="forgotpassword" onClick={() => router.push("/login/forgotpassword")}>
    {t("btn-forgot")}
    </Buttons>

    <Contents variant="rowCenter" size={null}>
    <Texts size="p1">{t("Spanish")}</Texts>
    <Inputs variant="password" name="locale" type="checkbox" value="true" onChange={(e) => LocaleHandler(e)} />
    </Contents>
</form>
);
} 