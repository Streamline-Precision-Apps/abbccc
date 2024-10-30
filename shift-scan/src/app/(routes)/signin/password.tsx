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
import { Forms } from "@/components/(reusable)/forms";
import { Holds } from "@/components/(reusable)/holds";
import Checkbox from "@/components/(inputs)/checkBox";
import Link from "next/link";

export default function SignInForm() {
  const [viewSecret, setViewSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animation, setAnimation] = useState(false);
  const router = useRouter();

  const t = useTranslations("Login");

  const viewPasscode = () => {
    setViewSecret(!viewSecret);
  };

  const LocaleHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    await setLocale(event.target.checked);
    router.refresh();
  };

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
      setError(t("Err"));
      setAnimation(false);
      setTimeout(() => setError(""), 3000);
    } else {
      router.push("/");
      setAnimation(false);
    }
  };

  return (
    <Contents width={"section"}>
      <Forms onSubmit={handleSubmit} className="pt-3">
        <Labels>{t("EmployeeID")}</Labels>
        <Inputs variant="default" name="username" type="text" required />
        <Holds position={"row"}>
          <Labels>{t("Password")}</Labels>
          <Images
            titleImg={viewSecret ? "/eye.svg" : "/eye-slash.svg"}
            titleImgAlt="eye"
            background="none"
            size="10"
            onClick={viewPasscode}
          />
        </Holds>
        <Inputs
          variant="default"
          name="password"
          type={viewSecret ? "text" : "password"}
          required
        />
        <Holds position={"row"}>
          {error && (
            <Holds position={"left"}>
              <Texts text={"red"} size={"p4"}>
                {error}
              </Texts>
            </Holds>
          )}
          <Holds className="mb-10 ">
            <Link href="/signin/forgot-password">
              <Texts text={"link"} size={"p5"} position={"right"}>
                {t("Btn-forgot")}
              </Texts>
            </Link>
          </Holds>
        </Holds>

        <Holds position={"row"} className="mb-10">
          <Holds size={"30"}>
            <Images
              titleImg="/biometrics.svg"
              titleImgAlt="biometrics"
              background="none"
              position="left"
              size="50"
            />
          </Holds>
          <Holds size={"70"}>
            <Buttons background="green" type="submit">
              {animation && (
                <Images
                  titleImg="/spinner.svg"
                  titleImgAlt="login"
                  size={"30"}
                  className="animate-spin"
                />
              )}
              {!animation && <Titles className="p-3">{t("Btn-signIn")}</Titles>}
            </Buttons>
          </Holds>
        </Holds>
        <Holds position="row" className="mb-3">
          <Holds size={"70"}>
            <Texts size="p2">{t("Spanish")}</Texts>
          </Holds>
          <Holds size={"30"}>
            <Checkbox
              id={"1"}
              label={""}
              onChange={(e) => LocaleHandler(e)}
              name="locale"
            />
          </Holds>
        </Holds>
      </Forms>
    </Contents>
  );
}
