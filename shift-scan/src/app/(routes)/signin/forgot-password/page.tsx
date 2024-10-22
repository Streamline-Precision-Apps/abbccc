"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import { Grids } from "@/components/(reusable)/grids";
import { Buttons } from "@/components/(reusable)/buttons";
import { Forms } from "@/components/(reusable)/forms";
import { Reset } from "@/actions/reset";
import { useState } from "react";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default function ForgotPassword() {
  const [message, setMessage] = useState<string>("");
  const [color, SetColor] = useState<string>("");
  const handlePasswordReset = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await Reset(formData);
    if (result?.error) {
      SetColor("red");
    }
    if (result?.success) {
      SetColor("green");
    } else {
      SetColor("");
    }
    setMessage(result?.success || result?.error || "");
    setTimeout(() => {
      setMessage("");
      SetColor("");
    }, 3000);
  };
  return (
    <Bases>
      <Contents>
        <Grids rows={"5"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 ">
            <Contents width={"section"}>
              <TitleBoxes
                title={"Return to sign in"}
                titleImg={"/key.svg"}
                titleImgAlt={"key"}
                href="/signin"
              />
            </Contents>
          </Holds>

          <Holds background={"white"} className="h-full row-span-4">
            <Contents width={"section"}>
              <Grids rows={"4"} gap={"5"}>
                <Holds className="row-span-1">
                  <Texts size={"p3"}>
                    Enter your email and we will send you a link to reset your
                    password.
                  </Texts>
                </Holds>
                <Holds className="row-span-3 h-full my-auto">
                  <Forms onSubmit={handlePasswordReset} className="h-full">
                    <Labels>
                      Email
                      <Inputs
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                      />
                    </Labels>
                    <Holds>
                      <Texts
                        size={"p3"}
                        className={
                          color === "green"
                            ? "text-emerald-600/80"
                            : " text-red-600"
                        }
                      >
                        {message}
                      </Texts>
                    </Holds>
                    <Holds className="mt-5">
                      <Buttons type="submit" className="py-5">
                        <Titles size={"h2"}> Send email</Titles>
                      </Buttons>
                    </Holds>
                  </Forms>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
