    "use client";

    import { Buttons } from "@/components/(reusable)/buttons";
    import { Contents } from "@/components/(reusable)/contents";
    import { Images } from "@/components/(reusable)/images";
    import { Inputs } from "@/components/(reusable)/inputs";
    import { Labels } from "@/components/(reusable)/labels";
    import { FormEventHandler, useState } from "react";
    import { useRouter } from "next/navigation";
    import { Titles } from "@/components/(reusable)/titles";
    import { Texts } from "@/components/(reusable)/texts";
    import { useTranslations } from "next-intl";
    import { signIn } from "next-auth/react";
    import { Forms } from "@/components/(reusable)/forms";

    export default function SignInForm({ provider} : any) {
    const [viewSecret, setViewSecret] = useState(false);
    const router = useRouter();
    const t = useTranslations("PortalLogin");

    const viewPasscode = () => {
        setViewSecret(!viewSecret);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        try {
        await signIn(provider.id, {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,
        });


        router.push("/");  // Redirect to home on successful sign-in
        } catch (error) {
        console.error("Sign-in error:", error);
        router.push(`/signin?error=${provider.id}`);
        }
    };

    return (
        <Forms  onSubmit={(e)=>handleSubmit(e)}>
        <Labels size="default" type="title">{t("Username")}</Labels>
        <Inputs variant="default" name="username" type="text" required />
        
        <Labels size="default" type="title">{t("Password")}</Labels>
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
        
        <Buttons variant="icon" size="forgotpassword" onClick={() => router.push("/login/forgotpassword")}>
            {t("btn-forgot")}
        </Buttons>
        
        <Buttons variant="default" size="widgetLg" type="submit">
            <Titles variant="default" size="h2">{t("btn-signIn")}</Titles>
        </Buttons>
        
        <Contents variant="rowCenter" size={null}>
            <Texts size="p1">{t("Spanish")}</Texts>
            <Inputs variant="password" name="locale" type="checkbox" value="true" />
        </Contents>
        </Forms>
    );
    }