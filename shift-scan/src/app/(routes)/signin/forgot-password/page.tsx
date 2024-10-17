"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";

import { cookies } from "next/headers";
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
import { set } from "zod";

export default function ForgotPassword() {
  const [message, setMessage] = useState<string>("");
  const [color, SetColor] = useState<string>("");
  const handlePasswordReset = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
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
    <Bases className="h-full min-h-screen">
      <Contents>
        <Grids rows={"5"} gap={"5"}>
          <Holds>
            <Images
              titleImg="/logo.svg"
              titleImgAlt={`logo`}
              background="white"
              size="40"
              className="mb-5 p-3 row-span-1"
            />
          </Holds>
          <Holds background={"white"} className="h-full row-span-4">
            <Contents width={"section"}>
              <Holds className="row-span-1 ">
                <Holds size={"80"}>
                  <Titles size={"h2"}>Return to sign in</Titles>
                </Holds>
                <Holds size={"20"} className="mx-auto">
                  <Buttons href="/signin" size={"90"}>
                    <Images
                      titleImg="/backArrow.svg"
                      titleImgAlt={`back`}
                      className="mx-auto"
                    />
                  </Buttons>
                </Holds>
              </Holds>
              <Holds className="row-span-1">
                <Holds size={"20"} className="my-auto">
                  <Images titleImg="/key.svg" titleImgAlt={`key`} />
                </Holds>
                <Holds size={"80"} className="my-auto">
                  <Titles size={"h1"}>Forgot Password?</Titles>
                </Holds>
              </Holds>
              <Holds className="row-span-1">
                <Texts size={"p3"}>
                  Enter your email and we will send you a link to reset your
                  password.
                </Texts>
              </Holds>
              <Holds
                className={
                  color === "green"
                    ? "row-span-1 bg-app-green"
                    : color === "red"
                    ? "row-span-1 bg-app-red"
                    : `row-span-1`
                }
              >
                <Texts size={"p3"}>{message}</Texts>
              </Holds>
              <Holds className="row-span-1 h-full">
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
                  <Holds className="mt-5">
                    <Buttons type="submit" className="py-5">
                      <Titles size={"h2"}> Send email</Titles>
                    </Buttons>
                  </Holds>
                </Forms>
              </Holds>
            </Contents>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
